// site/src/app/api/clamp/route.ts — POST /api/clamp microservice endpoint
import { type NextRequest, NextResponse } from 'next/server'
import { clampFont } from '@overpunch/vf-clamp'
import type { OutputConfig, OutputFormat } from '@overpunch/vf-clamp'

interface ClampRequest {
	/** URL of the source variable font. Fetched server-side — must be publicly accessible. */
	fontUrl: string
	/** One entry per restricted variant to produce */
	outputs: OutputConfig[]
	/** Output format — 'ttf' (default), 'otf', 'woff', or 'woff2' */
	format?: OutputFormat
	/** Refuse (422) any output whose range would include named instances that were not listed (axes-only outputs list none) */
	strict?: boolean
}

interface ClampResponseResult {
	name: string
	/** Base64-encoded restricted font */
	data: string
	/** Format of the returned font binary */
	format: OutputFormat
	/** Byte size of the restricted font */
	size: number
}

interface ClampResponse {
	results: ClampResponseResult[]
}

/** Largest source font the endpoint will fetch, in bytes (20 MB). */
const MAX_FONT_BYTES = 20 * 1024 * 1024
/** How long the endpoint waits for the source font, in ms. */
const FETCH_TIMEOUT_MS = 15_000

/** True for hostnames that point at the server itself or a private network (blocked to avoid server-side request forgery). */
function isPrivateHost(host: string): boolean {
	const h = host.toLowerCase().replace(/^\[|\]$/g, '')
	return h === 'localhost' || h.endsWith('.localhost') || h.endsWith('.internal') || h === '::1' || h === '0.0.0.0'
		|| /^127\./.test(h) || /^10\./.test(h) || /^192\.168\./.test(h) || /^169\.254\./.test(h)
		|| /^172\.(1[6-9]|2\d|3[01])\./.test(h) || /^f[cd][0-9a-f]{2}:/.test(h) || /^fe80:/.test(h)
}

/** Reads a response body up to MAX_FONT_BYTES; throws if it is larger. */
async function readCapped(res: Response): Promise<ArrayBuffer> {
	const declared = Number(res.headers.get('content-length') || 0)
	if (declared > MAX_FONT_BYTES) throw new Error(`font is larger than ${MAX_FONT_BYTES / 1024 / 1024} MB`)
	const reader = res.body?.getReader()
	if (!reader) return res.arrayBuffer()
	const chunks: Uint8Array[] = []
	let total = 0
	for (;;) {
		const { done, value } = await reader.read()
		if (done) break
		total += value.byteLength
		if (total > MAX_FONT_BYTES) { await reader.cancel(); throw new Error(`font is larger than ${MAX_FONT_BYTES / 1024 / 1024} MB`) }
		chunks.push(value)
	}
	const out = new Uint8Array(total)
	let at = 0
	for (const c of chunks) { out.set(c, at); at += c.byteLength }
	return out.buffer
}

function unauthorized(message: string) {
	return NextResponse.json({ error: message }, { status: 401 })
}

function badRequest(message: string) {
	return NextResponse.json({ error: message }, { status: 400 })
}

export async function POST(req: NextRequest) {
	// Auth
	const apiKey = req.headers.get('x-api-key')
	const expectedKey = process.env.VF_CLAMP_API_KEY

	if (!expectedKey) {
		console.error('VF_CLAMP_API_KEY environment variable is not set')
		return NextResponse.json({ error: 'Service misconfigured' }, { status: 500 })
	}

	if (!apiKey || apiKey !== expectedKey) {
		return unauthorized('Invalid or missing X-API-Key header')
	}

	// Parse body
	let body: ClampRequest
	try {
		body = await req.json()
	} catch {
		return badRequest('Request body must be valid JSON')
	}

	const { fontUrl, outputs, format, strict } = body

	if (!fontUrl || typeof fontUrl !== 'string') {
		return badRequest('fontUrl is required and must be a string')
	}
	let parsedUrl: URL
	try { parsedUrl = new URL(fontUrl) } catch { return badRequest('fontUrl must be an absolute URL') }
	if (parsedUrl.protocol !== 'https:') return badRequest('fontUrl must use https')
	if (isPrivateHost(parsedUrl.hostname)) return badRequest('fontUrl must point to a public host')

	if (!Array.isArray(outputs) || outputs.length === 0) {
		return badRequest('outputs must be a non-empty array')
	}

	if (strict !== undefined && typeof strict !== 'boolean') {
		return badRequest('strict must be a boolean')
	}

	// Validate outputs shape
	for (const o of outputs) {
		if (!o.instances?.length && !o.axes) {
			return badRequest('Each output must have instances, axes, or both')
		}
	}

	// Fetch source font
	let fontBuffer: ArrayBuffer
	try {
		// No redirects: a public URL could otherwise bounce the request to a private address.
		const fontRes = await fetch(parsedUrl, { redirect: 'error', signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) })
		if (!fontRes.ok) {
			return badRequest(`Failed to fetch font: ${fontRes.status} ${fontRes.statusText}`)
		}
		fontBuffer = await readCapped(fontRes)
	} catch (err) {
		return badRequest(`Could not fetch font from URL: ${err instanceof Error ? err.message : String(err)}`)
	}

	// Process
	let clampResults
	try {
		clampResults = await clampFont(fontBuffer, { outputs, format, strict })
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err)
		// Caller errors: a strict violation (422), or an unknown instance name / otf for a TrueType font (400)
		if (message.includes('would include unselected instances')) {
			return NextResponse.json({ error: message }, { status: 422 })
		}
		if (message.includes('not found in font') || message.includes('is ambiguous') || message.includes("format 'otf'") || message.includes('not supported yet')) {
			return badRequest(message)
		}
		console.error('clampFont failed:', err)
		return NextResponse.json({ error: `Font processing failed: ${message}` }, { status: 500 })
	}

	// Encode results as base64
	const results: ClampResponseResult[] = clampResults.map((r) => ({
		name: r.name,
		data: Buffer.from(r.buffer).toString('base64'),
		format: r.format,
		size: r.buffer.byteLength,
	}))

	return NextResponse.json<ClampResponse>({ results })
}
