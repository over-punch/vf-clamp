// Slides for "Sell the Styles, Ship the Space" — vf-clamp's talk content (slide list, charts, motifs) on top of the shared talk engine.
'use client'

import { Fragment, useEffect, useState, type CSSProperties } from 'react'
import { MagnetChar } from '@overpunch/magnettype'
import { SCRIPT_NOTES } from '../../content/talkScript'
import { A, MONO, display, rise, CountUp, Eyebrow, Title, Body, Card, Numeral, Quote, Reveal, FunnelRow, Frame, ThreeUp, type Slide } from './engine'

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
	paper: '/paper',
	data: '/paper/data',
	fontdue: 'https://www.fontdue.com/docs/platform/watermark-lookup',
	gfCss2: 'https://developers.google.com/fonts/docs/css2',
	fontsource: 'https://fontsource.org/docs/getting-started/variable',
	instancer: 'https://fonttools.readthedocs.io/en/latest/varLib/instancer.html',
	balEula: 'https://www.bal-foundry.com/eula',
	vfclampGithub: 'https://github.com/over-punch/vf-clamp',
	typophile1514: 'https://github.com/06b/typophile.github.io/blob/master/json/1514.json',
	riggs2014: 'https://blog.typekit.com/2014/07/30/the-adobe-originals-silver-anniversary-story-how-the-originals-endured-in-an-ever-changing-industry/',
	hbPaper: 'https://hoverboldly.com/paper',
	almanac24: 'https://almanac.httparchive.org/en/2024/fonts',
}

/** Talk title, used in footers and the page chrome. */
export const TALK_TITLE = 'Sell the Styles, Ship the Space'

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
					<div style={{ position: 'relative', flex: 1, height: 10, borderRadius: 5, background: 'var(--t-faint)' }}>
						<div className={r.clamp ? 'vfd-clamp' : undefined} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 10, borderRadius: 5, background: 'var(--accent, rgba(80,190,200,.85))' }} />
						{r.clamp && ['400', '700'].map((v, i) => <span key={v} style={{ position: 'absolute', top: 18, left: i ? '75%' : '37.5%', transform: 'translateX(-50%)', fontFamily: MONO, fontSize: 18, color: 'var(--t-muted)' }}>{v}</span>)}
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
	clamped: [111, 162, 169, 173, 177, 181, 225, 230, 234],
	clampedOpsz: [164, 232, 243, 250, 256, 261, 334, 343, 345],
	full: 345,
}

