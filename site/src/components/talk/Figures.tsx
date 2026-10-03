// Static SVG/HTML figures for the talk paper (funnel, adoption, crossover, pipeline), drawn with the site's colour tokens.
import { Fragment } from 'react'

/** Shared caption under each figure. */
function Caption({ children }: { children: React.ReactNode }) {
	return <figcaption className="mt-3 px-2 lg:px-8 text-xs text-subtle tracking-wide">{children}</figcaption>
}

/** Survey funnel: 394 → 227 → 119 → 22 → 0. */
export function FunnelFigure() {
	const rows = [
		{ label: 'Listed in the Type Foundry Directory', n: 394 },
		{ label: 'Sell variable fonts', n: 227 },
		{ label: 'Offer a VF without the complete family', n: 119 },
		{ label: 'Sell subfamily VFs', n: 22, strong: true },
		{ label: 'Scope a VF to the styles bought', n: 0, strong: true },
	]
	return (
		<div className="rounded-xl p-6 lg:p-8" style={{ background: 'var(--panel)' }}>
			<p className="mb-6 text-xl lg:text-2xl" style={{ fontFamily: 'var(--font-merriweather), serif', fontVariationSettings: '"wght" 300, "opsz" 36' }}>Of 394 foundries, 22 sell subfamily VFs. None scope one to the styles bought.</p>
			<div className="flex flex-col gap-3">
				{rows.map(r => (
					<div key={r.label} className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-1 sm:gap-4 items-center">
						<span className={`text-sm ${r.strong ? 'font-semibold' : 'text-muted'}`}>{r.label}</span>
						<span className="flex items-center gap-3">
							<span className="h-5 rounded-sm" style={{ width: `${Math.max((r.n / 394) * 100, 0.6)}%`, background: r.strong ? 'var(--foreground)' : 'color-mix(in oklch, var(--foreground) 22%, transparent)' }} />
							<span className="text-sm tabular-nums">{r.n}{r.n > 0 && r.n < 394 && <span className="text-subtle"> · {Math.round((r.n / 394) * 100)}%</span>}</span>
						</span>
					</div>
				))}
			</div>
			<Caption>Subfamily VF: one whole width, optical size, posture or corner style of a larger VF. Every foundry checked against its buy pages and store data, October 2026.</Caption>
		</div>
	)
}

/** Web Almanac adoption line, 2020–2025 (mobile pages using a variable font). */
export function AdoptionFigure() {
	const pts = [{ y: 2020, v: 11 }, { y: 2021, v: 13 }, { y: 2022, v: 29 }, { y: 2024, v: 34 }, { y: 2025, v: 41.3 }]
	const x = (yr: number) => 50 + (yr - 2020) * 120
	const yv = (v: number) => 210 - (v / 50) * 180
	const d = pts.map((p, i) => `${i ? 'L' : 'M'}${x(p.y)} ${yv(p.v)}`).join(' ')
	return (
		<div className="rounded-xl p-6 lg:p-8" style={{ background: 'var(--panel)' }}>
			<svg viewBox="0 0 700 250" className="w-full h-auto" role="img" aria-label="Share of mobile pages using a variable font: 11% in 2020, 13% in 2021, 29% in 2022, 34% in 2024, 41% in 2025">
				<line x1="30" x2="680" y1="210" y2="210" strokeWidth="1" style={{ stroke: 'var(--foreground)', strokeOpacity: 0.15 }} />
				<path d={d} fill="none" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" style={{ stroke: 'var(--foreground)' }} />
				{pts.map(p => (
					<Fragment key={p.y}>
						<circle cx={x(p.y)} cy={yv(p.v)} r={p.y === 2025 ? 6 : 4} style={{ fill: 'var(--foreground)' }} />
						<text x={x(p.y)} y={yv(p.v) - 14} textAnchor="middle" fontSize={p.y === 2025 ? 20 : 13} style={{ fill: p.y === 2025 ? 'var(--foreground)' : 'var(--foreground-muted)' }}>{Math.round(p.v)}%</text>
						<text x={x(p.y)} y={234} textAnchor="middle" fontSize="12" style={{ fill: 'var(--foreground-subtle)' }}>{p.y}</text>
					</Fragment>
				))}
				<text x={x(2023)} y={234} textAnchor="middle" fontSize="12" fontStyle="italic" style={{ fill: 'var(--foreground-faint)' }}>no survey</text>
			</svg>
			<Caption>Share of mobile pages using at least one variable font. HTTP Archive Web Almanac, Fonts chapters 2022 and 2025.</Caption>
		</div>
	)
}

