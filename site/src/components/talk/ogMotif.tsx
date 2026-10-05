// vf-clamp's OG motif: three axis bars, weight clamped to 400–700 while width and optical size stay whole (Satori-compatible).

/** Axis bars for the clamp motif, as fractions of each axis. */
const AXES = [
	{ label: 'wght', lo: 0.375, hi: 0.75 },
	{ label: 'wdth', lo: 0, hi: 1 },
	{ label: 'opsz', lo: 0, hi: 1 },
]

/** The clamp motif drawn above the talk OG title. */
export function ClampOgMotif() {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
			{AXES.map(a => (
				<div key={a.label} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
					<span style={{ fontSize: 12, color: '#8d9ba3', fontFamily: 'monospace', width: 36 }}>{a.label}</span>
					<div style={{ position: 'relative', width: 300, height: 4, background: '#727c82', borderRadius: 2, display: 'flex' }}>
						<div style={{ position: 'absolute', left: `${a.lo * 100}%`, width: `${(a.hi - a.lo) * 100}%`, height: '100%', background: 'rgba(80,190,200,0.85)', borderRadius: 2 }} />
					</div>
				</div>
			))}
		</div>
	)
}
