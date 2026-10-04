// Public text of the paper "Sell the Styles, Ship the Space" (markdown subset rendered by components/talk/Prose.tsx).

/** Paper body in markdown. {{figure:name}} lines are replaced by figures on the page. */
export const PAPER_MD = `
Designers buy type as named styles. Foundries build it as design spaces. Today's licensing makes them choose: a variable font usually costs the whole family, so almost nobody licenses one. This paper argues for keeping the styles and shipping the space: deliver a variable font clamped to exactly the range a customer bought.

*Disclosure: the authors make [vf-clamp](https://vfclamp.com) and other variable-font tools. Every measurement here uses plain fontTools, and no recommendation requires our tool.*

## Summary

Nearly every foundry now makes variable fonts, and the web has adopted them: 41% of mobile pages used one in 2025. But commercial variable fonts are rarely licensed, because most foundries sell them only with the complete family, and most customers buy one to six styles.

We surveyed all 394 foundries in the [Type Foundry Directory](https://typefoundry.directory/). 227 sell variable fonts. 22 sell a smaller variable font without the complete family, and every one of those is a complete, foundry-defined subfamily: one width, one optical size, upright only. **None scopes a variable font to the styles a customer actually bought.** Nick Sherman proposed range-priced licences in 2015, and the type community has asked for the delivery tool on TypeDrawers ever since.

The technique is a single, well-tested library call: fontTools' range instancing. Our benchmark shows a weight-clamped variable font is already smaller than the static files at two styles, and 72% smaller at seven. The change foundries need is in licences and storefronts, not in type design.

## The problem: variable came to mean whole family

The full-family default comes from what a variable font file contains, not from what customers need. In 2018 Johannes Neumeier of Underscore set out the bind: *"By their very nature, Variable fonts include all styles, so from a type foundry's perspective that is licensing those fonts, the price point should follow that of the entire family"* ([Underscore, 2018](https://underscoretype.com/articles/2018/07/05/is-the-future-of-variable-fonts-stuck-in-the-licensing-past)).

The result is that variable fonts are made but rarely licensed. Kris Sowersby of Klim: "We've had maybe 4 requests for VF since it launched. … About half our sales are for singles/pairs. … VF have to be priced as full family, because that's what they are" ([TypeDrawers, 2021](https://typedrawers.com/discussion/4252/)). Type Network's Christopher Slye said variables "are not exactly burning up the charts yet" ([TypeDrawers, 2022](https://typedrawers.com/discussion/4647/are-customers-buying-or-using-variable-fonts)).

Mark Simonson explains why with his own numbers: "Only a tiny percent of customers purchase an entire static family. … The bulk of my customers purchase 1-6 styles from the 48 available." Matthew Butterick reports a type designer's server logs: of his webfont customers, "almost all of them used only one or two" styles of a family ([Practical Typography](https://practicaltypography.com/the-scorpion-express.html)). Jason Pamental acknowledged "frustration about lack of sales" for variable fonts sold "in many cases, only with the purchase of a full family" ([RWT.io, 2019](https://rwt.io/typography-tips/what-the-web-wants/)). In 2022 Simonson priced Proxima Vara by its axes, at $99 against $744 for the 48-style Proxima Nova (today $199.99 against $975.99 for an 80-style superfamily), and warned that variable fonts will not "catch on if they are only available at a full static family price" ([TypeDrawers, 2022](https://typedrawers.com/discussion/4329/variable-fonts)).

## Styles and spaces

The deeper mismatch is conceptual. Type designers build a family as a design space between masters; customers think of it as a list of named styles. Nick Shinn: "Dispensing with the concept of naming the two most basic weights Regular and Bold seems impossible." John Hudson describes named instances as "navigation signposts or like pins on a map" in a space people find "difficult to mentally conceptualise" ([TypeDrawers, 2023](https://typedrawers.com/discussion/4647/are-customers-buying-or-using-variable-fonts/p2)). Designers told Jeff Peters "they don't want to drag sliders when setting type, they want pre-made weights" ([TypeDrawers, 2022](https://typedrawers.com/discussion/4329/variable-fonts)).

The answer is not to make customers think in sliders. It is to let them keep buying the styles they think in, and deliver the space between those styles. A purchase of Regular and Bold becomes a variable font spanning Regular to Bold, with the named instances still listed as the signposts. As vf-clamp's own design notes put it: not subfamilies, instance ranges.

## The web chose variable

{{figure:adoption}}

The share of mobile pages using a variable font rose from 11% in 2020 to 41% in 2025; desktop reached 39.4% ([Web Almanac 2025](https://almanac.httparchive.org/en/2025/fonts), [2022](https://almanac.httparchive.org/en/2022/fonts)). But the growth is driven by free fonts: Noto Sans JP, Roboto, Open Sans and Montserrat make up almost 60% of all variable font requests. Supply on the paid side is thin: variable fonts are 28% of the Google Fonts library but only 7% of Adobe Fonts ([Phinney, 2026](https://www.thomasphinney.com/2026/07/variable-font-ui-is-broken/)). This shows the format is used where price is no barrier; it does not show that customers will pay for it. That question is open (see *Open questions*).

## What static buyers lose

- **Automatic optical sizing.** Browsers apply the \`opsz\` axis by default, matched to the rendered size, in every major browser since 2020 ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/font-optical-sizing)). Static cuts can't.
- **Adapting to the reader.** A grade or weight axis lets text respond to dark mode and contrast preferences ([Argyle, web.dev](https://web.dev/articles/adapting-typography-to-user-preferences-with-css)).
- **In-between values.** Weight can ease between breakpoints instead of jumping from file to file.
- **Whole techniques.** In the Overpunch type tools, three tools do nothing without a variable font ([axisRhythm](https://axisrhythm.com), [hoverBoldly](https://hoverboldly.com), [magnetType](https://magnettype.com)) and five more lose their main effect. hoverBoldly's bold-on-hover shifts the line by 5.8px with static fonts and 0.0px with a variable one.

None of this needs the whole family. Each works inside a narrow range such as Regular to Bold.

## File size: the crossover

The usual objection is that two static files are smaller than one variable font. Against the *full* variable font that is often true; Peter Constable noted many full VFs are "bigger than the size of those two files" ([TypeDrawers, 2021](https://typedrawers.com/discussion/4252/)). Against a *clamped* one it is not.

{{figure:crossover}}

We measured Inter 4 and Merriweather in WOFF2, comparing the total size of static instances with a variable font clamped to the same weight span (method below).

| Purchase | Font | Static files | Clamped VF | Full VF |
| --- | --- | --- | --- | --- |
| Regular + Bold | Inter 4 | 226 KB | **173 KB** (−24%) | 345 KB |
| Regular + Bold | Merriweather | 161 KB | **131 KB** (−18%) | 511 KB |
| Seven weights | Inter 4 | 797 KB | **225 KB** (−72%) | 345 KB |

The crossover comes at two styles. Keeping a free axis costs something: Inter with optical size kept is 250 KB for Regular to Bold, still smaller than the statics from three styles on, and Merriweather Regular to Bold with optical size kept is 238 KB, less than half the full variable font. Keeping width as well brings Merriweather back to 495 KB. So the rule is: **pin the axes the customer did not license, and keep the ones that add value for free.** Web fonts are usually subset, so we repeated the two-style test on Google Fonts' Latin range: two statics total 64,104 bytes; the clamped VF is 50,168 bytes, 22% smaller. Keeping optical size makes it 76,096 bytes, 19% larger than the statics, so for a two-style web buyer optical size is worth pinning. A second check on five Fontsource families (Inter, Roboto, Open Sans, Montserrat and Source Sans 3, Latin subsets) found the same pattern: a variable font clamped to Regular–Bold was 0.4–0.5 times the size of the four equivalent static files. Where the range excludes the font's default, the saving against the full variable font shrinks to almost nothing (see *Engineering caveats*). Our measurement also reproduces vf-clamp's own figure: Inter's full WOFF2 at 345 KB falls to 250 KB clamped to weights 400–700, a 28% saving.

## What a two-style buyer pays

The median price of a single text style across 171 independent foundries in 44 countries is about €50 for a desktop licence and the same for web ([Font Licensing Mess, 2025](https://fontlicensingmess.com/licenses/desktop/)). Family discounts are steep: 44% off for a 16-style Proxima Nova family and 69% off for the 80-style superfamily ([Mark Simonson Studio](https://www.marksimonson.com/fonts/view/proxima-nova)). For someone who needs two styles, though, a variable font is a large step up.

| Offer, list prices October 2026 | Two single styles | Cheapest variable font | Premium |
| --- | --- | --- | --- |
| [Aktiv Grotesk, Dalton Maag](https://www.daltonmaag.com/font-library/aktiv-grotesk.html) | £63 | £95 (weight axis, 9 styles) | 1.5× |
| [Proxima Vara, Mark Simonson](https://www.marksimonson.com/fonts/view/proxima-vara) | $79.98 | $199.99 (full design space) | 2.5× |
| Aktiv Grotesk, full design space | £63 | £380 (3 axes, 54 styles) | 6× |

So a two-style buyer pays 1.5 to 6 times more to get a variable font today. Per-axis pricing already exists: Simonson bases his price "on the number of axes", Dalton Maag doubles the price with each axis, and Tiro adds "a charge for each variable design axis implemented in the font" ([Tiro, 2025](https://www.tiro.com/articles/something-like-a-typeface)). But all of them still sell the whole range of each axis; none sells a region of it. No distributor publishes how many styles customers buy per order; Peter Constable's 2022 question, "How many buy entire families versus a limited number of styles?", is still unanswered with data ([TypeDrawers](https://typedrawers.com/discussion/4329/variable-fonts)).

## Market survey: every foundry in the directory

{{figure:funnel}}

We checked all 394 foundries in the Type Foundry Directory against their buy pages, licences and store data, then ran a second pass that tried to overturn every classification; 27 changed. Just over half of the foundries that sell variable fonts (119 of 227) offer one without the complete family, usually a standalone variable font covering the full design space, often priced exactly like the static family. Where both prices could be compared (120 foundries), the cheapest route to a variable font cost less than the complete family at 71 foundries, the same at 40 and more at 9. The other 94 sellers require the complete family. Every row, with its evidence link, is in the [survey data](/talk/data).

## Precedent: 22 foundries sell subfamily variable fonts

Partial variable fonts are not hypothetical. 22 foundries sell a smaller variable font without requiring the complete family. Every one covers a complete subfamily, one width, one optical size, one posture or one corner style, across that subfamily's full range. The slice usually costs about a third of the complete family (range 19–67%).

| Foundry | How the variable font is cut | Slice vs complete family |
| --- | --- | --- |
| [BAL Foundry](https://www.bal-foundry.com/typefaces/thunder-collection) | Thunder: one VF per optical size | €400 vs €600 |
| [CJ Type](https://sites.fastspring.com/cjtype/product/pennypackerwidefamily) | Pennypacker: one VF per width | $337.50 vs $1,600 |
| [CSTM](https://type.today/en/journal/normalidad) | Normalidad: 11 single-axis partial VFs | $200 vs $1,000 |
| [Dalton Maag](https://www.daltonmaag.com/font-library/aktiv-grotesk.html) | Aktiv Grotesk: sold by number of axes | £95 vs £380 |
| [Dinamo](https://abcdinamo.com/buy/diatype) | Diatype: one VF per width | €504 vs €1,224 |
| [DJR](https://djr.com/roslindale) | Roslindale: subfamily VFs without width and optical size | $100 vs $200 |
| [Flight Mode](https://backend.contemporarytype.com/api_front/product/science-sans?with-bundles) | FL Science Sans: one VF per width | about $475 vs $2,445 |
| [Gruppo Due](https://gruppo-due.com/shop/airdancer) | G2 Airdancer: width-only VF per corner style | not shown |
| [Identity Letters](https://www.identity-letters.com/font-catalog/allrounder-grotesk) | Allrounder Grotesk: one VF per width | €200 vs €599 |
| [Kilotype](https://kilotype.de) | Width packages ship their own VFs | not shown |
| [Luzi Type](https://luzi-type.ch/shop/spezia-normal) | Spezia: weight-only VF per width | not shown |
| [Mass-Driver](https://mass-driver.com/typefaces/md-system/) | MD System: Mono VF without the width axis | €300 vs €900 |
| [NaN](https://www.nan.xyz/eula/) | Licence grants a VF "covering the styles bought" | €200 vs €450 |
| [nice to type](https://nicetotype.jp/retailtypefaces/massimo-grafia/) | Massimo Grafia: one-axis VF per subfamily | ¥37,418 vs ¥56,631 |
| [Optimo](https://optimo.ch/typefaces/ritmica) | Ritmica: upright VF without the slant axis | CHF 300 vs CHF 600 |
| [Pangram Pangram](https://pangrampangram.com/products/neue-montreal) | Neue Montreal: upright-only or italic-only VF | not shown |
| [Pizza Typefaces](https://typefaces.pizza/licences/) | A "variable font slice" per subfamily | €150 vs €600 |
| [Polytype](https://polytype.co.uk/freizeit/) | Freizeit: one VF per width | £392 vs £1,176 |
| [Smuss Type Kiosk](https://typekiosk.smuss.studio/buy?font=bureau-sans) | Bureau Sans: one VF per width | 600 vs 1,500 |
| [Socio Type](https://socio-type.com/faq) | Gestura: free beta VF per optical size | £350 vs £1,050 |
| [Studio Feixen](https://fonts.studiofeixen.ch/store) | Ease: one VF per subfamily | 375 vs 1,200 |
| [Typotheque](https://www.typotheque.com/help) | Greta Sans: weight-only VF per width | not verified |

None narrows a range inside a subfamily. BAL's Thunder Text VF is limited to weights 400–700, but so is the full Thunder collection. NaN comes closest in policy: its EULA grants "a variable font covering the styles bought", but only with a whole family or subfamily, and single-style buyers get none. Another 15 foundries sell sub-designs such as upright and italic as separate full-range variable fonts; we don't count those as slices.

Adjacent practices show the remaining pieces are routine. Fontdue already builds a file per order: every delivered font "is watermarked with the ID of that order" ([Fontdue](https://www.fontdue.com/docs/platform/watermark-lookup)). Displaay's licence lets buyers of the variable option "modify the available axes" ([Displaay](https://displaay.net/help/licenses)). And the tools for cutting design sub-spaces exist: Source Foundry's [Slice](https://github.com/source-foundry/Slice) "generates fonts with custom design sub-spaces from variable font inputs", and Dinamo's [Font Gauntlet](https://fontgauntlet.com/) offers "Axis Clipping" and instance generation, with a switch that lets a host disable export.

## Asked for since 2015

The pricing idea is eleven years old. In January 2015, before OpenType variable fonts existed, Nick Sherman proposed it: "One potential solution might be to license ranges of stylistic variation. So it would cost less to license a limited weight range from Light to Medium (300–500) than a wide gamut from Thin to Black (100–900)" ([A List Apart, 2015](https://alistapart.com/blog/post/variable-fonts-for-responsive-design/)). At the format's launch in 2016, Typekit's Tim Brown wrote: "The hard part now will be licensing. Nobody knows yet how to handle the business aspects of variable fonts" ([Typekit, 2016](https://blog.typekit.com/2016/09/14/variable-fonts-a-new-kind-of-font-for-flexible-design/)). A reader asked under that post: "Will we have to pay the full 'font family' price for each 'variable font' regardless of how many variations of that font we actually need?"

The same year Andrew Johnson suggested "allowing people to pick what areas of that design space are finally licensed and downloaded / hosted", while Thomas Phinney warned of "an explosion of purchasing complexities and SKUs" ([TypeDrawers, 2016](https://typedrawers.com/discussion/1813/variable-font-ui-and-licensing)). John Hudson in 2018 proposed "a variable design space subsetting tool, that would enable customers to generate smaller variable fonts containing only the axes and deltas they need" ([TypeDrawers](https://typedrawers.com/discussion/2976/the-current-state-of-variable-fonts-end-of-2018)). Nick Shinn in 2022: "An app on the distributor site could do that, and generate the VF with only the weight instances requested" ([TypeDrawers](https://typedrawers.com/discussion/4252/)). When fontTools added range instancing, Dave Crossland called it "very good news" for anyone wanting "to offer sub-spaces of the full family design space for a discount of the full retail price" ([TypeDrawers](https://typedrawers.com/discussion/4579/fonttools-level-4-variable-font-instancing-opens-up-new-retail-option)). No one reports having built it. What this paper adds is not range pricing, which Sherman proposed, but the delivery step that makes it enforceable: a file that physically contains only the licensed range.

## How it works

{{figure:pipeline}}

fontTools' instancer restricts an axis to a new minimum and maximum, for example \`wght=400:700\`, and returns a valid variable font covering only that range ([fontTools docs](https://fonttools.readthedocs.io/en/latest/varLib/instancer.html)). In our tests it also prunes the font's tables: clamped to 400–700, Inter keeps only the Regular, Medium, SemiBold and Bold named instances, and its STAT table drops Thin, Light, ExtraBold and Black while keeping the optical-size values. That is what keeps unbought styles out of application menus.

Clamping sells a range, not a set of styles: a Light-and-Bold purchase also delivers the weights in between. In licensing terms, today's static licence is a range of one point, and the range model includes it. As files they still differ: foundry statics may carry hinting and hand corrections that an instance does not.

Nobody serves ranges yet either. We tested the [Google Fonts CSS2 API](https://developers.google.com/fonts/docs/css2): Inter requested at \`wght@100..900\`, \`400..700\` or \`500..600\` returns the same file: a 48,432-byte Latin subset whose weight axis still runs 100–900 (tested 4 October 2026 with a Chrome 140 user agent). Adding \`opsz\` or \`text=\` changes the subset, never the range. Google and [Fontsource](https://fontsource.org/docs/getting-started/variable) drop or pin whole axes on the fly; neither narrows a range. [vf-clamp](https://vfclamp.com) is one implementation of the full pipeline, as an npm package, CLI, REST API and plugins for Glyphs, RoboFont and VS Code.

## Licensing language

Most licences cannot yet express a range. We read 35 foundry and distributor EULAs in October 2026: 27 never mention variable fonts at all, including 15 of the 20 subfamily-VF sellers whose licences we could read, and four mention them only as a file format. Most define the licence as a set of files, so their blanket bans on modification technically forbid a customer from clamping or subsetting a file further. Commercial Type forbids "creating additional weights"; Production Type forbids "the creation of additional weights, styles, or variations". Others already point the way:

- **BAL Foundry** grants and fences in one clause: "For Variable Font formats, the use and generation of instances within the permitted licensed scope is allowed. However, extraction or reconstruction of axis data, modification of the variation space or interpolation models … is strictly prohibited" ([BAL EULA](https://www.bal-foundry.com/eula)).
- **Displaay** ties axis rights to the invoice: buyers of the "Variable" option "are allowed to modify the available axes of the variable Fonts" ([Displaay](https://displaay.net/help/licenses)).
- **NaN** states the commercial idea plainly: "a variable font covering the styles bought" ([NaN EULA](https://www.nan.xyz/eula)).
- **Dalton Maag** keeps derived files inside the licence: "Font Software includes all subsets or transformations derived from the Font Software" ([Dalton Maag licence](https://www.daltonmaag.com/download/dama/LicenceAgreement.pdf)).

A range licence needs four parts. **Scope:** the licensed axis ranges, or the named instances they span, listed on the invoice. **Grant:** use and generation of any instance inside that scope. **Optimisation right:** subsetting and further narrowing for performance, with derived files under the same licence. **Fence:** no widening, extrapolating or reconstructing the variation space beyond the licensed range.

## Delivery and app support

**In applications.** Apps fall into two groups. Adobe Illustrator, Photoshop and InDesign, Figma, Affinity, Sketch and CorelDRAW let users choose any in-between value; Microsoft Word, PowerPoint, Apple Keynote and Pages "show only the styles the foundry chose to name" ([FontLab, 2026](https://blog.fontlab.com/2026/09/02/transtype-5/)). Windows exposes named instances only, projected through the STAT table ([Microsoft](https://learn.microsoft.com/en-us/windows/win32/directwrite/opentype-variable-fonts)). For a range licence both groups behave well: a file clamped to Regular–Bold lists only the named styles inside the range. We checked with macOS CoreText, the text system behind Pages and Keynote: full Inter lists nine weights, while Inter clamped to Regular–Bold lists Regular, Medium, SemiBold and Bold, with a 400–700 weight axis. InDesign and Figma show a 400–700 slider. Slider interfaces themselves remain rough ([Phinney, 2026](https://www.thomasphinney.com/2026/07/variable-font-ui-is-broken/)), which is one more reason to ship the statics alongside.

**On the web.** CSS already treats a clamped file correctly: weights outside the font's range are "clamped to the closest value supported by the font" ([CSS Fonts 4](https://www.w3.org/TR/css-fonts-4/)), so \`font-weight: 900\` on a Regular–Bold file renders at Bold rather than failing, provided \`@font-face\` declares \`font-weight: 400 700\`; without that descriptor browsers may synthesise a fake bold. The W3C's Incremental Font Transfer standard, a Candidate Recommendation since November 2025, can segment "design-variation space" into partial axis ranges ([IFT](https://www.w3.org/TR/IFT/)), but no browser ships it yet ([Chrome Status](https://chromestatus.com/feature/5135917565214720)), and it is a transfer mechanism, not a licence boundary.

**Engineering caveats.** Clamping is reliable but not free of edge cases. If the purchased range excludes the font's default instance (Montserrat and Source Sans 3 default to their lightest weight), the default must move, the file saves little or nothing over the full VF, and the name table must be rewritten so the font is not still called "Thin". A purchase of Regular and Bold delivers Medium and SemiBold as named instances too, because a range is continuous. Partial instancing of the newest formats (avar2, VARC) arrived in fontTools only in 2026 ([release notes](https://github.com/fonttools/fonttools/releases)). A delivery pipeline should validate names and STAT after every clamp, and set a per-order unique ID (name ID 3), which vf-clamp leaves unchanged. Clamping limits what a file contains, not what can be computed: in a simple two-master design, the remaining deltas can be extrapolated past the range. The file makes the scope clear; the licence's fence does the enforcing. Speed is not a constraint: clamping and saving a Latin Inter took about 3 seconds, and a family has few possible ranges, so files can be cached.

## Objections, answered

The strongest objections come from TypeDrawers itself.

| Objection | Answer |
| --- | --- |
| "Slicing up variable fonts … would make the retail aspects much more complicated" (Phinney, 2016) | The clamp is one fontTools call, about 3 seconds, plus name and STAT validation. Customers still pick named styles. Pricing the in-between styles is the real decision (see *Open questions*). |
| Sellers of slices "will, before long, be undercut by someone who selling the whole thing as a unit" (Kosofsky, 2016) | Sell both: the range now, the full space as the upgrade. 22 foundries already sell subfamily VFs alongside families. |
| Cheap VFs will "erode the price of buying a complete family" (Shinn, 2022) | Phinney's reply: "is that a problem, and if so, why?" Whether partial buyers would otherwise buy the family is untested; 22 foundries already take that risk with subfamily VFs. |
| File-size benefits hold "only sometimes" (Constable, 2021) | True for a full VF. Clamped, the VF wins from two styles. |
| Between two masters there are infinite weights, so a range is worth more | Customers pay for styles they can name. A premium is fair; the full-family price is not. |
| Desktop apps handle variable fonts badly | True today. Ship the VF alongside the statics, not instead of them. |
| "I see no evidence that variable fonts are something my customers want" (Butterick) | They want the styles they use, and the web adopted variable fonts where they were free: 41% of mobile pages. Whether full-family pricing hides paid demand is a hypothesis; a foundry pilot could test it. |

Sources: [thread 1813](https://typedrawers.com/discussion/1813/variable-font-ui-and-licensing), [4329](https://typedrawers.com/discussion/4329/variable-fonts), [4252](https://typedrawers.com/discussion/4252/).

## Recommendations

**For foundries**

1. Keep selling styles. With every licence of two or more styles, ship a variable font clamped to the range bought, alongside the statics.
2. Pin the axes the customer did not license; keep free ones such as \`opsz\` and \`GRAD\`. Pinning removes an axis entirely.
3. Make upgrades widen the range. A customer who adds Black receives a wider file, not an extra one.
4. Publish the axes and ranges of every variable font you sell, and list variable fonts as products rather than delivering them on request.

**For storefronts**

5. Add a clamp step at fulfilment. Fontdue already generates a file per order; today variable fonts exist only as fixed, pre-cut products ([Fontdue](https://www.fontdue.com/docs/platform/variable-fonts)).

**For licence authors**

6. Define a variable-font licence by design space, in four parts: scope on the invoice, a grant for instances inside it, a right to optimise, and a fence against widening (see *Licensing language*). 27 of the 35 licences we read, a sample weighted towards VF sellers, never mention variable fonts.
7. Say explicitly that customers may subset or clamp a font further for performance. Blanket bans on modification currently forbid it by accident.

## Open questions

- **How should a range be priced?** By styles in the range, by axes, or a premium over the statics. Simonson, Dalton Maag and Tiro price by axes; Johannes Neumeier suggested a web VF priced at the base style times "a common number of styles in use on a website, let's say ~4" ([TypeDrawers](https://typedrawers.com/discussion/4252/)).
- **Is usage-based pricing the better model?** Yehang Yin proposes "infinite style variations with a more reasonable usage-based pricing model" ([ATypI 2025](https://atypi.org/presentation/towards-infinite-styles-do-we-even-need-fonts/)). A range licence keeps today's style-based purchase; usage pricing replaces it.
- **What remains unclassified?** 32 foundries could not be settled from public pages; 130 foundries that neither our first pass nor the directory flagged as selling VFs were not re-checked.
- **Should upright/italic splits count?** 15 foundries sell sub-designs as separate full-range VFs. A looser definition would raise the precedent count from 22 to 37.
- **How do clamped files behave in desktop apps?** macOS CoreText lists exactly the named styles in range. Word on Windows, InDesign and Figma still need testing.
- **Does a range VF add revenue or cannibalise families?** No foundry publishes this. A pilot with one foundry, offering the clamped VF as an add-on, would answer it.
- **What about non-adjacent purchases?** Light and Black span the whole weight axis. Foundries can sell such pairs as statics only, or price the span.

## Method

**Survey.** The full list of 394 foundries was extracted from typefoundry.directory in October 2026. Each foundry was screened for variable fonts, and every seller's buy pages, licences and store data (including public store APIs such as Fontdue GraphQL and Shopify product JSON) were read and classified. A second, adversarial pass re-checked every category; 27 classifications changed. A "subfamily VF" must drop, pin or narrow an axis of a larger variable font in the same family and be obtainable without the complete family.

**Benchmark.** Inter 4 (vf-clamp's test fixture, \`wght\` 100–900 and \`opsz\` 14–32) and Merriweather (the Type Tools display face, \`wght\` 300–900, \`wdth\` 87–112, \`opsz\` 7–144) were instanced with fontTools 4.63. Static sizes are full instances at each named instance's coordinates; clamped sizes restrict \`wght\` to the purchased span with other axes either pinned or kept. All files are WOFF2. Statics were generated with the instancer, not taken from foundry releases, so they are unhinted. The Latin check subset each file to Google Fonts' latin unicode range before instancing.

**Google Fonts.** CSS2 API requests for Inter at three weight ranges, with and without \`opsz\` and \`text=\`, were made with a Chrome 140 user agent on 4 October 2026; each returned file's \`fvar\` table was read with fontTools.

**Licences.** 35 EULAs from the subfamily-VF sellers and major foundries and distributors were read in full and coded for variable-font clauses, the licensed unit, instance generation and modification rights.

**Quotes.** TypeDrawers quotes were taken from the thread pages themselves, with poster and date.

## Sources

**Debate**

- Johannes Neumeier, [Is the future of Variable Fonts stuck in the licensing past?](https://underscoretype.com/articles/2018/07/05/is-the-future-of-variable-fonts-stuck-in-the-licensing-past), Underscore, 2018
- TypeDrawers: [Variable Font UI and Licensing](https://typedrawers.com/discussion/1813/variable-font-ui-and-licensing) (2016) · [The Current State of Variable Fonts](https://typedrawers.com/discussion/2976/the-current-state-of-variable-fonts-end-of-2018) (2018) · [Why don't we hear about more use of variable fonts on the Web?](https://typedrawers.com/discussion/4252/) (2021) · [Variable fonts](https://typedrawers.com/discussion/4329/variable-fonts) (2022) · [Fonttools "Level 4" instancing](https://typedrawers.com/discussion/4579/fonttools-level-4-variable-font-instancing-opens-up-new-retail-option) (2022) · [Are customers buying or using variable fonts?](https://typedrawers.com/discussion/4647/are-customers-buying-or-using-variable-fonts) (2022)
- Nick Sherman, [Variable Fonts for Responsive Design](https://alistapart.com/blog/post/variable-fonts-for-responsive-design/), A List Apart, 2015
- Tim Brown, [Variable fonts, a new kind of font for flexible design](https://blog.typekit.com/2016/09/14/variable-fonts-a-new-kind-of-font-for-flexible-design/), Typekit, 2016
- Matthew Butterick, [The Scorpion Express](https://practicaltypography.com/the-scorpion-express.html), Practical Typography, 2016–2022
- Jason Pamental, [What the web wants](https://rwt.io/typography-tips/what-the-web-wants/), RWT.io, 2019
- ATypI: [Mickel and Imas, Adidas variable fonts](https://atypi.org/presentation/adidas-variable-fonts/) (2018) · [Schwarz, The font business is broken](https://atypi.org/presentation/the-font-business-is-broken-can-we-fix-it/) (2023) · [Yin, Towards Infinite Styles](https://atypi.org/presentation/towards-infinite-styles-do-we-even-need-fonts/) (2025)
- Thomas Phinney, [Variable Font UI is Broken](https://www.thomasphinney.com/2026/07/variable-font-ui-is-broken/), 2026

**Adoption and the web**

- HTTP Archive Web Almanac, Fonts [2025](https://almanac.httparchive.org/en/2025/fonts) and [2022](https://almanac.httparchive.org/en/2022/fonts)
- [font-optical-sizing](https://developer.mozilla.org/en-US/docs/Web/CSS/font-optical-sizing), MDN · Adam Argyle, [Adapting typography to user preferences](https://web.dev/articles/adapting-typography-to-user-preferences-with-css), web.dev
- [Google Fonts CSS2 API](https://developers.google.com/fonts/docs/css2) · [Fontsource variable fonts](https://fontsource.org/docs/getting-started/variable)

**Technique**

- [fontTools varLib.instancer](https://fonttools.readthedocs.io/en/latest/varLib/instancer.html) · [Slice](https://github.com/source-foundry/Slice) · [Font Gauntlet](https://fontgauntlet.com/)
- W3C [Incremental Font Transfer](https://www.w3.org/TR/IFT/) · [CSS Fonts 4](https://www.w3.org/TR/css-fonts-4/) · FontLab, [TransType 5](https://blog.fontlab.com/2026/09/02/transtype-5/)
- [vf-clamp](https://vfclamp.com) · [GitHub](https://github.com/over-punch/vf-clamp) (the authors' tool)

**Survey and licences**

- [Type Foundry Directory](https://typefoundry.directory/) · [our survey data](/talk/data)
- María Ramos and Ana Moliz, [Font Licensing Mess](https://fontlicensingmess.com/) ([Alphabettes, 2025](https://www.alphabettes.org/font-licensing-mess-2/)) · Tiro Typeworks, [Something like a typeface](https://www.tiro.com/articles/something-like-a-typeface), 2025
- [Fontdue: variable fonts](https://www.fontdue.com/docs/platform/variable-fonts) · [Fontdue watermarks](https://www.fontdue.com/docs/platform/watermark-lookup)
- EULAs: [NaN](https://www.nan.xyz/eula/) · [BAL Foundry](https://www.bal-foundry.com/eula) · [Displaay](https://displaay.net/help/licenses) · [Dalton Maag](https://www.daltonmaag.com/download/dama/LicenceAgreement.pdf) · [Commercial Type](https://commercialtype.com/eula) · [Production Type](https://help.productiontype.com/docs/EULA/) · [DJR](https://djr.com/license) · [Tiro](https://www.tiro.com/license/general-license-agreement) (35 read in total)
`
