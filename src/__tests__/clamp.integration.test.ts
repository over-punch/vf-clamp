// src/__tests__/clamp.integration.test.ts — integration tests using real Pyodide + fonttools
import { createRequire } from 'node:module'
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { clampFont } from '../core/clamp.js'
import { getInstances } from '../core/instances.js'

const _require = createRequire(import.meta.url)
const { preparePyodide, PyodideFile } = _require('@web-alchemy/fonttools/src/pyodide.js')

/** Read nameID 1 (Family name) from a TTF buffer via fonttools */
async function readFamilyName(buffer: Uint8Array): Promise<string | null> {
	const pyodide = await preparePyodide()
	const file = new PyodideFile({ pyodide })
	await file.upload(buffer)
	const fn = await pyodide.runPythonAsync(`
from fontTools import ttLib
def get_family_name(path):
    font = ttLib.TTFont(path)
    return font['name'].getDebugName(1) or ''
get_family_name
`)
	const result: string = fn(file.filename)
	file.delete()
	return result || null
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const FIXTURES = join(__dirname, '../../fixtures')

/** Inter[slnt,wght] v4.0 — axes: wght 100–900, slnt -10–0 */
function interVF() {
	return readFileSync(join(FIXTURES, 'Inter-Variable.ttf'))
}

describe('clampFont — integration (real Pyodide + fonttools)', () => {
	it('pinning wght produces a smaller, valid buffer', async () => {
		const input = interVF()
		const results = await clampFont(input, {
			outputs: [{ name: 'Regular', axes: { wght: 400 } }],
		})

		expect(results).toHaveLength(1)
		expect(results[0].name).toBe('Regular')
		expect(results[0].buffer.byteLength).toBeGreaterThan(0)
		expect(results[0].buffer.byteLength).toBeLessThan(input.byteLength)
	}, 120_000)

	it('range-restricting wght produces a smaller, valid buffer', async () => {
		const input = interVF()
		const results = await clampFont(input, {
			outputs: [{ name: 'Text', axes: { wght: { min: 400, max: 700 } } }],
		})

		expect(results[0].buffer.byteLength).toBeGreaterThan(0)
		expect(results[0].buffer.byteLength).toBeLessThan(input.byteLength)
	}, 120_000)

	it('range-restricted output is smaller than the full font but larger than pinned', async () => {
		const input = interVF()
		const [ranged, pinned] = await Promise.all([
			clampFont(input, { outputs: [{ name: 'Range', axes: { wght: { min: 400, max: 700 } } }] }),
			clampFont(input, { outputs: [{ name: 'Pinned', axes: { wght: 400 } }] }),
		])

		expect(ranged[0].buffer.byteLength).toBeGreaterThan(pinned[0].buffer.byteLength)
		expect(ranged[0].buffer.byteLength).toBeLessThan(input.byteLength)
	}, 120_000)

	it('produces correct number of results for multiple subfamilies', async () => {
		const input = interVF()
		const results = await clampFont(input, {
			outputs: [
				{ name: 'Light', axes: { wght: 300 } },
				{ name: 'Regular', axes: { wght: 400 } },
				{ name: 'Bold', axes: { wght: 700 } },
			],
		})

		expect(results).toHaveLength(3)
		expect(results.map((r) => r.name)).toEqual(['Light', 'Regular', 'Bold'])
		results.forEach((r) => {
			expect(r.buffer.byteLength).toBeGreaterThan(0)
			expect(r.buffer.byteLength).toBeLessThan(input.byteLength)
		})
	}, 180_000)

	it('woff format output has wOFF magic bytes', async () => {
		const input = interVF()
		const [result] = await clampFont(input, {
			format: 'woff',
			outputs: [{ name: 'Text', axes: { wght: { min: 400, max: 700 } } }],
		})
		// WOFF magic: 0x774F4646
		expect(result.buffer[0]).toBe(0x77)
		expect(result.buffer[1]).toBe(0x4f)
		expect(result.buffer[2]).toBe(0x46)
		expect(result.buffer[3]).toBe(0x46)
		expect(result.format).toBe('woff')
	}, 180_000)

	it('woff2 format output has wOF2 magic bytes and is smaller than TTF', async () => {
		const input = interVF()
		const [ttf, woff2] = await Promise.all([
			clampFont(input, { outputs: [{ name: 'Text', axes: { wght: { min: 400, max: 700 } } }] }),
			clampFont(input, { format: 'woff2', outputs: [{ name: 'Text', axes: { wght: { min: 400, max: 700 } } }] }),
		])

		// WOFF2 magic: 0x774F4632
		expect(woff2[0].buffer[0]).toBe(0x77)
		expect(woff2[0].buffer[1]).toBe(0x4f)
		expect(woff2[0].buffer[2]).toBe(0x46)
		expect(woff2[0].buffer[3]).toBe(0x32)
		expect(woff2[0].format).toBe('woff2')
		// Brotli compression makes WOFF2 smaller than the equivalent TTF
		expect(woff2[0].buffer.byteLength).toBeLessThan(ttf[0].buffer.byteLength)
	}, 180_000)

	it('name table reflects the output name', async () => {
		const input = interVF()
		const [result] = await clampFont(input, {
			outputs: [{ name: 'Inter Light-Bold', axes: { wght: { min: 300, max: 700 } } }],
		})

		const familyName = await readFamilyName(result.buffer)
		expect(familyName).toBe('Inter Light-Bold')
	}, 120_000)

	it('null axis is omitted — full-range font is returned unchanged', async () => {
		const input = interVF()
		// null means "omit this axis from the instancer call" — font keeps full range
		const results = await clampFont(input, {
			outputs: [{ name: 'Upright', axes: { slnt: null } }],
		})

		expect(results[0].buffer.byteLength).toBeGreaterThan(0)
		// Omitting all axes returns the full font (no reduction in size)
		expect(results[0].buffer.byteLength).toBeGreaterThanOrEqual(input.byteLength * 0.9)
	}, 120_000)
})

describe('getInstances — integration (real Pyodide + fonttools)', () => {
	it('returns axes and named instances for Inter Variable', async () => {
		const input = interVF()
		const result = await getInstances(input)

		// Inter has wght and slnt axes
		expect(result.axes.length).toBeGreaterThanOrEqual(1)
		const wghtAxis = result.axes.find((a) => a.tag === 'wght')
		expect(wghtAxis).toBeDefined()
		expect(wghtAxis!.minimum).toBe(100)
		expect(wghtAxis!.maximum).toBe(900)

		// Inter has multiple named instances (Thin, Light, Regular, Medium, SemiBold, Bold, ExtraBold, Black)
		expect(result.instances.length).toBeGreaterThan(0)
		const names = result.instances.map((i) => i.name)
		expect(names).toContain('Regular')

		const regular = result.instances.find((i) => i.name === 'Regular')
		expect(regular!.coordinates.wght).toBe(400)
	}, 120_000)

	it('each instance has coordinates matching its axis tags', async () => {
		const input = interVF()
		const { axes, instances } = await getInstances(input)
		const axisTags = new Set(axes.map((a) => a.tag))

		for (const inst of instances) {
			for (const tag of Object.keys(inst.coordinates)) {
				expect(axisTags.has(tag)).toBe(true)
			}
		}
	}, 120_000)

	it('pinning wght removes the wght axis from the output font', async () => {
		// Pinning wght to a fixed value should remove it from the output fvar
		const input = interVF()
		const [pinned] = await clampFont(input, {
			outputs: [{ name: 'Regular', axes: { wght: 400 } }],
		})
		const result = await getInstances(pinned.buffer)
		const wghtAxis = result.axes.find((a) => a.tag === 'wght')
		expect(wghtAxis).toBeUndefined()
	}, 120_000)
})

/** Reads the tables the review checked: STAT axes, fvar instance PostScript names, nameID 2/6/25 and the style bits. */
async function inspectFont(buffer: Uint8Array): Promise<{ statAxes: string[]; instancePs: string[]; n2: string; n6: string; n25: string; fsSelection: number; weightClass: number }> {
	const pyodide = await preparePyodide()
	const file = new PyodideFile({ pyodide })
	await file.upload(buffer)
	const fn = await pyodide.runPythonAsync(`
import json
from fontTools import ttLib
def inspect_font(path):
    f = ttLib.TTFont(path)
    n = f['name']
    stat = [a.AxisTag for a in f['STAT'].table.DesignAxisRecord.Axis] if 'STAT' in f else []
    ps = [n.getDebugName(i.postscriptNameID) or '' for i in f['fvar'].instances] if 'fvar' in f else []
    return json.dumps({'statAxes': stat, 'instancePs': ps, 'n2': n.getDebugName(2) or '', 'n6': n.getDebugName(6) or '', 'n25': n.getDebugName(25) or '', 'fsSelection': f['OS/2'].fsSelection, 'weightClass': f['OS/2'].usWeightClass})
inspect_font
`)
	const result = JSON.parse(fn(file.filename))
	file.delete()
	return result
}

describe('clampFont — review fixes (real Pyodide + fonttools)', () => {
	it('keeps STAT design axes that are not in fvar (Inter ital)', async () => {
		const [r] = await clampFont(interVF(), { outputs: [{ name: 'Inter Regular-Bold', axes: { wght: { min: 400, max: 700 } } }] })
		expect((await inspectFont(r.buffer)).statAxes).toContain('ital')
	}, 120_000)

	it('renames the named instances PostScript names to the new prefix', async () => {
		const [r] = await clampFont(interVF(), { outputs: [{ name: 'Inter Regular-Bold', axes: { wght: { min: 400, max: 700 } } }] })
		const info = await inspectFont(r.buffer)
		expect(info.instancePs.every((p) => p.startsWith('Inter-Regular-Bold-'))).toBe(true)
	}, 120_000)

	it('normalizeWeightAxis no longer crashes when the range starts at the default', async () => {
		const results = await clampFont(interVF(), { normalizeWeightAxis: true, outputs: [{ name: 'Inter Regular-Bold', instances: ['Regular', 'Bold'] }] })
		expect(results).toHaveLength(1)
	}, 120_000)

	it('a pinned Bold reports Bold in nameID 2 and the BOLD bit, never REGULAR', async () => {
		const [r] = await clampFont(interVF(), { outputs: [{ name: 'Inter Bold', axes: { wght: 700 } }] })
		const info = await inspectFont(r.buffer)
		expect(info.weightClass).toBe(700)
		expect(info.n2).toBe('Bold')
		expect(info.fsSelection & 0x20).toBe(0x20)
		expect(info.fsSelection & 0x40).toBe(0)
	}, 120_000)

	it('falls back to the source PostScript name when the family name has no Latin letters', async () => {
		const [r] = await clampFont(interVF(), { outputs: [{ name: '源ノ角ゴシック', axes: { wght: { min: 400, max: 700 } } }] })
		const info = await inspectFont(r.buffer)
		expect(info.n6.length).toBeGreaterThan(0)
		expect(info.n6).toMatch(/^[A-Za-z0-9-]+$/)
	}, 120_000)
})