/** Inter 4 WOFF2 sizes by number of contiguous styles bought (benchmark, October 2026). */
const CROSSOVER = {
	statics: [111, 226, 340, 456, 571, 683, 797, 910, 1020],
	clamped: [111, 163, 169, 173, 177, 181, 225, 230, 234],
	clampedOpsz: [164, 232, 243, 250, 256, 261, 334, 343, 345],
	full: 345,
}

/** Crossover chart: static total vs range-clamped VF as styles are added. */
export function CrossoverFigure() {
	const x = (k: number) => 50 + ((k - 1) / 8) * 470
	const y = (kb: number) => 230 - (kb / 1050) * 210
	const path = (a: number[]) => a.map((v, i) => `${i ? 'L' : 'M'}${x(i + 1)} ${y(v)}`).join(' ')
	const series = [
		{ label: 'Static fonts', d: path(CROSSOVER.statics), end: CROSSOVER.statics[8], style: { stroke: 'var(--foreground-subtle)', strokeWidth: 2 } },
		{ label: 'Full VF', d: `M${x(1)} ${y(CROSSOVER.full)} L${x(9)} ${y(CROSSOVER.full)}`, end: CROSSOVER.full, style: { stroke: 'var(--foreground-faint)', strokeWidth: 1.5, strokeDasharray: '5 5' } },
		{ label: 'Clamped, opsz kept', d: path(CROSSOVER.clampedOpsz), end: CROSSOVER.clampedOpsz[8], style: { stroke: 'var(--foreground-muted)', strokeWidth: 2 } },
		{ label: 'Clamped VF', d: path(CROSSOVER.clamped), end: CROSSOVER.clamped[8], style: { stroke: 'var(--foreground)', strokeWidth: 3 } },
	]
	return (
		<div className="rounded-xl p-6 lg:p-8" style={{ background: 'var(--panel)' }}>
			<p className="mb-4 text-xl lg:text-2xl" style={{ fontFamily: 'var(--font-merriweather), serif', fontVariationSettings: '"wght" 300, "opsz" 36' }}>Two styles in, the clamped VF is smaller. Seven in, it is 72% smaller.</p>
			<svg viewBox="0 0 700 270" className="w-full h-auto" role="img" aria-label="Inter 4 WOFF2 size by styles bought: static fonts grow from 111 KB to 1,020 KB; a weight-clamped variable font grows from 111 KB to 234 KB; the full variable font is 345 KB.">
				<line x1="40" x2="530" y1="230" y2="230" strokeWidth="1" style={{ stroke: 'var(--foreground)', strokeOpacity: 0.15 }} />
				{series.map(s => <path key={s.label} d={s.d} fill="none" strokeLinecap="round" strokeLinejoin="round" style={s.style} />)}
				{series.map(s => <text key={s.label} x={540} y={y(s.end) + (s.label === 'Full VF' ? -9 : s.label === 'Clamped, opsz kept' ? 16 : 4)} fontSize="12" style={{ fill: s.label === 'Clamped VF' ? 'var(--foreground)' : 'var(--foreground-muted)' }}>{s.label} · {s.end} KB</text>)}
				{[1, 2, 3, 4, 5, 6, 7, 8, 9].map(k => <text key={k} x={x(k)} y={250} textAnchor="middle" fontSize="11" style={{ fill: 'var(--foreground-subtle)' }}>{k}</text>)}
				<text x={40} y={268} fontSize="11" style={{ fill: 'var(--foreground-subtle)' }}>Styles bought, from Regular upward</text>
			</svg>
			<Caption>Inter 4 (wght 100–900, opsz 14–32), WOFF2, fontTools 4.63 instancer, October 2026. “Clamped VF” pins opsz like the statics; “opsz kept” keeps it variable.</Caption>
		</div>
	)
}

/** Delivery pipeline: buy styles → clamp → rename → deliver. */
export function PipelineFigure() {
	const steps = [
		['01', 'Buy styles', 'Customer picks Regular and Bold, as they always have.'],
		['02', 'Clamp', 'wght limited to 400–700; free axes like opsz kept, unlicensed ones pinned.'],
		['03', 'Rename', 'fvar, STAT and name tables list only what was bought.'],
		['04', 'Deliver', 'One variable font, TTF or WOFF2, in seconds.'],
	]
	return (
		<div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
				{steps.map(([n, h, b]) => (
					<div key={n} className="rounded-xl p-5 flex flex-col gap-2" style={{ background: 'var(--panel)' }}>
						<span className="font-mono text-xs text-faint">{n}</span>
						<span className="text-sm font-semibold">{h}</span>
						<span className="text-xs leading-relaxed text-muted">{b}</span>
					</div>
				))}
			</div>
			<Caption>A static font is a variable font clamped to a single point.</Caption>
		</div>
	)
}