/** Crossover chart: total static size vs a range-clamped VF as more styles are bought; series reveal by step. */
function CrossoverChart({ step }: { step: number }) {
	const W = 1664, H = 470, x0 = 90, x1 = W - 340, y0 = 30, y1 = H - 60, max = 1050
	const x = (k: number) => x0 + ((k - 1) / 8) * (x1 - x0)
	const y = (kb: number) => y1 - (kb / max) * (y1 - y0)
	const path = (arr: number[]) => arr.map((v, i) => `${i ? 'L' : 'M'}${x(i + 1)} ${y(v)}`).join(' ')
	const series: { key: string; d: string; label: string; end: number; style: CSSProperties; at: number }[] = [
		{ key: 'statics', d: path(CROSSOVER.statics), label: 'Static fonts', end: CROSSOVER.statics[8], style: { stroke: 'var(--t-subtle)', strokeWidth: 3 }, at: 0 },
		{ key: 'full', d: `M${x(1)} ${y(CROSSOVER.full)} L${x(9)} ${y(CROSSOVER.full)}`, label: 'Full VF', end: CROSSOVER.full, style: { stroke: 'var(--t-faint)', strokeWidth: 2, strokeDasharray: '8 8' }, at: 0 },
		{ key: 'opsz', d: path(CROSSOVER.clampedOpsz), label: '', end: CROSSOVER.clampedOpsz[8], style: { stroke: 'var(--t-muted)', strokeWidth: 3 }, at: 2 },
		{ key: 'clamped', d: path(CROSSOVER.clamped), label: 'Clamped VF', end: CROSSOVER.clamped[8], style: { stroke: 'var(--t-fg)', strokeWidth: 5 }, at: 1 },
	]
	return (
		<div style={{ position: 'relative', width: W, height: H }}>
			<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Inter 4 WOFF2 size by styles bought: static fonts grow from 111 KB to 1,020 KB; a weight-clamped variable font grows from 111 KB to 234 KB; the full variable font is 345 KB.">
				<line x1={x0} x2={x1} y1={y1} y2={y1} strokeWidth="2" style={{ stroke: 'var(--t-fg)', strokeOpacity: 0.1 }} />
				{series.map(s => <path key={s.key} d={s.d} fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ ...s.style, opacity: step >= s.at ? 1 : 0, transition: 'opacity 500ms ease' }} />)}
			</svg>
			{series.filter(s => s.label).map(s => (
				<span key={s.key} style={{ position: 'absolute', left: x1 + 20, top: y(s.end) - 18 + (s.key === 'clamped' ? 16 : 0), fontSize: 24, fontWeight: s.key === 'clamped' ? 500 : 300, color: s.key === 'clamped' ? 'var(--t-fg)' : 'var(--t-muted)', opacity: step >= s.at ? 1 : 0, transition: 'opacity 500ms ease', whiteSpace: 'nowrap' }}>{s.label} · {s.end} KB{s.key === 'full' && step >= 2 && <span style={{ display: 'block', fontSize: 20, color: 'var(--t-subtle)' }}>clamped with opsz kept: the same</span>}</span>
			))}
			{([[2, '162 vs 226 KB'], [7, '−72%']] as [number, string][]).map(([k, t]) => (
				<span key={k} style={{ position: 'absolute', left: x(k), top: y(CROSSOVER.clamped[k - 1]) + 22, transform: 'translateX(-50%)', ...display(34), whiteSpace: 'nowrap', opacity: step >= 1 ? 1 : 0, transition: 'opacity 500ms ease' }}>{t}</span>
			))}
			{[1, 2, 3, 4, 5, 6, 7, 8, 9].map(k => <span key={k} style={{ position: 'absolute', left: x(k), top: y1 + 16, transform: 'translateX(-50%)', fontSize: 22, color: 'var(--t-subtle)' }}>{k}</span>)}
			<span style={{ position: 'absolute', left: x0, top: y1 + 48, fontSize: 22, color: 'var(--t-subtle)' }}>Adjacent styles bought: Regular, then heavier; 7–9 add lighter weights · Inter 4, WOFF2</span>
		</div>
	)
}

/** The demo's result, read from the recorded demo: percentage saved and the caption under it. */
const DEMO_SAVING = 33
const DEMO_CAPTION = 'Encode Sans, Regular to Bold in the demo: one file, 279 KB down to 186 KB.'

/** The 22 foundries selling subfamily variable fonts (verified October 2026). */
const SUBFAMILY_FOUNDRIES = ['BAL Foundry', 'CJ Type', 'CSTM', 'Dalton Maag', 'Dinamo', 'DJR', 'Flight Mode', 'Gruppo Due', 'Identity Letters', 'Kilotype', 'Luzi Type', 'Mass-Driver', 'NaN', 'nice to type', 'Optimo', 'Pangram Pangram', 'Pizza Typefaces', 'Polytype', 'Smuss Type Kiosk', 'Socio Type', 'Studio Feixen', 'Typotheque']

