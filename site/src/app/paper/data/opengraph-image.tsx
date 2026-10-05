// Open Graph image for vfclamp.com/paper/data, rendered by the shared talk OG component.
import { talkOgImage, TALK_OG_SIZE } from '../../../components/talk/talkOg'

export const alt = 'Sell the Styles, Ship the Space — Survey data'
export const size = TALK_OG_SIZE
export const contentType = 'image/png'

/** Renders this route's OG image. */
export default function Image() {
	return talkOgImage('Survey data · vf-clamp', 'One row per foundry, with evidence links.', 'vfclamp.com/paper/data')
}
