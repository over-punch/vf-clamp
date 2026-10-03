// Public talk deck route (vfclamp.com/talk) — "Sell the Styles, Ship the Space", rendered with the Type Tools site system.
import type { Metadata } from 'next'
import Deck from '../../components/talk/Deck'

export const metadata: Metadata = {
	title: 'Sell the Styles, Ship the Space — a talk | vf-clamp',
	description: 'Designers buy styles; foundries build design spaces. A survey of 394 foundries: 22 sell subfamily variable fonts, none scope one to the styles a customer bought.',
	alternates: { canonical: 'https://vfclamp.com/talk' },
	openGraph: {
		title: 'Sell the Styles, Ship the Space — a talk',
		description: 'A survey of 394 foundries and ten years of TypeDrawers: 22 sell subfamily variable fonts, none scope one to the purchase.',
		url: 'https://vfclamp.com/talk',
		siteName: 'vf-clamp',
		type: 'website',
	},
}

/** Renders the full-viewport slide deck. Arrow keys / space to navigate, N for notes, F for fullscreen. */
export default function TalkPage() {
	return <Deck />
}
