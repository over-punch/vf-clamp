// Talk deck for "Sell the Styles, Ship the Space" — a keyboard-driven 1920×1080 slide stage built from the Type Tools site system (tool palettes, Merriweather opsz 144, Inter, MagnetChar).
'use client'

import { Children, Fragment, useCallback, useEffect, useLayoutEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { MagnetChar } from '@overpunch/magnettype'
import { toolBg, toolFg, toolFgMuted, toolFgSubtle, toolFgFaint, toolPanel, type ToolId } from '../../lib/toolColors'
import { TOOLS } from '../ToolDirectory'

/** External link styled for the deck: inherits colour, hairline underline, opens in a new tab. */
function A({ href, children }: { href: string; children: ReactNode }) {
	return <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline', textDecorationThickness: 1, textUnderlineOffset: 4, textDecorationColor: 'color-mix(in oklch, currentColor 35%, transparent)' }}>{children}</a>
}

/** Source URLs cited in footers. */
const SRC = {
	td1813: 'https://typedrawers.com/discussion/1813/variable-font-ui-and-licensing',
	td2976: 'https://typedrawers.com/discussion/2976/the-current-state-of-variable-fonts-end-of-2018',
	td4252: 'https://typedrawers.com/discussion/4252/',
	td4329: 'https://typedrawers.com/discussion/4329/variable-fonts',
	td4579: 'https://typedrawers.com/discussion/4579/fonttools-level-4-variable-font-instancing-opens-up-new-retail-option',
	td4647: 'https://typedrawers.com/discussion/4647/are-customers-buying-or-using-variable-fonts',
	almanac25: 'https://almanac.httparchive.org/en/2025/fonts',
	almanac22: 'https://almanac.httparchive.org/en/2022/fonts',
	directory: 'https://typefoundry.directory/',
	paper: '/talk/paper',
	data: '/talk/data',
	fontdue: 'https://www.fontdue.com/docs/platform/watermark-lookup',
	gfCss2: 'https://developers.google.com/fonts/docs/css2',
	fontsource: 'https://fontsource.org/docs/getting-started/variable',
	instancer: 'https://fonttools.readthedocs.io/en/latest/varLib/instancer.html',
	balEula: 'https://www.bal-foundry.com/eula',
	vfclampGithub: 'https://github.com/over-punch/vf-clamp',
}

/** Stage size in CSS px; the stage is scaled to fit the viewport. */
const STAGE_W = 1920
const STAGE_H = 1080

/** Talk title, used in footers and the page chrome. */
const TALK_TITLE = 'Sell the Styles, Ship the Space'

/** Monospace stack used by the sites (Tailwind's font-mono). */
const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace'

/** One tool's palette tokens, as oklch() strings computed by toolColorsCore. */
interface Palette {
	bg: string
	fg: string
	muted: string
	subtle: string
	faint: string
	panel: string
}

/** Builds a palette for a tool id from the shared colour system. */
function palette(id: ToolId): Palette {
	return { bg: toolBg(id), fg: toolFg(id), muted: toolFgMuted(id), subtle: toolFgSubtle(id), faint: toolFgFaint(id), panel: toolPanel(id) }
}

/** A slide: its tool palette, build-step count, presenter notes, optional footer and its content renderer. */
interface Slide {
	id: string
	tool: ToolId
	/** Number of build steps after the slide appears (0 = everything visible at once). */
	steps: number
	notes: string
	footer?: ReactNode
	render: (step: number) => ReactNode
}

// ── Typographic primitives (scaled from the sites' Hero, labels and OG template) ──────────────

/** Merriweather Light 300; opsz follows the size (7–144 axis), reaching the Hero's 144 at display sizes. */
function display(size: number, extra?: CSSProperties): CSSProperties {
	const opsz = Math.min(144, Math.max(18, size))
	return { fontFamily: 'var(--font-merriweather), Georgia, serif', fontWeight: 300, fontVariationSettings: `"wght" 300, "opsz" ${opsz}`, fontSize: size, lineHeight: 1.05, ...extra }
}

/** Uppercase tracked label — the sites' eyebrow / section heading style. */
function Eyebrow({ children, color }: { children: ReactNode; color?: string }) {
	return <p style={{ fontSize: 22, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: color ?? 'var(--t-muted)' }}>{children}</p>
}

/** Two-line display title: line 1 in foreground, line 2 italic in the subtle step. */
function Title({ a, b, size = 104 }: { a: ReactNode; b?: ReactNode; size?: number }) {
	return (
		<h2 style={display(size, { textWrap: 'balance' } as CSSProperties)}>
			{a}
			{b && <><br /><span style={{ fontStyle: 'italic', color: 'var(--t-subtle)' }}>{b}</span></>}
		</h2>
	)
}

/** Body copy — Inter Light, muted, relaxed leading. */
function Body({ children, size = 30, style }: { children: ReactNode; size?: number; style?: CSSProperties }) {
	return <p style={{ fontSize: size, lineHeight: 1.55, color: 'var(--t-muted)', textWrap: 'pretty', ...style } as CSSProperties}>{children}</p>
}

/** Panel card — the sites' card: panel fill, rounded, no border or shadow. */
function Card({ children, style }: { children: ReactNode; style?: CSSProperties }) {
	return <div style={{ background: 'var(--t-panel)', borderRadius: 20, padding: 40, display: 'flex', flexDirection: 'column', gap: 16, ...style }}>{children}</div>
}

/** Mono step numeral in the faint step ("01"). */
function Numeral({ children }: { children: ReactNode }) {
	return <p style={{ fontFamily: MONO, fontSize: 22, color: 'var(--t-faint)' }}>{children}</p>
}

/** Quote card: italic Merriweather quote with a tracked attribution label. */
function Quote({ q, who, size = 44 }: { q: string; who: string; size?: number }) {
	return (
		<Card style={{ padding: 44, gap: 28, height: '100%', justifyContent: 'space-between' }}>
			<p style={display(size, { fontStyle: 'italic', lineHeight: 1.35 })}>{q}</p>
			<Eyebrow>{who}</Eyebrow>
		</Card>
	)
}

/** Fades and lifts its children in once the slide's build step reaches `at`. */
function Reveal({ at, step, children, style }: { at: number; step: number; children: ReactNode; style?: CSSProperties }) {
	const on = step >= at
	return <div style={{ opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(16px)', transition: 'opacity 500ms ease, transform 500ms ease', ...style }}>{children}</div>
}

/** OG-template bottom row: source chips left, page number right. */
function Footer({ left, n, total }: { left: ReactNode; n: number; total: number }) {
	return (
		<div style={{ position: 'absolute', left: 128, right: 128, bottom: 72, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 48, fontSize: 22, letterSpacing: '0.04em' }}>
			<p style={{ color: 'var(--t-muted)' }}>{left}</p>
			<p style={{ color: 'var(--t-subtle)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{String(n).padStart(2, '0')} / {total}</p>
		</div>
	)
}

/** MagnetChar title line — the Hero's cursor weight field (rest 300, peak 800, opsz 144). */
function Magnet({ children, style }: { children: string; style?: CSSProperties }) {
	return <MagnetChar as="span" minWeight={300} maxWeight={800} spreadRadius={220} fixedAxes={{ opsz: 144 }} style={style}>{children}</MagnetChar>
}

/** vf-clamp OG motif, animated: wght clamps to 400–700 while wdth and opsz stay fully variable. */
function ClampMotif() {
	const rows: { tag: string; clamp: boolean }[] = [{ tag: 'wght', clamp: true }, { tag: 'wdth', clamp: false }, { tag: 'opsz', clamp: false }]
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 34, width: 760 }} aria-hidden="true">
			{rows.map(r => (
				<div key={r.tag} style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
					<span style={{ fontFamily: MONO, fontSize: 22, width: 64, color: 'var(--t-subtle)' }}>{r.tag}</span>
					<div style={{ position: 'relative', flex: 1, height: 6, borderRadius: 3, background: 'var(--t-faint)' }}>
						<div className={r.clamp ? 'vfd-clamp' : undefined} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 6, borderRadius: 3, background: 'var(--accent, rgba(80,190,200,.85))' }} />
					</div>
				</div>
			))}
		</div>
	)
}

