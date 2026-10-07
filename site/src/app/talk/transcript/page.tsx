// Transcript route (vfclamp.com/talk/transcript) — the spoken script of "Sell the Styles, Ship the Space", one section per slide, build cues removed and delivery marks (pauses, stress) typeset.
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { SCRIPT, spoken, clicksToNext } from '../../../content/talkScript'
import SiteFooter from '../../../components/SiteFooter'
import { version } from '../../../../../package.json'
import { version as siteVersion } from '../../../../package.json'

export const metadata: Metadata = {
	title: 'Sell the Styles, Ship the Space — transcript | vf-clamp',
	description: 'Full transcript of the talk "Sell the Styles, Ship the Space": why variable fonts should be delivered clamped to the styles a customer bought.',
	alternates: { canonical: 'https://vfclamp.com/talk/transcript' },
	openGraph: {
		title: 'Sell the Styles, Ship the Space — transcript',
		description: 'The full spoken script of the talk, one section per slide.',
		url: 'https://vfclamp.com/talk/transcript',
		siteName: 'vf-clamp',
		type: 'article',
	},
}

/** Typesets pause marks and stress in a run of script text: " / " and " // " as faint marks hidden from screen readers, *stress* as emphasis. */
function marks(text: string, keyPrefix: string): ReactNode[] {
	return text.split(/(\s\/\/\s|\s\/\s|\*[^*]+\*)/).map((part, i) => {
		const key = `${keyPrefix}-${i}`
		if (part === ' // ') return <span key={key} aria-hidden="true" className="text-faint"> {'//'} </span>
		if (part === ' / ') return <span key={key} aria-hidden="true" className="text-faint"> / </span>
		if (/^\*[^*]+\*$/.test(part)) return <em key={key}>{part.slice(1, -1)}</em>
		return part
	})
}

/**
 * A slide's spoken text with its delivery marks typeset. {Braced} passages read out what someone said: they
 * are shown at half opacity, so the speaker can choose to read them or skip them.
 */
function Delivery({ text }: { text: string }): ReactNode {
	return spoken(text).split(/(\{[^}]*\})/).map((part, i) => (
		/^\{[^}]*\}$/.test(part)
			? <span key={i} data-quote="" style={{ opacity: 0.5 }}>{marks(part.slice(1, -1), `q${i}`)}</span>
			: marks(part, `t${i}`)
	))
}

/** The transcript page: hero, links, a key to the delivery marks, one numbered section per slide, footer. */
export default function TranscriptPage() {
	return (
		<main className="flex flex-col items-center px-6 py-20 gap-16">
			<header className="w-full max-w-2xl flex flex-col gap-6">
				<div className="flex flex-col gap-2">
					<p className="text-xs uppercase tracking-[0.18em] font-medium text-muted">Transcript · October 2026</p>
					<h1 className="text-4xl lg:text-7xl" style={{ fontFamily: 'var(--font-merriweather), serif', fontVariationSettings: '"wght" 300, "opsz" 144', lineHeight: '1.05em', textWrap: 'balance' }}>
						Sell the styles,<br />
						<span style={{ fontStyle: 'italic', color: 'var(--foreground-subtle)' }}>ship the space.</span>
					</h1>
				</div>
				<div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
					<Link href="/talk" className="hover:text-foreground transition-colors">Slides ↗</Link>
					<span aria-hidden="true">·</span>
					<Link href="/paper" className="hover:text-foreground transition-colors">Paper ↗</Link>
					<span aria-hidden="true">·</span>
					<Link href="/paper/data" className="hover:text-foreground transition-colors">Survey data ↗</Link>
					<span aria-hidden="true">·</span>
					<a href="/paper/sell-the-styles-ship-the-space.pdf" download className="hover:text-foreground transition-colors">Paper PDF ↓</a>
				</div>
				<p className="text-sm text-muted">Marked for reading aloud: <span className="text-faint">/</span> a short pause, <span className="text-faint">{'//'}</span> a longer beat, <em>italics</em> for stress. <span style={{ opacity: 0.5 }}>Dimmed passages</span> read out what someone said, and can be skipped. The count beside each slide is how many clicks it takes until the next slide appears.</p>
			</header>
			<article className="w-full max-w-2xl flex flex-col gap-10">
				{SCRIPT.map((e, i) => (
					<section key={e.id} className="flex flex-col gap-3">
						<p className="flex gap-3 text-xs uppercase tracking-[0.18em] font-medium text-muted">
							<Link href={`/talk#${i + 1}`} className="font-mono text-faint tabular-nums hover:text-foreground transition-colors" aria-label={`Slide ${i + 1}`}>{String(i + 1).padStart(2, '0')}</Link>
							<span>{e.label}</span>
							{i < SCRIPT.length - 1 && (
								<span className="ml-auto font-mono text-faint tabular-nums normal-case tracking-normal" title="Clicks until the next slide appears: one per build on this slide, plus one to move on">
									{clicksToNext(e.text)} {clicksToNext(e.text) === 1 ? 'click' : 'clicks'}
								</span>
							)}
						</p>
						<p className="text-base lg:text-lg leading-relaxed"><Delivery text={e.text} /></p>
					</section>
				))}
			</article>
			<SiteFooter current="vfClamp" npmVersion={version} siteVersion={siteVersion} />
		</main>
	)
}
