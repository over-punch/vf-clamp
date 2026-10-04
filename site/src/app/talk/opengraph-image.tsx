// Open Graph image for vfclamp.com/talk, rendered by the shared talk OG component.
import { talkOgImage, TALK_OG_SIZE } from '../../components/talk/talkOg'

export const alt = 'Sell the Styles, Ship the Space — Slides'
export const size = TALK_OG_SIZE
export const contentType = 'image/png'

/** Renders this route's OG image. */
export default function Image() {
	return talkOgImage('A talk · vf-clamp', '394 foundries. 22 sell subfamily variable fonts. None scope one to the purchase.')
}