/** Live Merriweather specimen sweeping wght between two purchased limits, with the axis below. */
function RangeSpecimen() {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
			<p className="vfd-sweep" style={display(150)}>Regular to Bold</p>
			<div style={{ position: 'relative', width: 1280, height: 70 }} aria-hidden="true">
				<div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, borderRadius: 3, background: 'var(--t-faint)' }} />
				<div style={{ position: 'absolute', top: 0, left: '37.5%', width: '37.5%', height: 6, borderRadius: 3, background: 'var(--t-fg)' }} />
				<div className="vfd-dot" style={{ position: 'absolute', top: -9, width: 24, height: 24, marginLeft: -12, borderRadius: 12, background: 'var(--t-fg)' }} />
				{[['Thin', 0, 'var(--t-subtle)'], ['Regular', 37.5, 'var(--t-fg)'], ['Bold', 75, 'var(--t-fg)'], ['Black', 100, 'var(--t-subtle)']].map(([label, pos, color]) => (
					<span key={label as string} style={{ position: 'absolute', top: 30, left: `${pos}%`, transform: pos === 0 ? 'none' : pos === 100 ? 'translateX(-100%)' : 'translateX(-50%)', fontSize: 22, color: color as string }}>{label}</span>
				))}
			</div>
		</div>
	)
}

/** A row of named styles as chips, the way customers see a family; `bought` styles are filled. */
function StyleRow({ bought, step }: { bought: string[]; step: number }) {
	const styles = ['Thin', 'Light', 'Regular', 'Medium', 'SemiBold', 'Bold', 'Black']
	const weights = [100, 300, 400, 500, 600, 700, 900]
	return (
		<div style={{ display: 'flex', gap: 14 }}>
			{styles.map((s, i) => {
				const on = bought.includes(s) && step >= 1
				return (
					<span key={s} style={{ fontFamily: 'var(--font-merriweather), Georgia, serif', fontVariationSettings: `"wght" ${weights[i]}, "opsz" 144`, fontSize: 34, padding: '14px 26px', borderRadius: 999, border: '1px solid color-mix(in oklch, var(--t-fg) 25%, transparent)', background: on ? 'var(--t-fg)' : 'transparent', color: on ? 'var(--t-bg)' : 'var(--t-fg)', opacity: on || step < 1 ? 1 : 0.5, transition: 'all 500ms ease' }}>{s}</span>
				)
			})}
		</div>
	)
}

/** Adoption line chart; the line draws itself when the slide mounts. */
function AdoptionChart() {
	const [drawn, setDrawn] = useState(false)
	useEffect(() => { const t = setTimeout(() => setDrawn(true), 150); return () => clearTimeout(t) }, [])
	const pts = [{ y: 2020, v: 11 }, { y: 2021, v: 13 }, { y: 2022, v: 29 }, { y: 2024, v: 34 }, { y: 2025, v: 41.3 }]
	const x = (yr: number) => 80 + (yr - 2020) * 300
	const yv = (v: number) => 360 - (v / 50) * 320
	const d = pts.map((p, i) => `${i ? 'L' : 'M'}${x(p.y)} ${yv(p.v)}`).join(' ')
	return (
		<div style={{ position: 'relative', width: 1664, height: 450 }}>
			<svg width="1664" height="400" viewBox="0 0 1664 400" role="img" aria-label="Share of mobile pages using a variable font: 11% in 2020, 13% in 2021, 29% in 2022, 34% in 2024, 41% in 2025">
				<line x1="20" x2="1644" y1="360" y2="360" strokeOpacity="0.1" strokeWidth="2" style={{ stroke: 'var(--t-fg)' }} />
				<path d={d} fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1800" strokeDashoffset={drawn ? 0 : 1800} style={{ stroke: 'var(--t-fg)', transition: 'stroke-dashoffset 2.4s ease' }} />
				{pts.map(p => <circle key={p.y} cx={x(p.y)} cy={yv(p.v)} r={p.y === 2025 ? 13 : 8} style={{ fill: 'var(--t-fg)', opacity: drawn ? 1 : 0, transition: 'opacity 600ms ease 1.8s' }} />)}
			</svg>
			{pts.map(p => (
				<Fragment key={p.y}>
					<span style={{ position: 'absolute', left: x(p.y), top: yv(p.v) - (p.y === 2025 ? 96 : 60), transform: 'translateX(-50%)', ...(p.y === 2025 ? display(72) : { fontSize: 30, color: 'var(--t-muted)' }) }}>{Math.round(p.v)}%</span>
					<span style={{ position: 'absolute', left: x(p.y), top: 390, transform: 'translateX(-50%)', fontSize: 22, color: 'var(--t-subtle)' }}>{p.y}</span>
				</Fragment>
			))}
			<span style={{ position: 'absolute', left: x(2023), top: 390, transform: 'translateX(-50%)', fontSize: 22, fontStyle: 'italic', color: 'var(--t-faint)' }}>no survey</span>
		</div>
	)
}

/** Inter 4 WOFF2 sizes in KB by number of contiguous styles bought (benchmark, fontTools 4.63, October 2026). */
const CROSSOVER = {
	statics: [111, 226, 340, 456, 571, 683, 797, 910, 1020],
	clamped: [111, 163, 169, 173, 177, 181, 225, 230, 234],
	clampedOpsz: [164, 232, 243, 250, 256, 261, 334, 343, 345],
	full: 345,
}