/** Slide content, in order. */
export const SLIDES: Slide[] = [
	{
		id: 'cover', tool: 'vfClamp', steps: 0,
		notes: SCRIPT_NOTES.cover,
		render: () => (
			<div style={{ position: 'absolute', inset: 0, padding: '104px 128px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
				<Eyebrow>A talk on variable font licensing</Eyebrow>
				<ClampMotif />
				<h1 className="vfd-rise" style={{ ...display(176), ...rise(160) }}>
					<Magnet>Sell the styles,</Magnet><br />
					<Magnet style={{ fontStyle: 'italic', color: 'var(--t-subtle)' }}>ship the space.</Magnet>
				</h1>
				<p className="vfd-rise" style={{ ...rise(500), fontSize: 22, letterSpacing: '0.04em', color: 'var(--t-muted)' }}>Survey of 394 foundries · TypeDrawers 2016–2026 · <A href={SRC.paper}>Read the paper</A></p>
			</div>
		),
	},
	{
		id: 'hook', tool: 'axisRhythm', steps: 2,
		footer: `${TALK_TITLE} · The problem`,
		notes: SCRIPT_NOTES.hook,
		render: s => (
			<Frame eyebrow="The problem" gap={48}>
				<Title a="You bought four weights. You got four files." size={96} />
				<Reveal at={1} step={s} style={{ display: 'flex', gap: 20 }}>
					{['Regular', 'Medium', 'SemiBold', 'Bold'].map(f => <Card key={f} style={{ padding: '22px 28px' }}><p style={{ fontFamily: MONO, fontSize: 26 }}>Family-{f}.woff2</p></Card>)}
				</Reveal>
				<Reveal at={2} step={s}><RangeSpecimen /></Reveal>
			</Frame>
		),
	},
	{
		id: 'unused', tool: 'axisRhythm', steps: 3,
		footer: <>TypeDrawers: <A href={SRC.td4252}>Why don’t we hear about more use of variable fonts on the Web?</A> (2021) · <A href={SRC.td4647}>Are customers buying or using variable fonts?</A> (2022)</>,
		notes: SCRIPT_NOTES.unused,
		render: s => (
			<Frame eyebrow="The problem" gap={56}>
				<Title a="Variable fonts are made, and rarely sold." size={96} />
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
		notes: SCRIPT_NOTES.price,
		render: s => (
			<Frame eyebrow="Why" gap={56}>
				<Title a="A variable font comes as a bundle." size={96} />
				<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 96 }}>
					<Reveal at={1} step={s}>
						<p style={display(44, { fontStyle: 'italic', lineHeight: 1.3 })}>“Only a tiny percent of customers purchase an entire static family. … The bulk of my customers purchase 1–6 styles from the 48 available.”</p>
						<div style={{ marginTop: 24 }}><Eyebrow>Mark Simonson · 2022</Eyebrow></div>
					</Reveal>
					<Reveal at={2} step={s} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
						<p style={display(160)}>£64 · £95</p>
						<Body size={30}>Dalton Maag, Aktiv Grotesk: two single styles, against the cheapest variable font, which includes all nine weights. Proxima Vara: $79.98 against $199.99.</Body>
					</Reveal>
				</div>
			</Frame>
		),
	},
	{
		id: 'styles', tool: 'textBreath', steps: 2,
		footer: <>Nick Shinn and John Hudson, TypeDrawers <A href={`${SRC.td4647}/p2`}>“Are customers buying or using variable fonts?”</A>, January 2023</>,
		notes: SCRIPT_NOTES.styles,
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
		id: 'mm', tool: 'opszStepper', steps: 1,
		footer: <>Thomas Phinney on Typophile, 2003 (<A href={SRC.typophile1514}>thread 1514</A>, 2016 archive) · Tamye Riggs, <A href={SRC.riggs2014}>Typekit, 2014</A></>,
		notes: SCRIPT_NOTES.mm,
		render: s => (
			<Frame eyebrow="We’ve been here before" gap={52}>
				<Title a="Multiple Masters shipped the space, 1991–1998." size={88} />
				<div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 96, alignItems: 'end' }}>
					<Reveal at={1} step={s}><p style={display(44, { fontStyle: 'italic', lineHeight: 1.3 })}>“most users only used the default instances and never made custom instances. For them, we would have made their lives easier if we sold them separate fonts with nice clear names.”</p><div style={{ marginTop: 22 }}><Eyebrow>Thomas Phinney · Adobe · 2003</Eyebrow></div></Reveal>
					<Reveal at={1} step={s}><p style={display(72, { lineHeight: 1.1 })}>Sell named styles.<br /><span style={{ fontStyle: 'italic', color: 'var(--t-subtle)' }}>Ship the space too.</span></p></Reveal>
				</div>
			</Frame>
		),
	},
	{
		id: 'adoption', tool: 'stabilType', steps: 0,
		footer: <>HTTP Archive Web Almanac · Fonts <A href={SRC.almanac22}>2022</A>, <A href={SRC.almanac24}>2024</A> and <A href={SRC.almanac25}>2025</A> · mobile pages · four free families make up almost 60% of requests</>,
		notes: SCRIPT_NOTES.adoption,
		render: () => (
			<Frame eyebrow="The market" gap={32}>
				<Title a="The web chose variable anyway, mostly for free fonts." size={80} />
				<AdoptionChart />
			</Frame>
		),
	},
	{
		id: 'crossover', tool: 'fitFlush', steps: 2,
		footer: <>Benchmark: Inter 4 and Merriweather, <A href={SRC.instancer}>fontTools</A> 4.63, WOFF2, October 2026 · <A href={SRC.paper}>method in the paper</A></>,
		notes: SCRIPT_NOTES.crossover,
		render: s => (
			<Frame eyebrow="File size" gap={32}>
				<Title a="Clamped, it’s smaller from two weights on." size={80} />
				<CrossoverChart step={s} />
			</Frame>
		),
	},
	{
		id: 'survey', tool: 'typsettle', steps: 2,
		footer: <><A href={SRC.directory}>typefoundry.directory</A> · checked October 2026 · <A href={SRC.data}>full data</A></>,
		notes: SCRIPT_NOTES.survey,
		render: s => (
			<Frame eyebrow="The survey">
				<div style={{ display: 'flex', alignItems: 'flex-start', gap: 72, marginTop: 72 }}>
					<p className="vfd-rise" style={{ ...display(400, { lineHeight: 0.9 }), ...rise(80) }}><CountUp to={394} ms={1300} /></p>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 40, paddingTop: 28 }}>
						<Reveal at={1} step={s}><p style={display(72)}>foundries in the Type Foundry Directory.</p></Reveal>
						<Reveal at={2} step={s}><Body size={32}>Each checked against its buy pages, licences and store data. Then a second pass tried to overturn every classification.</Body></Reveal>
					</div>
				</div>
			</Frame>
		),
	},
	{
		id: 'funnel', tool: 'typsettle', steps: 3,
		footer: <>Subfamily VF · one whole width, optical size, posture or corner style of a larger VF · 32 more couldn’t be classified · <A href={SRC.data}>full data</A></>,
		notes: SCRIPT_NOTES.funnel,
		render: s => (
			<Frame eyebrow="The survey" gap={40}>
				<Title a="Nobody sells a VF cut to your purchase." size={80} />
				<div>
					<FunnelRow label="Listed in the directory" count={394} total={394} on />
					<FunnelRow label="Sell variable fonts (classified)" count={213} total={394} on={s >= 1} />
					<FunnelRow label="Sell subfamily VFs" count={22} total={394} on={s >= 2} strong />
					<FunnelRow label="Scope a VF to the styles bought" count={0} total={394} on={s >= 3} strong />
				</div>
			</Frame>
		),
	},
	{
		id: 'precedent', tool: 'floodText', steps: 0,
		footer: <>Each verified against its buy page or store data · <A href={SRC.data}>sources for all 22</A></>,
		notes: SCRIPT_NOTES.precedent,
		render: () => (
			<Frame eyebrow="Precedent" gap={44}>
				<Title a="22 foundries already sell a slice." size={96} />
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px 32px' }}>
					{SUBFAMILY_FOUNDRIES.map((f, i) => <p key={f} className="vfd-rise" style={{ ...rise(380 + i * 35), fontSize: 28, color: 'var(--t-muted)' }}>{f}</p>)}
				</div>
				<div style={{ display: 'flex', alignItems: 'baseline', gap: 40 }}>
					<p style={display(96)}>a third</p>
					<Body size={30}>What a subfamily VF (a whole width, optical size or posture) usually costs, against the complete family (19–67%).</Body>
				</div>
			</Frame>
		),
	},
	{
		id: 'gap', tool: 'fitWidth', steps: 0,
		footer: <>{TALK_TITLE} · The survey · <A href={SRC.paper}>read the paper</A></>,
		notes: SCRIPT_NOTES.gap,
		render: () => (
			<Frame eyebrow="The gap">
				<div style={{ display: 'flex', alignItems: 'center', gap: 96, flex: 1 }}>
					<p className="vfd-rise" style={{ ...display(460, { lineHeight: 0.9 }), ...rise(80) }}><CountUp from={213} to={0} ms={1300} delay={350} /></p>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
						<p className="vfd-rise" style={{ ...display(88), ...rise(1800) }}>of 213 variable-font sellers cut one to the styles bought.</p>
						<p className="vfd-rise" style={{ ...display(48, { fontStyle: 'italic', color: 'var(--t-subtle)', lineHeight: 1.3 }), ...rise(2150) }}>Regular to Bold, one file: nobody sells it.</p>
					</div>
				</div>
			</Frame>
		),
	},
	{
		id: 'asked', tool: 'wrapType', steps: 3,
		footer: <><A href="https://alistapart.com/blog/post/variable-fonts-for-responsive-design/">A List Apart, 2015</A> · TypeDrawers threads <A href={SRC.td2976}>2976</A> (2018) and <A href={SRC.td4252}>4252</A> (2022)</>,
		notes: SCRIPT_NOTES.asked,
		render: s => (
			<Frame eyebrow="Asked for since 2015" gap={56}>
				<Title a="Nick Sherman asked for range licences in 2015." size={84} />
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
		notes: SCRIPT_NOTES.opportunity,
		render: s => (
			<Frame eyebrow="The opportunity" gap={56}>
				<Title a="Fontdue, Google Fonts and fontTools each do part of it." size={76} />
				<ThreeUp step={s}>
					{[
						{ n: '01', h: 'Partial licences', b: '22 foundries already license part of a design space as a subfamily VF.' },
						{ n: '02', h: 'Per-order files', b: 'Fontdue watermarks every delivered font with its order ID.' },
						{ n: '03', h: 'Cuts at delivery', b: 'Google Fonts pins whole axes on request. Nobody narrows a range, though fontTools can.' },
					].map(c => <Card key={c.n} style={{ height: '100%' }}><Numeral>{c.n}</Numeral><p style={{ fontSize: 40, fontWeight: 500 }}>{c.h}</p><Body size={32}>{c.b}</Body></Card>)}
				</ThreeUp>
			</Frame>
		),
	},
	{
		id: 'how', tool: 'glyphShaper', steps: 5,
		footer: <><A href={SRC.instancer}>fontTools varLib.instancer</A> · partial instancing</>,
		notes: SCRIPT_NOTES.how,
		render: s => (
			<Frame eyebrow="How it works" gap={56}>
				<Title a="Buy styles, get one file." size={96} />
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
					{[
						['01', 'Buy styles', 'Customer picks Regular to Bold, the way they always have.'],
						['02', 'Clamp', 'wght limited to 400–700; axes they didn’t license are pinned.'],
						['03', 'Rename', 'Named for the range; menus list Regular, Medium, SemiBold, Bold.'],
						['04', 'Deliver', 'One variable font, alongside the statics, in seconds.'],
					].map(([n, h, b], i) => (
						<Reveal key={n} at={i + 1} step={s} style={{ height: '100%' }}>
							<Card style={{ height: '100%' }}><Numeral>{n}</Numeral><p style={{ fontSize: 40, fontWeight: 500 }}>{h}</p><Body size={32}>{b}</Body></Card>
						</Reveal>
					))}
				</div>
				<Reveal at={5} step={s}><p style={display(52, { fontStyle: 'italic' })}>Regular and Bold, nothing between? Two files, or price the gap.</p></Reveal>
			</Frame>
		),
	},
	{
		id: 'demo', tool: 'vfClamp', steps: 0,
		footer: <><A href="https://vfclamp.com">vfclamp.com</A> · <A href={SRC.vfclampGithub}>GitHub</A> · vf-clamp 2.3.0, after fixes from this talk’s review</>,
		notes: SCRIPT_NOTES.demo,
		render: () => (
			<Frame eyebrow="Proof it’s practical" gap={56}>
				<Title a="vf-clamp, on fontTools." size={96} />
				<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 96, alignItems: 'start' }}>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
						<p style={display(220)}>−<CountUp to={DEMO_SAVING} ms={1000} delay={450} />%</p>
						<Body size={30}>{DEMO_CAPTION}</Body>
					</div>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
						{['Built on fontTools’ instancer', 'npm package, CLI and REST API', 'Glyphs, RoboFont and VS Code plugins'].map((t, i) => <p key={t} className="vfd-rise" style={{ ...rise(520 + i * 110), fontSize: 32 }}>{t}</p>)}
						<p style={{ fontFamily: MONO, fontSize: 26, padding: '16px 24px', background: 'var(--t-panel)', borderRadius: 13, alignSelf: 'flex-start' }}>npm install @overpunch/vf-clamp</p>
						<p style={{ fontSize: 28, color: 'var(--t-muted)' }}>Live demo · vfclamp.com ↗</p>
					</div>
				</div>
			</Frame>
		),
	},
	{
		id: 'objections', tool: 'steadyGray', steps: 0,
		footer: <>TypeDrawers: <A href={SRC.td1813}>Phinney and Kosofsky, 2016</A> · <A href={SRC.td4329}>Shinn, 2022</A> · <A href={SRC.td4252}>Visi, 2021</A></>,
		notes: SCRIPT_NOTES.objections,
		render: () => (
			<Frame eyebrow="Objections" gap={48}>
				<Title a="What TypeDrawers said against it." size={96} />
				<div>
					{[
						['Phinney: slicing complicates retail', 'A few seconds per file, cached. Pricing the weights between is the harder part.'],
						['Shinn: cheap VFs erode family prices', '22 foundries sell slices and still sell families. Nobody publishes the numbers.'],
						['Kosofsky: slices get undercut', 'Sell both: the range now, the full space as the upgrade.'],
						['Visi: file-size wins only sometimes', 'True for a full VF. Clamped, two neighbouring weights are already smaller.'],
						['Desktop apps handle VFs badly', 'True today. Ship the VF alongside the statics, not instead.'],
					].map(([q, a], i) => (
						<div key={q} className="vfd-rise" style={{ ...rise(380 + i * 120), display: 'grid', gridTemplateColumns: '680px 1fr', gap: 48, padding: '20px 24px', margin: '0 -24px', background: i % 2 ? 'transparent' : 'color-mix(in oklch, var(--t-fg) 4%, transparent)' }}>
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
		notes: SCRIPT_NOTES.ask,
		render: s => (
			<Frame eyebrow="The ask" gap={56}>
				<Title a="Three asks." size={96} />
				<ThreeUp step={s}>
					{[
						['01', 'Foundries', 'Keep selling styles. Put a VF for the range bought in the box, with the statics.'],
						['02', 'Storefronts', 'Add a clamp step at checkout. Run one pilot to see if anyone pays.'],
						['03', 'Licence authors', '27 of 35 EULAs never mention VFs. Write down the range, allow any weight inside it, fence the rest.'],
					].map(([n, h, b]) => <Card key={n} style={{ height: '100%' }}><Numeral>{n}</Numeral><p style={{ fontSize: 40, fontWeight: 500 }}>{h}</p><Body size={32}>{b}</Body></Card>)}
				</ThreeUp>
			</Frame>
		),
	},
	{
		id: 'close', tool: 'vfClamp', steps: 0,
		notes: SCRIPT_NOTES.close,
		render: () => (
			<div style={{ position: 'absolute', inset: 0, padding: '104px 128px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
				<Eyebrow>{TALK_TITLE}</Eyebrow>
				<ClampMotif />
				<h1 className="vfd-rise" style={{ ...display(176), ...rise(160) }}>
					<Magnet>Sell the styles,</Magnet><br />
					<Magnet style={{ fontStyle: 'italic', color: 'var(--t-subtle)' }}>ship the space.</Magnet>
				</h1>
				<p className="vfd-rise" style={{ ...rise(500), fontSize: 22, letterSpacing: '0.04em', color: 'var(--t-muted)' }}>
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
		notes: SCRIPT_NOTES.about,
		render: () => (
			<div style={{ position: 'absolute', inset: 0, padding: '104px 128px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
				<Eyebrow>About</Eyebrow>
				<div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
					<Title a="We’re Overpunch." size={96} />
					<p className="vfd-rise" style={{ ...rise(280), fontSize: 34, lineHeight: 1.45, color: 'var(--t-muted)', maxWidth: 1500 }}>
						15+ years building websites for type foundries. Type tools for the web. Building <span style={{ color: 'var(--t-fg)' }}>Typetin</span>, a storefront for independent foundries, in development (<A href="https://typetin.com">typetin.com</A>).
					</p>
				</div>
				<div className="vfd-rise" style={{ ...rise(700), display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
					<p style={display(120)}><A href="https://vfclamp.com">vfclamp.com</A></p>
					<p style={{ fontSize: 26, color: 'var(--t-muted)' }}>The tool · the paper · the survey data</p>
				</div>
			</div>
		),
	},
]

/** vf-clamp's own keyframes: the live weight specimen, the axis dot and the clamp motif (off under reduced motion). */
export const TALK_CSS = `
@keyframes vfd-sweep { 0%, 100% { font-variation-settings: "wght" 400, "opsz" 144; } 50% { font-variation-settings: "wght" 700, "opsz" 144; } }
@keyframes vfd-dot { 0%, 100% { left: 37.5%; } 50% { left: 75%; } }
@keyframes vfd-clamp { 0%, 6% { left: 0; width: 100%; } 30%, 90% { left: 37.5%; width: 37.5%; } 100% { left: 0; width: 100%; } }
.vfd-sweep { animation: vfd-sweep 3.2s ease-in-out infinite; }
.vfd-dot { animation: vfd-dot 3.2s ease-in-out infinite; }
.vfd-clamp { animation: vfd-clamp 9s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .vfd-sweep, .vfd-dot, .vfd-clamp { animation: none; } }
`
