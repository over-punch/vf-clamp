// Public survey data route (vfclamp.com/talk/data) — every foundry in typefoundry.directory that sells or may sell variable fonts, with evidence links.
import type { Metadata } from 'next'
import Link from 'next/link'
import { FOUNDRIES, FOUNDRIES_WITHOUT_VF } from '../../../content/foundries'
import SiteFooter from '../../../components/SiteFooter'
import { version } from '../../../../../package.json'
import { version as siteVersion } from '../../../../package.json'

export const metadata: Metadata = {
	title: 'Variable font survey data — 394 foundries | vf-clamp',
	description: 'How every foundry in the Type Foundry Directory sells variable fonts: subfamily VFs, VFs without the complete family, and price against the family, with an evidence link for each.',
	alternates: { canonical: 'https://vfclamp.com/talk/data' },
}

/** Counts a column value across the table. */
function count(key: 'subfamilyVF' | 'vfWithoutFamily' | 'priceVsFamily', value: string): number {
	return FOUNDRIES.filter(f => f[key] === value).length
}

/** The data appendix page. */
export default function DataPage() {
	const sellers = FOUNDRIES.filter(f => f.subfamilyVF !== 'Unclear' || f.vfWithoutFamily !== 'Unclear').length
	const stats = [
		['Foundries in the directory', FOUNDRIES.length + FOUNDRIES_WITHOUT_VF],
		['Listed here (sell VFs or unclear)', FOUNDRIES.length],
		['Sell subfamily VFs', count('subfamilyVF', 'Yes')],
		['Split only (upright/italic as separate full VFs)', count('subfamilyVF', 'Split only')],
		['VF without the complete family', count('vfWithoutFamily', 'Yes') + count('vfWithoutFamily', 'Subfamily')],
		['Cheapest VF cheaper than the family', count('priceVsFamily', 'Cheaper')],
	]
	return (
		<main className="flex flex-col items-center px-6 py-20 gap-16">
			<header className="w-full max-w-2xl lg:max-w-5xl flex flex-col gap-6">
				<div className="flex flex-col gap-2">
					<p className="text-xs uppercase tracking-[0.18em] font-medium text-muted">Survey data · October 2026</p>
					<h1 className="text-4xl lg:text-7xl" style={{ fontFamily: 'var(--font-merriweather), serif', fontVariationSettings: '"wght" 300, "opsz" 144', lineHeight: '1.05em' }}>
						394 foundries,<br />
						<span style={{ fontStyle: 'italic', color: 'var(--foreground-subtle)' }}>one row each.</span>
					</h1>
				</div>
				<p className="max-w-lg text-base leading-relaxed text-muted" style={{ textWrap: 'pretty' }}>
					Every foundry in the <a href="https://typefoundry.directory/" target="_blank" rel="noopener noreferrer" className="underline decoration-foreground/30 underline-offset-4">Type Foundry Directory</a> that sells variable fonts, or that we could not classify, checked against its buy pages, licences and store data, then re-checked by a second pass. The other {FOUNDRIES_WITHOUT_VF} foundries were screened as not selling variable fonts. {sellers} rows have at least one verified answer. Read the <Link href="/talk/paper" className="underline decoration-foreground/30 underline-offset-4">paper</Link>.
				</p>
				<dl className="grid grid-cols-2 lg:grid-cols-3 gap-3">
					{stats.map(([k, v]) => (
						<div key={k as string} className="rounded-xl p-5 flex flex-col gap-1" style={{ background: 'var(--panel)' }}>
							<dt className="text-xs text-muted">{k}</dt>
							<dd className="text-3xl" style={{ fontFamily: 'var(--font-merriweather), serif', fontVariationSettings: '"wght" 300, "opsz" 36' }}>{v}</dd>
						</div>
					))}
				</dl>
				<ul className="flex flex-col gap-1 text-xs text-subtle">
					<li><strong className="font-semibold text-muted">Subfamily VF</strong> · Yes: sells a VF covering one complete subfamily (a width, optical size, posture or corner style) of a larger VF. Split only: sub-designs sold as separate full-range VFs.</li>
					<li><strong className="font-semibold text-muted">VF without complete family</strong> · Subfamily: a smaller package is needed.</li>
					<li><strong className="font-semibold text-muted">Cheapest VF vs family</strong> · compared at the same licence tier.</li>
				</ul>
			</header>
			<section aria-label="Foundries" className="w-full max-w-2xl lg:max-w-5xl overflow-x-auto">
				<table className="w-full text-sm border-collapse">
					<thead>
						<tr className="text-subtle">
							{['Foundry', 'Subfamily VF', 'VF without complete family', 'Cheapest VF vs family', 'Evidence'].map(h => <th key={h} className="text-left font-normal px-3 py-2 border-b border-foreground/10">{h}</th>)}
						</tr>
					</thead>
					<tbody>
						{FOUNDRIES.map(f => (
							<tr key={f.name} className="odd:bg-foreground/[0.04]">
								<td className="px-3 py-2">{f.url ? <a href={f.url} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">{f.name}</a> : f.name}</td>
								<td className={`px-3 py-2 ${f.subfamilyVF === 'Yes' ? 'font-semibold' : 'text-muted'}`}>{f.subfamilyVF}</td>
								<td className="px-3 py-2 text-muted">{f.vfWithoutFamily}</td>
								<td className="px-3 py-2 text-muted">{f.priceVsFamily}</td>
								<td className="px-3 py-2">{f.source ? <a href={f.source} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-foreground underline decoration-foreground/30 underline-offset-4">page ↗</a> : <span className="text-faint">—</span>}</td>
							</tr>
						))}
					</tbody>
				</table>
			</section>
			<SiteFooter current="vfClamp" npmVersion={version} siteVersion={siteVersion} />
		</main>
	)
}
