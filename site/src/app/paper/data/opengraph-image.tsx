// Open Graph image for vfclamp.com/paper/data, rendered by the shared talk OG component with vf-clamp's clamp motif.
import { talkOgImage, TALK_OG_SIZE } from '../../../components/talk/talkOg'
import { ClampOgMotif } from '../../../components/talk/ogMotif'

export const alt = 'Sell the Styles, Ship the Space — Survey data'
export const size = TALK_OG_SIZE
export const contentType = 'image/png'

/** Renders this route's OG image. */
export default function Image() {
	return talkOgImage({ tool: 'vfClamp', eyebrow: 'Survey data · vf-clamp', title: ['Sell the styles,', 'ship the space.'], footnote: 'One row per foundry, with evidence links.', path: 'vfclamp.com/paper/data', motif: <ClampOgMotif /> })
}