/** Crossover chart: total static size vs a range-clamped VF as more styles are bought; series reveal by step. */
function CrossoverChart({ step }: { step: number }) {
	const W = 1664, H = 470, x0 = 90, x1 = W - 240, y0 = 30, y1 = H - 60, max = 1050
	const x = (k: number) => x0 + ((k - 1) / 8) * (x1 - x0)
	const y = (kb: number) => y1 - (kb / max) * (y1 - y0)
	const path = (arr: number[]) => arr.map((v, i) => `${i ? 'L' : 'M'}${x(i + 1)} ${y(v)}`).join(' ')
	const series: { key: string; d: string; label: string; end: number; style: CSSProperties; at: number }[] = [
		{ key: 'statics', d: path(CROSSOVER.statics), label: 'Static fonts', end: CROSSOVER.statics[8], style: { stroke: 'var(--t-subtle)', strokeWidth: 3 }, at: 0 },
		{ key: 'full', d: `M${x(1)} ${y(CROSSOVER.full)} L${x(9)} ${y(CROSSOVER.full)}`, label: 'Full VF', end: CROSSOVER.full, style: { stroke: 'var(--t-faint)', strokeWidth: 2, strokeDasharray: '8 8' }, at: 0 },
		{ key: 'opsz', d: path(CROSSOVER.clampedOpsz), label: 'Clamped, opsz kept', end: CROSSOVER.clampedOpsz[8], style: { stroke: 'var(--t-muted)', strokeWidth: 3 }, at: 2 },
		{ key: 'clamped', d: path(CROSSOVER.clamped), label: 'Clamped VF', end: CROSSOVER.clamped[8], style: { stroke: 'var(--t-fg)', strokeWidth: 5 }, at: 1 },
	]
	return (
		<div style={{ position: 'relative', width: W, height: H }}>
			<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Inter 4 WOFF2 size by styles bought: static fonts grow from 111 KB to 1,020 KB; a weight-clamped variable font grows from 111 KB to 234 KB; the full variable font is 345 KB.">
				<line x1={x0} x2={x1} y1={y1} y2={y1} strokeWidth="2" style={{ stroke: 'var(--t-fg)', strokeOpacity: 0.1 }} />
				{series.map(s => <path key={s.key} d={s.d} fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ ...s.style, opacity: step >= s.at ? 1 : 0, transition: 'opacity 500ms ease' }} />)}
			</svg>
			{series.map(s => (
				<span key={s.key} style={{ position: 'absolute', left: x1 + 20, top: y(s.end) - 18 + (s.key === 'full' ? -32 : s.key === 'opsz' ? 4 : s.key === 'clamped' ? 26 : 0), fontSize: 24, fontWeight: s.key === 'clamped' ? 500 : 300, color: s.key === 'clamped' ? 'var(--t-fg)' : 'var(--t-muted)', opacity: step >= s.at ? 1 : 0, transition: 'opacity 500ms ease', whiteSpace: 'nowrap' }}>{s.label} · {s.end} KB</span>
			))}
			{[1, 2, 3, 4, 5, 6, 7, 8, 9].map(k => <span key={k} style={{ position: 'absolute', left: x(k), top: y1 + 16, transform: 'translateX(-50%)', fontSize: 22, color: 'var(--t-subtle)' }}>{k}</span>)}
			<span style={{ position: 'absolute', left: x0, top: y1 + 48, fontSize: 22, color: 'var(--t-subtle)' }}>Styles bought, from Regular upward · WOFF2</span>
		</div>
	)
}

/** One funnel row; the bar grows to its width when revealed. */
function FunnelRow({ label, count, total, on, strong }: { label: string; count: number; total: number; on: boolean; strong?: boolean }) {
	const w = (count / total) * 720
	return (
		<div style={{ display: 'grid', gridTemplateColumns: '760px 1fr', alignItems: 'center', height: 92, opacity: on ? 1 : 0, transition: 'opacity 500ms ease' }}>
			<p style={{ fontSize: 32, fontWeight: strong ? 500 : 300 }}>{label}</p>
			<div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
				<div style={{ width: on ? Math.max(w, 4) : 0, height: 52, borderRadius: 4, background: strong ? 'var(--t-fg)' : 'var(--t-panel)', transition: 'width 900ms cubic-bezier(.2,.7,.2,1)' }} />
				<p style={display(52)}>{count}{count > 0 && count < total && <span style={{ color: 'var(--t-subtle)' }}> {Math.round((count / total) * 100)}%</span>}</p>
			</div>
		</div>
	)
}

/** Slide frame: eyebrow and title pinned to the top; everything after the title is centred in the space above the footer. */
function Frame({ eyebrow, children, gap = 40 }: { eyebrow: string; children: ReactNode; gap?: number }) {
	const [head, ...rest] = Children.toArray(children)
	return (
		<div style={{ position: 'absolute', inset: 0, padding: '104px 128px 176px', display: 'flex', flexDirection: 'column', gap }}>
			<Eyebrow>{eyebrow}</Eyebrow>
			{head}
			{rest.length > 0 && <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap }}>{rest}</div>}
		</div>
	)
}

/** Three-up grid of revealed cards. */
function ThreeUp({ step, children }: { step: number; children: ReactNode[] }) {
	return (
		<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
			{children.map((c, i) => <Reveal key={i} at={i + 1} step={step} style={{ height: '100%' }}>{c}</Reveal>)}
		</div>
	)
}

/** The 22 foundries selling subfamily variable fonts (verified October 2026). */
const SUBFAMILY_FOUNDRIES = ['BAL Foundry', 'CJ Type', 'CSTM', 'Dalton Maag', 'Dinamo', 'DJR', 'Flight Mode', 'Gruppo Due', 'Identity Letters', 'Kilotype', 'Luzi Type', 'Mass-Driver', 'NaN', 'nice to type', 'Optimo', 'Pangram Pangram', 'Pizza Typefaces', 'Polytype', 'Smuss Type Kiosk', 'Socio Type', 'Studio Feixen', 'Typotheque']

