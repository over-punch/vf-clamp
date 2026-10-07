// Talk deck for "Sell the Styles, Ship the Space": vf-clamp's slides (slides.tsx) on the shared talk engine (engine.tsx, synced from type-tools/shared/talk).
'use client'

import { Deck } from './engine'
import { SLIDES, TALK_TITLE, TALK_CSS } from './slides'

/** Gap between a slide's builds, in ms: each slide plays its builds on its own, so one click is one slide. */
const AUTO_BUILD_MS = 1300

/** The full-viewport talk deck. Arrow keys / space move one slide at a time (builds play by themselves), N for notes, F for fullscreen. Add ?manual to the URL to step builds by hand. */
export default function TalkDeck() {
	return <Deck slides={SLIDES} title={TALK_TITLE} css={TALK_CSS} autoBuildMs={AUTO_BUILD_MS} />
}
