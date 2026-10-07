// Speaker script for the talk "Sell the Styles, Ship the Space": one entry per slide, shared by the deck (presenter notes) and the transcript page.

/**
 * One slide's script: its deck id, a label (the headline shown on that slide, so the transcript and the deck match), and the spoken text with [bracketed] cues for builds and cuts.
 * Delivery marks: " / " a short pause or breath, " // " a longer beat, *word* stress, and {braces} around a
 * passage that reads out what someone said (shown dimmed, so the speaker can choose to read it or skip it).
 */
export interface ScriptEntry {
	id: string
	label: string
	text: string
}

/** The script in slide order. Use typographic apostrophes (’) only: a straight one breaks this file. */
export const SCRIPT: ScriptEntry[] = [
	{ id: 'cover', label: 'Sell the styles, ship the space.', text: 'Hi. / I’m Quinn Keaveney, / speaking to you from Vancouver. // This talk is about a small mismatch / in how fonts are sold, / and a simple way to fix it.' },
	{ id: 'hook', label: 'You bought four weights. You got four files.', text: 'Here’s a typical order. / Regular, / Medium, / SemiBold / and Bold. [Next] That’s *four* static files. // [Next] What you could get instead / is *one* file: / any weight from Regular to Bold, / and nothing past it.' },
	{ id: 'unused', label: 'Variable fonts are made, and rarely sold.', text: 'Foundries *make* variable fonts. / They just don’t *sell* many. // [Next] {Kris Sowersby at Klim said they’d had maybe four requests / since launch.} [Next] {Christopher Slye at Type Network: / not exactly burning up the charts.} // [Next] {And Sowersby said why: / they have to be priced as the full family, / because that’s what they *are*.}' },
	{ id: 'price', label: 'A variable font comes as a bundle.', text: 'And that’s the catch. // [Next] {Mark Simonson says most of his customers buy one to six styles / out of forty-eight.} [Next] But at Dalton Maag, / two single styles cost sixty-four pounds, / and the cheapest variable font is ninety-five. // You asked for two slices; / you’re being sold the whole pizza.' },
	{ id: 'styles', label: 'Designers buy styles. Foundries build spaces.', text: 'Underneath that / is a mismatch. // Designers think in *named styles*. / Foundries build *design spaces*. [Next] {Nick Shinn says dropping the names Regular and Bold / seems impossible.} [Next] {And John Hudson calls named instances *signposts*: / pins on a map.}' },
	{ id: 'mm', label: 'Multiple Masters shipped the space, 1991–1998.', text: 'We’ve tried selling the space before. // In the nineties, / Adobe’s Multiple Master fonts / shipped a whole design space. [Next] {Thomas Phinney, who was at Adobe, / said they sold well, / but most people only used the instances that came with them.} // A mixing desk, / for people who wanted a volume knob. // So don’t sell sliders. / Sell the *styles*, / and put the *space* between them in the box.' },
	{ id: 'adoption', label: 'The web chose variable anyway, mostly for free fonts.', text: 'Meanwhile, / the web went variable anyway: / eleven percent of mobile pages in 2020, / forty-one percent in 2025. // Mostly *free* fonts, though. / Whether people will *pay* for them / is still an open question.' },
	{ id: 'suite', label: 'Three of our tools need a variable font.', text: 'Full disclosure: / three of our own type tools don’t work without a variable font: [Next] axisRhythm, [Next] hoverBoldly, [Next] and magnetType. / Five more lose their main effect. // [Next] Bold a menu item on hover, / and the line shifts about three and a half pixels. / hoverBoldly removes that, / but *only* with a variable font.' },
	{ id: 'crossover', label: 'Clamped, it’s smaller from two weights on.', text: 'Then there’s file size. // Each static weight of Inter / is about a hundred and ten kilobytes. [Next] The clamped variable font / is *already* smaller at two neighbouring weights: / a hundred and sixty-two kilobytes / against two hundred and twenty-six. / By seven weights, / seventy-two percent smaller. // [Next] Optical size costs more, / so pin the axes the customer didn’t buy.' },
	{ id: 'survey', label: '394 foundries in the Type Foundry Directory.', text: 'So how are variable fonts actually sold? // We checked every foundry in the Type Foundry Directory. [Next] Three hundred and ninety-four of them: / buy pages, / licences, / store data. [Next] Then a second pass tried to overturn every call, / and changed twenty-seven.' },
	{ id: 'funnel', label: 'Nobody sells a VF cut to your purchase.', text: 'Here’s how it falls out. // [Next] Two hundred and thirteen sell variable fonts. [Next] A hundred and nineteen sell one without the family, / usually the whole design space / at close to the family price. [Next] Twenty-two sell a *smaller* variable font, / cut from the family. // [Next] And *none* / sell one cut to the styles you bought.' },
	{ id: 'precedent', label: '22 foundries already sell a slice.', text: 'Those twenty-two matter. // Each sells a whole width, / or a whole optical size, / as its own variable font, / usually for about a third of the family price. // And they *still* sell families.' },
	{ id: 'gap', label: '0 of 213 variable-font sellers cut one to the styles bought.', text: 'So, / from the buyer’s side: // ask for Regular to Bold in one file, / and you get the whole family, / or four files. // There’s no third option.' },
	{ id: 'asked', label: 'Nick Sherman asked for range licences in 2015.', text: 'People have asked for this / for years. [Next] {In 2015, / Nick Sherman suggested a Light to Medium range / should cost less than Thin to Black.} [Next] {In 2018, / John Hudson asked for a tool that cuts a design space down.} [Next] {In 2022, / Nick Shinn asked for a distributor app / that does exactly that.} // The idea is eleven years old. / Nobody’s built the shop.' },
	{ id: 'opportunity', label: 'Fontdue, Google Fonts and fontTools each do part of it.', text: 'And the pieces exist. // [Next] Foundries already license *part* of a design space. [Next] Fontdue already builds a file for every order. [Next] And Google Fonts already cuts fonts at delivery, / but only whole axes: / ask for four hundred to seven hundred, / and you still get one hundred to nine hundred.' },
	{ id: 'how', label: 'Buy styles, get one file.', text: 'It works like this. // [Next] The customer picks styles, / like always. [Next] At checkout, / the weight axis is clamped to what they bought, / and unlicensed axes are pinned. [Next] The file is renamed for the range, / and the font menu still lists the four styles. [Next] It ships *with* the statics, / because desktop apps still handle variable fonts badly. [Next] One wrinkle: / Regular and Bold with nothing between. / Send two files, / or price the weights in between.' },
	{ id: 'demo', label: 'vf-clamp, on fontTools.', text: 'Is it practical? // vf-clamp is our tool; / underneath, / it’s fontTools. [Cut to demo: load Encode Sans, pick Regular, Medium, SemiBold and Bold, download, end on the Regular to Bold result.] Four weights in, / one file out, / a third smaller than the full font.' },
	{ id: 'objections', label: 'What TypeDrawers said against it.', text: 'There are good objections, / and they’re all on this slide. / I’ll take the two hardest. // {Thomas Phinney warned that slicing as a regular part of business / makes retail complicated.} / The clamp takes seconds and can be cached; / pricing the weights in between / is the harder part. // {Nick Shinn worried cheap variable fonts would erode family prices.} / The foundries selling slices still sell families, / though nobody publishes the numbers.' },
	{ id: 'ask', label: 'Three asks.', text: 'So, / three asks. // [Next] Foundries: / keep selling styles, / and include a variable font for the range. [Next] Storefronts: / add a clamp step at checkout, / and run *one* pilot / to see if anyone pays. [Next] Licence authors: / twenty-seven of the thirty-five licences we read / never mention variable fonts. / Write down the range, / and allow any weight inside it.' },
	{ id: 'close', label: 'Sell the styles, ship the space. (closing slide)', text: 'Designers are going to keep thinking in styles. // That’s fine. // Keep selling them styles, / and ship the *space* between them / with the order.' },
	{ id: 'about', label: 'We’re Overpunch.', text: 'We’re Overpunch. // We’ve built websites for type foundries for fifteen years, / we make type tools for the web, / and we’re building Typetin, / a storefront for independent foundries. // Try vf-clamp, / and read the paper, / at vfclamp.com. // Thank you.' },
]

/** Script text keyed by slide id, for the deck's presenter notes. */
export const SCRIPT_NOTES: Record<string, string> = Object.fromEntries(SCRIPT.map(e => [e.id, e.text]))

/** Strips [bracketed] build and cut cues, leaving only the spoken words with their delivery marks. */
export function spoken(text: string): string {
	return text.replace(/\s*\[[^\]]*\]\s*/g, ' ').replace(/\s+/g, ' ').trim()
}

/**
 * How many clicks a slide takes before the next slide appears: one per [Next] build cue ([Next ×N] counts N),
 * plus the click that moves on.
 */
export function clicksToNext(text: string): number {
	let builds = 0
	for (const m of text.matchAll(/\[Next(?: ×(\d+))?\]/g)) builds += m[1] ? Number(m[1]) : 1
	return builds + 1
}

/** Strips delivery marks too (pauses and *stress*), leaving plain prose. */
export function plain(text: string): string {
	return spoken(text).replace(/[{}]/g, '').replace(/\s*\/\/?\s*/g, ' ').replace(/\*([^*]+)\*/g, '$1').replace(/\s+([,.;:!?”])/g, '$1').replace(/\s+/g, ' ').trim()
}