/** Slide content, in order. */
const SLIDES: Slide[] = [
	{
		id: 'cover', tool: 'vfClamp', steps: 0,
		notes: 'Open on the motif: three axes of one variable font. Weight clamps to the range a customer bought, 400 to 700, while width and optical size stay fully variable. The argument of this talk is in the title: let customers keep buying styles, and ship them the design space between those styles.',
		render: () => (
			<div style={{ position: 'absolute', inset: 0, padding: '104px 128px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
				<Eyebrow>A talk on variable font licensing</Eyebrow>
				<ClampMotif />
				<h1 style={display(176)}>
					<Magnet>Sell the styles,</Magnet><br />
					<Magnet style={{ fontStyle: 'italic', color: 'var(--t-subtle)' }}>ship the space.</Magnet>
				</h1>
				<p style={{ fontSize: 22, letterSpacing: '0.04em', color: 'var(--t-muted)' }}>Survey of 394 foundries · TypeDrawers 2016–2026 · <A href={SRC.paper}>Read the paper</A></p>
			</div>
		),
	},
	{
		id: 'hook', tool: 'axisRhythm', steps: 2,
		footer: `${TALK_TITLE} · The problem`,
		notes: 'Say you license two styles of a family, Regular and Bold. Today you get two static files. [Next] What you could have had is one variable font, scoped to exactly those styles. [Next] It does everything a variable font does inside your licence, and contains nothing outside it. Almost nobody sells this.',
		render: s => (
			<Frame eyebrow="The problem" gap={48}>
				<Title a="You bought Regular and Bold." b="You got two static files." size={96} />
				<Reveal at={1} step={s} style={{ display: 'flex', gap: 24 }}>
					{['Family-Regular.woff2', 'Family-Bold.woff2'].map(f => <Card key={f} style={{ padding: '24px 36px' }}><p style={{ fontFamily: MONO, fontSize: 30 }}>{f}</p></Card>)}
				</Reveal>
				<Reveal at={2} step={s}><RangeSpecimen /></Reveal>
			</Frame>
		),
	},
	{
		id: 'unused', tool: 'axisRhythm', steps: 3,
		footer: <>TypeDrawers: <A href={SRC.td4252}>Why don’t we hear about more use of variable fonts on the Web?</A> (2021) · <A href={SRC.td4647}>Are customers buying or using variable fonts?</A> (2022)</>,
		notes: 'Nearly every foundry now makes variable fonts. Almost nobody licenses them. [Next] Kris Sowersby, of Klim: maybe four requests since launch. [Next] Type Network, which promoted them hard: not exactly burning up the charts. [Next] And Sowersby says why in the same post: they have to be priced as the full family.',
		render: s => (
			<Frame eyebrow="The problem" gap={56}>
				<Title a="Foundries make variable fonts." b="Almost nobody licenses them." size={96} />
				<ThreeUp step={s}>
					<Quote q="“We’ve had maybe 4 requests for VF since it launched.”" who="Kris Sowersby · Klim · 2021" />
					<Quote q="“They are not exactly burning up the charts yet.”" who="Christopher Slye · Type Network · 2022" />
					<Quote q="“VF have to be priced as full family, because that’s what they are.”" who="Kris Sowersby · Klim · 2021" />
				</ThreeUp>
			</Frame>
		),
	},
	{
		id: 'price', tool: 'hoverBoldly', steps: 2,
		footer: <>Mark Simonson, TypeDrawers <A href={SRC.td4329}>“Variable fonts”</A>, 2022 · list prices from <A href="https://www.daltonmaag.com/font-library/aktiv-grotesk.html">Dalton Maag</A> and <A href="https://www.marksimonson.com/fonts/view/proxima-vara">Mark Simonson</A>, October 2026</>,
		notes: 'Why? Price. Mark Simonson has the clearest view. [Next] Only a tiny percent of his customers buy an entire family; most buy one to six styles out of 48. Klim says about half its sales are singles or pairs. [Next] So look at what a two-style buyer pays to get a variable font today: one and a half to six times the price of the two styles they need. Dalton Maag’s cheapest variable tier is 95 pounds against 63 for two singles; the full design space is 380.',
		render: s => (
			<Frame eyebrow="Why" gap={56}>
				<Title a="The price is the whole family." b="The purchase is one to six styles." size={96} />
				<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 96 }}>
					<Reveal at={1} step={s}>
						<p style={display(44, { fontStyle: 'italic', lineHeight: 1.3 })}>“Only a tiny percent of customers purchase an entire static family. … The bulk of my customers purchase 1–6 styles from the 48 available.”</p>
						<div style={{ marginTop: 24 }}><Eyebrow>Mark Simonson · 2022</Eyebrow></div>
					</Reveal>
					<Reveal at={2} step={s} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
						<p style={display(160)}>1.5–6×</p>
						<Body size={30}>What a two-style buyer pays to get a variable font today, against two single styles. Dalton Maag’s cheapest tier is £95 against £63; a full design space runs £380.</Body>
					</Reveal>
				</div>
			</Frame>
		),
	},
	{
		id: 'styles', tool: 'textBreath', steps: 2,
		footer: <>Nick Shinn and John Hudson, TypeDrawers <A href={`${SRC.td4647}/p2`}>“Are customers buying or using variable fonts?”</A>, January 2023</>,
		notes: 'There is a deeper mismatch. Designers think of a typeface as a series of named styles. Foundries build design spaces, from masters, and the variable font is that space. [Next] Nick Shinn: dispensing with the names Regular and Bold seems impossible. [Next] John Hudson: named instances are signposts, pins on a map, in a space people struggle to picture. The question is not how to make designers think in sliders. It is how to sell them the styles they think in, and ship the space anyway.',
		render: s => (
			<Frame eyebrow="Styles and spaces" gap={52}>
				<Title a="Designers buy styles." b="Foundries build spaces." size={96} />
				<StyleRow bought={['Regular', 'Bold']} step={s} />
				<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
					<Reveal at={1} step={s}><p style={display(40, { fontStyle: 'italic', lineHeight: 1.35 })}>“Dispensing with the concept of naming the two most basic weights Regular and Bold seems impossible.”</p><div style={{ marginTop: 20 }}><Eyebrow>Nick Shinn · 2023</Eyebrow></div></Reveal>
					<Reveal at={2} step={s}><p style={display(40, { fontStyle: 'italic', lineHeight: 1.35 })}>Named instances are “navigation signposts or like pins on a map.”</p><div style={{ marginTop: 20 }}><Eyebrow>John Hudson · 2023</Eyebrow></div></Reveal>
				</div>
			</Frame>
		),
	},
	{
		id: 'adoption', tool: 'stabilType', steps: 0,
		footer: <>HTTP Archive Web Almanac · Fonts <A href={SRC.almanac22}>2022</A> and <A href={SRC.almanac25}>2025</A> · mobile pages</>,
		notes: 'Meanwhile the web chose variable. 11 percent of mobile pages in 2020, 41 percent in 2025. But about 60 percent of all variable font requests come from four free families. The demand is real; paid foundries are not capturing it.',
		render: () => (
			<Frame eyebrow="The market" gap={32}>
				<Title a="The web chose variable anyway." b="60% of requests: four free families." size={88} />
				<AdoptionChart />
			</Frame>
		),
	},
	{
		id: 'suite', tool: 'magnetType', steps: 4,
		footer: <>Type Tools READMEs · <A href="https://axisrhythm.com">axisRhythm</A> · <A href="https://hoverboldly.com">hoverBoldly</A> · <A href="https://magnettype.com">magnetType</A></>,
		notes: 'And partial buyers lose more than bytes. Of our own type tools, three do nothing at all without a variable font, and five more lose their main effect. [Next ×3] [Next] hoverBoldly is the clearest number: bolding a word on hover shifts the line 5.8 pixels with static fonts, and zero with a variable one.',
		render: s => {
			const cards: { tool: ToolId; quote: string }[] = [
				{ tool: 'axisRhythm', quote: '“The effect is invisible with fonts that do not have variable axis support.”' },
				{ tool: 'hoverBoldly', quote: '“Requires a variable font with a wght axis.”' },
				{ tool: 'magnetType', quote: '“The markup is correct but the glyphs cannot change weight.”' },
			]
			return (
				<Frame eyebrow="What static buyers lose" gap={56}>
					<Title a="Three of our tools need one." b="Five more lose their main effect." size={96} />
					<ThreeUp step={s}>
						{cards.map(c => {
							const p = palette(c.tool)
							return (
								<div key={c.tool} style={{ background: c.tool === 'magnetType' ? p.panel : p.bg, color: p.fg, borderRadius: 20, padding: 40, display: 'flex', flexDirection: 'column', gap: 20, height: '100%' }}>
									<Eyebrow color={p.muted}>{c.tool}</Eyebrow>
									<p style={display(40, { fontStyle: 'italic', lineHeight: 1.35 })}>{c.quote}</p>
								</div>
							)
						})}
					</ThreeUp>
					<Reveal at={4} step={s} style={{ display: 'flex', alignItems: 'baseline', gap: 40 }}>
						<p style={display(96)}>5.8px <span style={{ color: 'var(--t-faint)' }}>0.0px</span></p>
						<Body size={30}>How far hoverBoldly’s line shifts on hover: static fonts, then variable.</Body>
					</Reveal>
				</Frame>
			)
		},
	},
	{
		id: 'crossover', tool: 'fitFlush', steps: 2,
		footer: <>Benchmark: Inter 4 and Merriweather, <A href={SRC.instancer}>fontTools</A> 4.63, WOFF2, October 2026 · <A href={SRC.paper}>method in the paper</A></>,
		notes: 'And the old file-size objection flips once the font is clamped. Here is Inter 4. Static fonts grow by about 110 kilobytes per style. [Next] A variable font clamped to the purchased weights is already smaller than the statics at two styles: Regular plus Bold is 173 KB against 226. At seven styles it is 72 percent smaller. [Next] Keep the optical-size axis and it still beats the statics from three styles on. Merriweather shows the same: Regular to Bold clamped is 131 KB against 161. The rule: pin the axes the customer did not license; keep the ones that add value for free.',
		render: s => (
			<Frame eyebrow="File size" gap={32}>
				<Title a="Two styles in, the clamped VF is smaller." b="Seven styles in, it is 72% smaller." size={80} />
				<CrossoverChart step={s} />
			</Frame>
		),
	},
	{
		id: 'survey', tool: 'typsettle', steps: 2,
		footer: <><A href={SRC.directory}>typefoundry.directory</A> · checked October 2026 · <A href={SRC.data}>full data</A></>,
		notes: 'So how are variable fonts actually sold? We checked all 394 foundries in the Type Foundry Directory. [Next] Buy pages, licences, store data. [Next] Then a second pass tried to overturn every classification; 27 changed.',
		render: s => (
			<Frame eyebrow="The survey">
				<div style={{ display: 'flex', alignItems: 'flex-start', gap: 72, marginTop: 72 }}>
					<p style={display(400, { lineHeight: 0.9 })}>394</p>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 40, paddingTop: 28 }}>
						<Reveal at={1} step={s}><p style={display(72)}>foundries in the Type Foundry Directory.</p></Reveal>
						<Reveal at={2} step={s}><Body size={32}>Each checked against its buy pages, licences and store data. Then a second pass tried to overturn every classification.</Body></Reveal>
					</div>
				</div>
			</Frame>
		),
	},
	{
		id: 'funnel', tool: 'typsettle', steps: 4,
		footer: <>Subfamily VF · one whole width, optical size, posture or corner style of a larger VF · <A href={SRC.data}>full data</A></>,
		notes: 'Of 394 foundries, [Next] 227 sell variable fonts. [Next] 119 offer one without the complete family, usually a full-range product at the family price. [Next] 22 sell a smaller variable font, and every one is a complete subfamily. [Next] And zero scope a variable font to the styles a customer bought.',
		render: s => (
			<Frame eyebrow="The survey" gap={40}>
				<Title a="Subfamily VFs exist." b="Purchase-scoped ones don’t." size={80} />
				<div>
					<FunnelRow label="Listed in the directory" count={394} total={394} on />
					<FunnelRow label="Sell variable fonts" count={227} total={394} on={s >= 1} />
					<FunnelRow label="Offer a VF without the complete family" count={119} total={394} on={s >= 2} />
					<FunnelRow label="Sell subfamily VFs" count={22} total={394} on={s >= 3} strong />
					<FunnelRow label="Scope a VF to the styles bought" count={0} total={394} on={s >= 4} strong />
				</div>
			</Frame>
		),
	},
	{
		id: 'precedent', tool: 'floodText', steps: 0,
		footer: <>Each verified against its buy page or store data · <A href={SRC.data}>sources for all 22</A></>,
		notes: 'Smaller variable fonts are not hypothetical: 22 foundries sell them. But every one is a complete subfamily: one width, one optical size, upright only. Dalton Maag sells Aktiv Grotesk by number of axes. NaN’s licence even promises a variable font covering the styles bought, but only for whole subfamilies. They cost about a third of the full family, and these foundries still sell full families.',
		render: () => (
			<Frame eyebrow="Precedent" gap={44}>
				<Title a="22 foundries sell subfamily VFs." b="Every one a whole width, size or posture." size={88} />
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px 32px' }}>
					{SUBFAMILY_FOUNDRIES.map(f => <p key={f} style={{ fontSize: 28, color: 'var(--t-muted)' }}>{f}</p>)}
				</div>
				<div style={{ display: 'flex', alignItems: 'baseline', gap: 40 }}>
					<p style={display(96)}>a third</p>
					<Body size={30}>What a subfamily VF usually costs, against the complete family (19–67%).</Body>
				</div>
			</Frame>
		),
	},
	{
		id: 'gap', tool: 'fitWidth', steps: 0,
		footer: <>{TALK_TITLE} · The survey · <A href={SRC.paper}>read the paper</A></>,
		notes: 'This is the gap. Of 394 foundries, zero scope a variable font to the styles you bought. Buy Regular and Bold, ask for Regular to Bold, and no store will sell it to you. Not subfamilies: instance ranges. That is the missing product.',
		render: () => (
			<Frame eyebrow="The gap">
				<div style={{ display: 'flex', alignItems: 'center', gap: 96, flex: 1 }}>
					<p style={display(460, { lineHeight: 0.9 })}>0</p>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
						<p style={display(88)}>of 394 foundries scope a VF to the styles bought.</p>
						<p style={display(48, { fontStyle: 'italic', color: 'var(--t-subtle)', lineHeight: 1.3 })}>Not subfamilies. Instance ranges.</p>
					</div>
				</div>
			</Frame>
		),
	},
	{
		id: 'asked', tool: 'wrapType', steps: 3,
		footer: <><A href="https://alistapart.com/blog/post/variable-fonts-for-responsive-design/">A List Apart, 2015</A> · TypeDrawers threads <A href={SRC.td2976}>2976</A> (2018) and <A href={SRC.td4252}>4252</A> (2022)</>,
		notes: 'And the idea is older than the format. In January 2015 Nick Sherman proposed licensing ranges: Light to Medium should cost less than Thin to Black. [Next] In 2018 John Hudson asked for a design-space subsetting tool so customers get smaller variable fonts with only what they need. [Next] In 2022 Nick Shinn: an app on the distributor site that generates the VF with only the weights requested. [Next] When fontTools shipped range instancing that year, Dave Crossland called it very good news for selling sub-spaces at a discount. Eleven years on, nobody reports building the shop. What is new here is not range pricing; it is the file that makes it enforceable.',
		render: s => (
			<Frame eyebrow="Asked for since 2015" gap={56}>
				<Title a="The community asked for this." b="Nobody built the shop." size={96} />
				<ThreeUp step={s}>
					<Quote size={38} q="“it would cost less to license a limited weight range from Light to Medium (300–500) than a wide gamut from Thin to Black”" who="Nick Sherman · 2015" />
					<Quote size={38} q="“a variable design space subsetting tool, that would enable customers to generate smaller variable fonts containing only the axes and deltas they need”" who="John Hudson · 2018" />
					<Quote size={38} q="“An app on the distributor site could do that, and generate the VF with only the weight instances requested.”" who="Nick Shinn · 2022" />
				</ThreeUp>
			</Frame>
		),
	},
	{
		id: 'opportunity', tool: 'speechType', steps: 3,
		footer: <><A href={SRC.data}>Survey data</A> · <A href={SRC.fontdue}>Fontdue docs</A> · <A href={SRC.gfCss2}>Google Fonts</A> and <A href={SRC.fontsource}>Fontsource</A>, tested October 2026 · <A href={SRC.instancer}>fontTools</A></>,
		notes: 'Every piece already exists. [Next] 22 foundries already license part of a design space. [Next] Fonts are already built per order: Fontdue watermarks every file with its order ID. [Next] And variable fonts are already cut at delivery: Google Fonts drops whole axes on the fly. But neither narrows a range: ask Google for weight 400 to 700 and you get the same file as 100 to 900. That missing step is one fontTools call.',
		render: s => (
			<Frame eyebrow="The opportunity" gap={56}>
				<Title a="Every piece already exists." b="Nobody has put them together." size={96} />
				<ThreeUp step={s}>
					{[
						{ n: '01', h: 'Partial licences', b: '22 foundries already license part of a design space as a subfamily VF.' },
						{ n: '02', h: 'Per-order files', b: 'Fontdue watermarks every delivered font with its order ID.' },
						{ n: '03', h: 'Cuts at delivery', b: 'Google Fonts drops whole axes on the fly. Nobody narrows a range: that is one fontTools call.' },
					].map(c => <Card key={c.n} style={{ height: '100%' }}><Numeral>{c.n}</Numeral><p style={{ fontSize: 40, fontWeight: 500 }}>{c.h}</p><Body size={32}>{c.b}</Body></Card>)}
				</ThreeUp>
			</Frame>
		),
	},
	{
		id: 'how', tool: 'glyphShaper', steps: 5,
		footer: <><A href={SRC.instancer}>fontTools varLib.instancer</A> · partial instancing</>,
		notes: 'So: sell the styles, ship the space. [Next ×4] The customer buys named styles, as they always have. At checkout the full variable font is clamped to the span of what they bought; axes that do not affect licensing, like optical size, stay variable: clamp, never pin. The name and STAT tables list only what was bought. One file is delivered. [Next] And notice what that makes a static font: a variable font clamped to a single point. Today’s model is a special case of this one.',
		render: s => (
			<Frame eyebrow="How it works" gap={56}>
				<Title a="Sell the styles. Ship the space." size={96} />
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
					{[
						['01', 'Buy styles', 'Customer picks Regular and Bold, the way they always have.'],
						['02', 'Clamp', 'wght limited to 400–700. opsz and GRAD kept, never pinned.'],
						['03', 'Rename', 'name and STAT tables list only what was bought.'],
						['04', 'Deliver', 'One variable font, TTF or WOFF2, in seconds.'],
					].map(([n, h, b], i) => (
						<Reveal key={n} at={i + 1} step={s} style={{ height: '100%' }}>
							<Card style={{ height: '100%' }}><Numeral>{n}</Numeral><p style={{ fontSize: 40, fontWeight: 500 }}>{h}</p><Body size={32}>{b}</Body></Card>
						</Reveal>
					))}
				</div>
				<Reveal at={5} step={s}><p style={display(56, { fontStyle: 'italic' })}>A static font is a variable font clamped to a single point.</p></Reveal>
			</Frame>
		),
	},
	{
		id: 'demo', tool: 'vfClamp', steps: 0,
		footer: <><A href="https://vfclamp.com">vfclamp.com</A> · <A href={SRC.vfclampGithub}>GitHub</A> · −28% reproduced independently, October 2026</>,
		notes: 'Is it practical? One implementation is vf-clamp, built on fontTools. Clamping Inter’s weight to 400 to 700 cut the WOFF2 by 28 percent. [Cut to live demo on vfclamp.com: load a font, pick Regular and Bold, download, show the weight stopping at the limits.] The tool is not the point; range-scoped delivery at checkout takes seconds.',
		render: () => (
			<Frame eyebrow="Proof it’s practical" gap={56}>
				<Title a="vf-clamp." b="Restrict the range, keep what varies." size={96} />
				<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 96, alignItems: 'start' }}>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
						<p style={display(220)}>−28%</p>
						<Body size={30}>Inter WOFF2, weights 100–900 clamped to 400–700: 337 KB to 243 KB.</Body>
					</div>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
						{['Built on fontTools’ instancer', 'npm package, CLI and REST API', 'Glyphs, RoboFont and VS Code plugins'].map(t => <p key={t} style={{ fontSize: 32 }}>{t}</p>)}
						<p style={{ fontFamily: MONO, fontSize: 26, padding: '16px 24px', background: 'var(--t-panel)', borderRadius: 13, alignSelf: 'flex-start' }}>npm install @overpunch/vf-clamp</p>
						<p style={{ fontSize: 28, color: 'var(--t-muted)' }}>Live demo · vfclamp.com ↗</p>
					</div>
				</div>
			</Frame>
		),
	},
	{
		id: 'objections', tool: 'steadyGray', steps: 0,
		footer: <>TypeDrawers: <A href={SRC.td1813}>Phinney and Kosofsky, 2016</A> · <A href={SRC.td4329}>Shinn, 2022</A> · <A href={SRC.td4252}>Constable, 2021</A></>,
		notes: 'The objections are old and worth taking seriously. Phinney in 2016: slicing makes retail more complicated. Today it is one call at checkout, and customers still pick named styles. Shinn: cheap variable fonts erode family prices. 22 foundries already sell subfamily variable fonts and still sell families. Kosofsky: sell the whole toolkit or be undercut. Sell both: the range now, the space as the upgrade. Constable: two statics are often smaller than a variable font. Which is exactly why it should be clamped.',
		render: () => (
			<Frame eyebrow="Objections" gap={48}>
				<Title a="Objections, answered." size={96} />
				<div>
					{[
						['“Slicing makes retail more complicated”', 'It’s one fontTools call at checkout. Customers still pick named styles.'],
						['“Cheap VFs will erode family prices”', '22 foundries sell subfamily VFs and still sell families.'],
						['“Sell the whole toolkit or be undercut”', 'Sell both: the range now, the full space as the upgrade.'],
						['“Two statics are smaller than a VF”', 'Often true for a full VF. That is why the VF should be clamped.'],
						['“Desktop apps handle VFs badly”', 'True today. Ship the VF alongside the statics, not instead.'],
					].map(([q, a], i) => (
						<div key={q} style={{ display: 'grid', gridTemplateColumns: '680px 1fr', gap: 48, padding: '20px 24px', margin: '0 -24px', background: i % 2 ? 'transparent' : 'color-mix(in oklch, var(--t-fg) 4%, transparent)' }}>
							<p style={display(36, { fontStyle: 'italic', lineHeight: 1.35 })}>{q}</p>
							<p style={{ fontSize: 30, lineHeight: 1.45, color: 'var(--t-muted)' }}>{a}</p>
						</div>
					))}
				</div>
			</Frame>
		),
	},
	{
		id: 'ask', tool: 'ragtooth', steps: 3,
		footer: <>{TALK_TITLE} · The ask · <A href={SRC.balEula}>BAL Foundry EULA</A></>,
		notes: 'Three asks. Foundries: sell the styles people buy, and ship the variable font scoped to their range. [Next] Storefronts: add a clamp step at fulfilment. [Next] Licence authors: define the licence by design space. BAL Foundry’s EULA already allows instances within the licensed scope.',
		render: s => (
			<Frame eyebrow="The ask" gap={56}>
				<Title a="What to change now." size={96} />
				<ThreeUp step={s}>
					{[
						['01', 'Foundries', 'Keep selling styles. Ship the VF scoped to the range bought, alongside the statics.'],
						['02', 'Storefronts', 'Add a clamp step at fulfilment. Today VFs exist only as fixed, pre-cut products.'],
						['03', 'Licence authors', 'Define the licence by design space: instances within the licensed scope.'],
					].map(([n, h, b]) => <Card key={n} style={{ height: '100%' }}><Numeral>{n}</Numeral><p style={{ fontSize: 40, fontWeight: 500 }}>{h}</p><Body size={32}>{b}</Body></Card>)}
				</ThreeUp>
			</Frame>
		),
	},
	{
		id: 'close', tool: 'vfClamp', steps: 0,
		notes: 'Designers will keep thinking in styles, and that is fine. Foundries can keep selling styles. They just need to ship the space between them. Thank you.',
		render: () => (
			<div style={{ position: 'absolute', inset: 0, padding: '104px 128px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
				<Eyebrow>{TALK_TITLE}</Eyebrow>
				<ClampMotif />
				<h1 style={display(176)}>
					<Magnet>Sell the styles,</Magnet><br />
					<Magnet style={{ fontStyle: 'italic', color: 'var(--t-subtle)' }}>ship the space.</Magnet>
				</h1>
				<p style={{ fontSize: 22, letterSpacing: '0.04em', color: 'var(--t-muted)' }}>
					<A href={SRC.paper}>The paper</A>
					<span aria-hidden="true"> · </span>
					<A href={SRC.data}>Survey data</A>
					<span aria-hidden="true"> · </span>
					<A href={SRC.directory}>typefoundry.directory</A>
					<span aria-hidden="true"> · </span>
					<A href="https://vfclamp.com">vfclamp.com</A>
				</p>
			</div>
		),
	},
	{
		id: 'about', tool: 'opticalMargin', steps: 0,
		notes: 'Who we are. We are Overpunch. We make type tools for the web: techniques CSS alone cannot do, from per-line axis rhythm to hanging punctuation to motion-adaptive type. vf-clamp is one of twenty. Try it at vfclamp.com, or inside your editor: there are plugins for Glyphs, RoboFont and VS Code, a CLI, an npm package and a REST API. The paper and all the survey data are at vfclamp.com/talk/paper.',
		render: () => (
			<div style={{ position: 'absolute', inset: 0, padding: '104px 128px', display: 'flex', flexDirection: 'column', gap: 48 }}>
				<Eyebrow>About</Eyebrow>
				<Title a="We’re Overpunch." b="We make type tools for the web." size={96} />
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
					{TOOLS.map(t => {
						const id = t.id as ToolId
						return (
							<a key={t.id} href={t.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '16px 20px', borderRadius: 14, background: toolBg(id), color: toolFg(id), textDecoration: 'none' }}>
								<span style={{ fontSize: 24, fontWeight: 500 }}>{t.name}</span>
								<span style={{ fontSize: 18, color: toolFgMuted(id) }}>{t.short}</span>
							</a>
						)
					})}
				</div>
				<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
					<p style={display(44)}>Start with vf-clamp: <A href="https://vfclamp.com">vfclamp.com</A></p>
					<p style={{ fontSize: 26, color: 'var(--t-muted)' }}>
						<A href="https://vfclamp.com/integrations/glyphs-robofont">Glyphs and RoboFont plugins</A>
						<span aria-hidden="true"> · </span><A href="https://github.com/over-punch/vf-clamp-vscode">VS Code extension</A>
						<span aria-hidden="true"> · </span><A href="https://github.com/over-punch/vf-clamp-cli">CLI</A>
						<span aria-hidden="true"> · </span><A href="https://www.npmjs.com/package/@overpunch/vf-clamp">npm</A>
						<span aria-hidden="true"> · </span><A href={SRC.vfclampGithub}>GitHub</A>
						<span aria-hidden="true"> · </span><A href={SRC.paper}>The paper and data</A>
					</p>
				</div>
			</div>
		),
	},
]

