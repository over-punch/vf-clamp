// Open Graph image for vfclamp.com/talk, rendered by the shared talk OG component with vf-clamp's clamp motif.
import { talkOgImage, TALK_OG_SIZE } from '../../components/talk/talkOg'
import { ClampOgMotif } from '../../components/talk/ogMotif'

export const alt = 'Sell the Styles, Ship the Space — Slides'
export const size = TALK_OG_SIZE
export const contentType = 'image/png'

/** Renders this route's OG image. */
export default function Image() {
	return talkOgImage({ tool: 'vfClamp', eyebrow: 'A talk · vf-clamp', title: ['Sell the styles,', 'ship the space.'], footnote: '394 foundries. 22 sell subfamily variable fonts. None scope one to the purchase.', path: 'vfclamp.com/talk', motif: <ClampOgMotif /> })
}
