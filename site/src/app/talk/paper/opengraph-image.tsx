// Open Graph image for vfclamp.com/talk/paper, rendered by the shared talk OG component.
import { talkOgImage, TALK_OG_SIZE } from '../../../components/talk/talkOg'

export const alt = 'Sell the Styles, Ship the Space — Paper'
export const size = TALK_OG_SIZE
export const contentType = 'image/png'

/** Renders this route's OG image. */
export default function Image() {
	return talkOgImage('The paper · vf-clamp', 'A survey, a benchmark and ten years of debate on variable font licensing.')
}
