// Transcript route (vfclamp.com/talk/transcript) — the spoken script of "Sell the Styles, Ship the Space", one section per slide, cues removed.
import type { Metadata } from 'next'
import Link from 'next/link'
import { SCRIPT, spoken } from '../../../content/talkScript'
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

/** The transcript page: hero, links, one numbered section per slide, footer. */
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
					<Link href="/talk/paper" className="hover:text-foreground transition-colors">Paper ↗</Link>
					<span aria-hidden="true">·</span>
					<Link href="/talk/data" className="hover:text-foreground transition-colors">Survey data ↗</Link>
					<span aria-hidden="true">·</span>
					<a href="/talk/sell-the-styles-ship-the-space.pdf" download className="hover:text-foreground transition-colors">Paper PDF ↓</a>
				</div>
			</header>
			<article className="w-full max-w-2xl flex flex-col gap-10">
				{SCRIPT.map((e, i) => (
					<section key={e.id} className="flex flex-col gap-3">
						<p className="flex gap-3 text-xs uppercase tracking-[0.18em] font-medium text-muted">
							<Link href={`/talk#${i + 1}`} className="font-mono text-faint tabular-nums hover:text-foreground transition-colors" aria-label={`Slide ${i + 1}`}>{String(i + 1).padStart(2, '0')}</Link>
							<span>{e.label}</span>
						</p>
						<p className="text-base lg:text-lg leading-relaxed">{spoken(e.text)}</p>
					</section>
				))}
			</article>
			<SiteFooter current="vfClamp" npmVersion={version} siteVersion={siteVersion} />
		</main>
	)
}