/** Keyframes for the live specimen, the axis dot, the clamp motif and the slide fade-in. */
const DECK_CSS = `
@keyframes vfd-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes vfd-sweep { 0%, 100% { font-variation-settings: "wght" 400, "opsz" 144; } 50% { font-variation-settings: "wght" 700, "opsz" 144; } }
@keyframes vfd-dot { 0%, 100% { left: 37.5%; } 50% { left: 75%; } }
@keyframes vfd-clamp { 0%, 15% { left: 0; width: 100%; } 45%, 85% { left: 37.5%; width: 37.5%; } 100% { left: 0; width: 100%; } }
.vfd-sweep { animation: vfd-sweep 3.2s ease-in-out infinite; }
.vfd-dot { animation: vfd-dot 3.2s ease-in-out infinite; }
.vfd-clamp { animation: vfd-clamp 6s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .vfd-sweep, .vfd-dot, .vfd-clamp { animation: none; } }
`

/** Reads the 1-based slide number from the URL hash. */
function slideFromHash(): number {
	if (typeof window === 'undefined') return 0
	const n = parseInt(window.location.hash.replace('#', ''), 10)
	return Number.isFinite(n) ? Math.min(Math.max(n - 1, 0), SLIDES.length - 1) : 0
}

/** The full-viewport deck: scales a 1920×1080 stage, handles keys/clicks/swipes, cross-fades tool palettes. */
export default function Deck() {
	const [index, setIndex] = useState(0)
	const [step, setStep] = useState(0)
	const [scale, setScale] = useState(1)
	const [showNotes, setShowNotes] = useState(false)

	// Restore position from the hash once mounted (hash is unavailable during SSR).
	useEffect(() => {
		// Read now, before the hash-sync effect below rewrites it; apply on the next frame.
		const fromHash = slideFromHash()
		const id = requestAnimationFrame(() => { setIndex(fromHash); setStep(0) })
		return () => cancelAnimationFrame(id)
	}, [])

	// Fit the stage to the viewport.
	useLayoutEffect(() => {
		const fit = () => setScale(Math.min(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H))
		fit()
		window.addEventListener('resize', fit)
		return () => window.removeEventListener('resize', fit)
	}, [])

	// Keep the hash in sync so a slide can be linked or reloaded.
	useEffect(() => { window.history.replaceState(null, '', `#${index + 1}`) }, [index])

	const next = useCallback(() => {
		if (step < SLIDES[index].steps) setStep(step + 1)
		else if (index < SLIDES.length - 1) { setIndex(index + 1); setStep(0) }
	}, [index, step])

	const prev = useCallback(() => {
		if (step > 0) setStep(step - 1)
		else if (index > 0) { setIndex(index - 1); setStep(SLIDES[index - 1].steps) }
	}, [index, step])

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(e.key)) { e.preventDefault(); next() }
			else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(e.key)) { e.preventDefault(); prev() }
			else if (e.key === 'Home') { setIndex(0); setStep(0) }
			else if (e.key === 'End') { setIndex(SLIDES.length - 1); setStep(SLIDES[SLIDES.length - 1].steps) }
			else if (e.key.toLowerCase() === 'n') setShowNotes(v => !v)
			else if (e.key.toLowerCase() === 'f') {
				if (document.fullscreenElement) document.exitFullscreen()
				else document.documentElement.requestFullscreen?.().catch(() => console.warn('Fullscreen request was refused'))
			}
		}
		window.addEventListener('keydown', onKey)
		return () => window.removeEventListener('keydown', onKey)
	}, [next, prev])

	// Swipe navigation for touch screens.
	useEffect(() => {
		let x0: number | null = null
		const start = (e: TouchEvent) => { x0 = e.touches[0].clientX }
		const end = (e: TouchEvent) => {
			if (x0 == null) return
			const dx = e.changedTouches[0].clientX - x0
			if (Math.abs(dx) > 40) { if (dx < 0) next(); else prev() }
			x0 = null
		}
		window.addEventListener('touchstart', start)
		window.addEventListener('touchend', end)
		return () => { window.removeEventListener('touchstart', start); window.removeEventListener('touchend', end) }
	}, [next, prev])

	const slide = SLIDES[index]
	const p = palette(slide.tool)
	const vars = { '--t-bg': p.bg, '--t-fg': p.fg, '--t-muted': p.muted, '--t-subtle': p.subtle, '--t-faint': p.faint, '--t-panel': p.panel } as CSSProperties

	return (
		<div
			role="region"
			aria-roledescription="slide deck"
			aria-label={TALK_TITLE}
			onClick={e => { if ((e.target as HTMLElement).closest('a')) return; if (e.clientX < window.innerWidth / 3) prev(); else next() }}
			style={{ ...vars, position: 'fixed', inset: 0, zIndex: 100, background: 'var(--t-bg)', color: 'var(--t-fg)', transition: 'background-color 500ms ease, color 500ms ease', overflow: 'hidden', cursor: 'default', fontFamily: 'var(--font-sans)', fontWeight: 300 }}
		>
			<style>{DECK_CSS}</style>
			<div style={{ position: 'absolute', left: '50%', top: '50%', width: STAGE_W, height: STAGE_H, transform: `translate(-50%, -50%) scale(${scale})`, transformOrigin: 'center' }}>
				<div key={slide.id} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${SLIDES.length}`} style={{ position: 'absolute', inset: 0, animation: 'vfd-in 500ms ease' }}>
					{slide.render(step)}
					{slide.footer && <Footer left={slide.footer} n={index + 1} total={SLIDES.length} />}
				</div>
			</div>
			<div aria-hidden="true" style={{ position: 'absolute', left: 0, bottom: 0, height: 2, width: `${((index + 1) / SLIDES.length) * 100}%`, background: 'var(--t-fg)', opacity: 0.1, transition: 'width 500ms ease' }} />
			{showNotes && (
				<div onClick={e => e.stopPropagation()} style={{ position: 'absolute', left: 24, right: 24, bottom: 24, maxHeight: '40%', overflow: 'auto', padding: '20px 28px', borderRadius: 12, background: 'rgba(0,0,0,.82)', color: '#f4f4f4', fontSize: 18, lineHeight: 1.55 }}>
					<p style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.6, marginBottom: 8 }}>Notes · {index + 1}/{SLIDES.length} · step {step}/{slide.steps}</p>
					{slide.notes}
				</div>
			)}
		</div>
	)
}
