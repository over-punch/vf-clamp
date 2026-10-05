// Shared 1200×630 Open Graph image for the talk routes (/talk, /paper, /paper/data, /talk/transcript), in the vf-clamp site palette.
import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

/** OG image dimensions in pixels. */
export const TALK_OG_SIZE = { width: 1200, height: 630 }

/** Axis bars for the clamp motif: wght clamped to 400–700, wdth and opsz left whole. */
const AXES = [
	{ label: 'wght', lo: 0.375, hi: 0.75 },
	{ label: 'wdth', lo: 0, hi: 1 },
	{ label: 'opsz', lo: 0, hi: 1 },
]

/** Renders a talk OG image with an eyebrow label, the two-line title, a one-line footnote and the page's short URL. */
export async function talkOgImage(eyebrow: string, footnote: string, path = 'vfclamp.com/talk') {
	const interLight = await readFile(join(process.cwd(), 'public/fonts/inter-300.woff'))
	return new ImageResponse(
		(
			<div style={{ background: '#00395d', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '72px 80px', fontFamily: 'Inter, sans-serif' }}>
				<span style={{ fontSize: 15, letterSpacing: '0.18em', color: '#afc1cc', textTransform: 'uppercase' }}>{eyebrow}</span>
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 44 }}>
						{AXES.map(a => (
							<div key={a.label} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
								<span style={{ fontSize: 12, color: '#8d9ba3', fontFamily: 'monospace', width: 36 }}>{a.label}</span>
								<div style={{ position: 'relative', width: 300, height: 4, background: '#727c82', borderRadius: 2, display: 'flex' }}>
									<div style={{ position: 'absolute', left: `${a.lo * 100}%`, width: `${(a.hi - a.lo) * 100}%`, height: '100%', background: 'rgba(80,190,200,0.75)', borderRadius: 2 }} />
								</div>
							</div>
						))}
					</div>
					<div style={{ fontSize: 84, color: '#f0f6fa', lineHeight: 1.04, fontWeight: 300 }}>Sell the styles,</div>
					<div style={{ fontSize: 84, color: '#afc1cc', lineHeight: 1.04, fontWeight: 300, fontStyle: 'italic' }}>ship the space.</div>
				</div>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
					<span style={{ fontSize: 18, color: '#afc1cc', letterSpacing: '0.02em' }}>{footnote}</span>
					<span style={{ fontSize: 15, color: '#8d9ba3', letterSpacing: '0.04em' }}>{path}</span>
				</div>
			</div>
		),
		{ ...TALK_OG_SIZE, fonts: [{ name: 'Inter', data: interLight, style: 'normal', weight: 300 }] },
	)
}
