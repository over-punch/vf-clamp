// Public paper route (vfclamp.com/paper) — "Sell the Styles, Ship the Space", rendered from content/paper.ts in the Type Tools site style.
import type { Metadata } from 'next'
import Link from 'next/link'
import '../talk.css'
import Prose, { slug } from '../../components/talk/Prose'
import { FunnelFigure, AdoptionFigure, CrossoverFigure, PipelineFigure } from '../../components/talk/Figures'
import { PAPER_MD } from '../../content/paper'
import SiteFooter from '../../components/SiteFooter'
import { version } from '../../../../package.json'
import { version as siteVersion } from '../../../package.json'

export const metadata: Metadata = {
	title: 'Sell the Styles, Ship the Space — paper | vf-clamp',
	description: 'Designers buy styles; foundries build design spaces. A survey of 394 foundries, ten years of TypeDrawers, and a file-size benchmark on delivering variable fonts clamped to the styles a customer bought.',
	alternates: { canonical: 'https://vfclamp.com/paper' },
	openGraph: {
		title: 'Sell the Styles, Ship the Space — paper',
		description: 'A survey of 394 foundries: 22 sell subfamily variable fonts; none scope one to the styles a customer bought.',
		url: 'https://vfclamp.com/paper',
		siteName: 'vf-clamp',
		type: 'article',
	},
}

/** Figure components available to {{figure:name}} slots in the paper. */
const FIGURES = {
	funnel: <FunnelFigure />,
	adoption: <AdoptionFigure />,
	crossover: <CrossoverFigure />,
	pipeline: <PipelineFigure />,
}

/** Section headings (## lines) for the table of contents. */
const SECTIONS = PAPER_MD.split('\n').filter(l => l.startsWith('## ')).map(l => l.slice(3).trim())

/** The paper page: hero, contents, body, footer. */
export default function PaperPage() {
	return (
		<main className="flex flex-col items-center px-6 py-20 gap-16">
			<header className="w-full max-w-2xl flex flex-col gap-6">
				<div className="flex flex-col gap-2">
					<p className="load-rise text-xs uppercase tracking-[0.18em] font-medium text-muted">A paper · October 2026</p>
					<h1 className="load-rise text-4xl lg:text-7xl" style={{ ['--d' as string]: '90ms', fontFamily: 'var(--font-merriweather), serif', fontVariationSettings: '"wght" 300, "opsz" 144', lineHeight: '1.05em', textWrap: 'balance' }}>
						Sell the styles,<br />
						<span style={{ fontStyle: 'italic', color: 'var(--foreground-subtle)' }}>ship the space.</span>
					</h1>
				</div>
				<div className="load-rise flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted" style={{ ['--d' as string]: '220ms' } as React.CSSProperties}>
					<Link href="/talk" className="hover:text-foreground transition-colors">Slides ↗</Link>
					<span aria-hidden="true">·</span>
					<Link href="/paper/data" className="hover:text-foreground transition-colors">Survey data ↗</Link>
					<span aria-hidden="true">·</span>
					<a href="/paper/sell-the-styles-ship-the-space.pdf" download className="hover:text-foreground transition-colors">Paper PDF ↓</a>
					<span aria-hidden="true">·</span>
					<Link href="/talk/transcript" className="hover:text-foreground transition-colors">Transcript ↗</Link>
					<span aria-hidden="true">·</span>
					<Link href="/" className="hover:text-foreground transition-colors">vf-clamp ↗</Link>
				</div>
				<nav aria-label="Contents" className="load-rise flex flex-col gap-2 pt-2" style={{ ['--d' as string]: '320ms' } as React.CSSProperties}>
					<p className="text-xs uppercase tracking-[0.18em] font-medium text-muted">Contents</p>
					<ol className="flex flex-col gap-1 text-sm">
						{SECTIONS.map((s, i) => (
							<li key={s} className="flex gap-3">
								<span className="font-mono text-xs text-faint tabular-nums pt-0.5">{String(i + 1).padStart(2, '0')}</span>
								<a href={`#${slug(s)}`} className="text-muted hover:text-foreground transition-colors">{s}</a>
							</li>
						))}
					</ol>
				</nav>
			</header>
			<article className="w-full max-w-2xl flex flex-col gap-5">
				<Prose source={PAPER_MD} figures={FIGURES} />
			</article>
			<SiteFooter current="vfClamp" npmVersion={version} siteVersion={siteVersion} />
		</main>
	)
}
