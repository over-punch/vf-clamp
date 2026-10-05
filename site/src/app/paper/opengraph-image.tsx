// Open Graph image for vfclamp.com/paper, rendered by the shared talk OG component with vf-clamp's clamp motif.
import { talkOgImage, TALK_OG_SIZE } from '../../components/talk/talkOg'
import { ClampOgMotif } from '../../components/talk/ogMotif'

export const alt = 'Sell the Styles, Ship the Space — Paper'
export const size = TALK_OG_SIZE
export const contentType = 'image/png'

/** Renders this route's OG image. */
export default function Image() {
	return talkOgImage({ tool: 'vfClamp', eyebrow: 'The paper · vf-clamp', title: ['Sell the styles,', 'ship the space.'], footnote: 'A survey, a benchmark and ten years of debate on variable font licensing.', path: 'vfclamp.com/paper', motif: <ClampOgMotif /> })
}
