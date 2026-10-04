// Open Graph image for vfclamp.com/talk/transcript, rendered by the shared talk OG component.
import { talkOgImage, TALK_OG_SIZE } from '../../../components/talk/talkOg'

export const alt = 'Sell the Styles, Ship the Space — Transcript'
export const size = TALK_OG_SIZE
export const contentType = 'image/png'

/** Renders this route's OG image. */
export default function Image() {
	return talkOgImage('Transcript · vf-clamp', 'The full spoken script of the talk.')
}
