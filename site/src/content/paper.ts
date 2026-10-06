// Public text of the paper "Sell the Styles, Ship the Space" (markdown subset rendered by components/talk/Prose.tsx).

/** Paper body in markdown. {{figure:name}} lines are replaced by figures on the page. */
export const PAPER_MD = `
Designers buy type as named styles. Foundries build it as design spaces. Today a variable font is sold as a whole product, every weight of every axis, so someone who needs two or four weights rarely buys one. This paper argues for keeping the styles and shipping the space: deliver a variable font clamped to the range a customer bought, alongside the static files.

*Disclosure: the authors make [vf-clamp](https://vfclamp.com) and other variable-font tools, have built websites for type foundries for over fifteen years, and are building [Typetin](https://typetin.com), a storefront platform for independent foundries (not yet launched). A storefront that clamps fonts at checkout is the kind of product we'd benefit from. Every size measurement here uses plain fontTools, and no recommendation requires our tools.*

## Summary

The web has adopted variable fonts: 41% of mobile pages used one in 2025, up from 33% in 2024. But commercial variable fonts sell slowly, and most customers buy one to six styles.

We surveyed all 394 foundries in the [Type Foundry Directory](https://typefoundry.directory/). 213 sell variable fonts and could be classified. 94 of them (44%) sell a variable font only with the complete family; 119 sell one on its own, usually the whole design space at a price close to the family's. 22 sell a smaller variable font, and every one is a complete, foundry-defined subfamily, such as one width or one optical size. **None of the 213 publicly sells a variable font scoped to the styles a customer bought.** MyFonts requires a variable font to be included in the complete family pack, or sold as a separate family of its own; either way it's a whole product. Nick Sherman proposed range-priced licences in 2015, and type designers have asked for the delivery step on TypeDrawers since.

The technique is fontTools' range instancing, plus checks on the font's names, style bits and STAT table. A variable font clamped to the weights bought is smaller than the static files from two adjacent styles on: 28% smaller for Inter at two weights, 62% at four and 72% at seven, and 27% smaller at two on a Latin web subset.

Whether customers would pay for this is untested. Nobody publishes how many styles people buy per order, and the paper's case rests on the gap in supply, not on measured demand. A pilot with one foundry would settle it (see *Open questions*).

## The problem: variable came to mean whole family

The full-family default comes from what a variable font file contains, not from what customers need. In 2018 Johannes Neumeier of Underscore set out the bind: *"By their very nature, Variable fonts include all styles, so from a type foundry's perspective that is licensing those fonts, the price point should follow that of the entire family"* ([Underscore, 2018](https://underscoretype.com/articles/2018/07/05/is-the-future-of-variable-fonts-stuck-in-the-licensing-past)).

Distributors build it in. Monotype's foundry guide: "All families on MyFonts are required to have a complete family pack, so please note that your variable fonts will be included in the complete family pack." The alternative it offers is to "sell your variable fonts in a separate family by themselves" ([Monotype Foundry Support](https://foundrysupport.monotype.com/hc/en-us/articles/360038548331-Variable-Fonts), updated September 2023, read via the Internet Archive). The same page reports that in a 2019 survey "39% of respondents" were "unaware of variable fonts", and calls them "a new technology that hasn't yet seen a pickup in customer demand".

The result is that variable fonts are made but rarely licensed. Kris Sowersby of Klim: "We've had maybe 4 requests for VF since it launched. … About half our sales are for singles/pairs. … VF have to be priced as full family, because that's what they are" ([TypeDrawers, 2021](https://typedrawers.com/discussion/4252/)). Type Network's Christopher Slye said variables "are not exactly burning up the charts yet" ([TypeDrawers, 2022](https://typedrawers.com/discussion/4647/are-customers-buying-or-using-variable-fonts)).

Mark Simonson explains why with his own numbers: "Only a tiny percent of customers purchase an entire static family. … The bulk of my customers purchase 1-6 styles from the 48 available." Matthew Butterick reports a type designer's server logs: of his webfont customers, "almost all of them used only one or two" styles of a family ([Practical Typography](https://practicaltypography.com/the-scorpion-express.html)). Jason Pamental acknowledged "frustration about lack of sales" for variable fonts sold "in many cases, only with the purchase of a full family" ([RWT.io, 2019](https://rwt.io/typography-tips/what-the-web-wants/)). In 2022 Simonson priced Proxima Vara by its axes, at $99 against $744 for the 48-style Proxima Nova (today $199.99 against $975.99 for an 80-style superfamily), and warned that variable fonts will not "catch on if they are only available at a full static family price" ([TypeDrawers, 2022](https://typedrawers.com/discussion/4329/variable-fonts)).

## Styles and spaces

The deeper mismatch is conceptual. Type designers build a family as a design space between masters; customers think of it as a list of named styles. Nick Shinn: "Dispensing with the concept of naming the two most basic weights Regular and Bold seems impossible." John Hudson describes named instances as "navigation signposts or like pins on a map" in a space people find "difficult to mentally conceptualise" ([TypeDrawers, 2023](https://typedrawers.com/discussion/4647/are-customers-buying-or-using-variable-fonts/p2)). Designers told Jeff Peters "they don't want to drag sliders when setting type, they want pre-made weights" ([TypeDrawers, 2022](https://typedrawers.com/discussion/4329/variable-fonts)).

We've been here before. Adobe's Multiple Master fonts (1991–1998) shipped a design space too. Thomas Phinney, then at Adobe: "Actually, the MM *fonts* sold well, but our research showed that most users only used the default instances and never made custom instances. For them, we would have made their lives easier if we sold them separate fonts with nice clear names" ([Typophile, 2003](https://github.com/06b/typophile.github.io), thread 1514). Adam Twardoch in 2006 described the same bind this paper starts from: "Users will be less likely to pay $200 for just one font even if it contained an unlimited number of styles … The monster fonts would only allow you to do 'all or nothing', or you'd have to produce different subsets of fonts" (thread 29648).

So customers shouldn't have to learn sliders. They keep buying named styles; the file covers the space between the ones they bought, with the named instances still listed as signposts. Selling four adjacent weights as one file, Regular to Bold, needs no new pricing at all. Selling a gap, such as Regular and Bold without Medium and SemiBold, does: either deliver two files, or price the weights in between.

## The web chose variable

{{figure:adoption}}

The share of mobile pages using a variable font rose from 11% in 2020 to 41% in 2025; desktop reached 39.4% ([Web Almanac 2025](https://almanac.httparchive.org/en/2025/fonts), [2022](https://almanac.httparchive.org/en/2022/fonts)). The 2024 chapter put it at "about 33% of websites" ([2024](https://almanac.httparchive.org/en/2024/fonts)). But the growth is driven by free fonts: Noto Sans JP, Roboto, Open Sans and Montserrat make up almost 60% of all variable font requests. Supply on the paid side is thin: variable fonts are 28% of the Google Fonts library but only 7% of Adobe Fonts ([Phinney, 2026](https://www.thomasphinney.com/2026/07/variable-font-ui-is-broken/)). This shows the format is used where price is no barrier; it does not show that customers will pay for it. That question is open (see *Open questions*).

## What static buyers lose

- **Automatic optical sizing.** Browsers apply the \`opsz\` axis by default, matched to the rendered size, in every major browser since 2020 ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/font-optical-sizing)). Static cuts can't.
- **Adapting to the reader.** A grade or weight axis lets text respond to dark mode and contrast preferences ([Argyle, web.dev](https://web.dev/articles/adapting-typography-to-user-preferences-with-css)).
- **In-between values.** Weight can ease between breakpoints instead of jumping from file to file.
- **Whole techniques.** In the Overpunch type tools, three tools do nothing without a variable font ([axisRhythm](https://axisrhythm.com), [hoverBoldly](https://hoverboldly.com), [magnetType](https://magnettype.com)) and five more lose their main effect. hoverBoldly's bold-on-hover shifts the line by 5.8px with static fonts and 0.0px with a variable one.

None of this needs the whole family. Each works inside a narrow range such as Regular to Bold.

## File size: the crossover

The usual objection is that a couple of static files are smaller than one variable font. Against the *full* variable font that's often true; Alex Visi put it as "many variable fonts are bigger than the size of those two files" ([TypeDrawers, 2021](https://typedrawers.com/discussion/4252/)). Against a *clamped* one it isn't.

{{figure:crossover}}

We measured Inter 4 and Merriweather in WOFF2, comparing the total size of static instances with a variable font clamped to the same weights, other axes pinned like the statics (method below). Purchases are adjacent weights from Regular upward, so no unbought style falls inside the range.

| Purchase | Font | Static files | Clamped VF | Full VF |
| --- | --- | --- | --- | --- |
| Regular + Medium | Inter 4 | 226 KB | **162 KB** (−28%) | 345 KB |
| Regular to Bold (4) | Inter 4 | 456 KB | **173 KB** (−62%) | 345 KB |
| Light to Black (7) | Inter 4 | 797 KB | **225 KB** (−72%) | 345 KB |
| Regular + Medium | Merriweather | 161 KB | **124 KB** (−23%) | 510 KB |
| Regular to Bold (4) | Merriweather | 322 KB | **131 KB** (−59%) | 510 KB |

The crossover comes at two adjacent styles. Against the *full* variable font, two things shrink the file, and they're about equal: for Inter Regular to Bold, pinning optical size alone takes 345 KB to 235 KB, clamping weight alone takes it to 250 KB, and both together give 173 KB. Google Fonts already pins whole axes on request; narrowing a range is the part nobody serves.

Keeping a free axis costs something. Inter with optical size kept is 250 KB for Regular to Bold, still smaller than the four statics; keeping Merriweather's width as well brings it back to 495 KB. So the rule is: **pin the axes the customer didn't license, and keep the ones that add value for free.** Web fonts are usually subset, so we repeated the test on Google Fonts' Latin range: two adjacent styles are 27% smaller as one clamped file (64.0 KB against 46.9 KB), and four are 61% smaller. A second check on five Fontsource families (Inter, Roboto, Open Sans, Montserrat and Source Sans 3, Latin subsets) found the same pattern: a variable font clamped to Regular–Bold was 0.4–0.5 times the size of the four equivalent static files.

Two cautions. Our statics are unhinted instances, not foundry releases, which may carry hinting and be larger. And a non-adjacent purchase, Regular and Bold alone, only gets one smaller file if the foundry also delivers Medium and SemiBold (173 KB against 226 KB for the two statics); delivered as two pinned files, it's the same size as the statics.

## What a two-style buyer pays

The median price of a single text style across 171 independent foundries in 44 countries is about €50 for a desktop licence and the same for web ([Font Licensing Mess, 2025](https://fontlicensingmess.com/licenses/desktop/)). Family discounts are steep: 44% off for a 16-style Proxima Nova family and 69% off for the 80-style superfamily ([Mark Simonson Studio](https://www.marksimonson.com/fonts/view/proxima-nova)). A variable font, though, is sold as a bundle: the cheapest route always includes every weight of at least one axis.

| Offer, list prices October 2026 | Two single styles | Cheapest variable font | What it includes |
| --- | --- | --- | --- |
| [Aktiv Grotesk, Dalton Maag](https://www.daltonmaag.com/font-library/aktiv-grotesk.html) | £64 | £95 | weight axis, with 9 matching statics |
| Aktiv Grotesk, two axes | £64 | £190 | weight and one more axis |
| Aktiv Grotesk, full design space | £64 | £380 | 3 axes, 54 styles |
| [Proxima Vara, Mark Simonson](https://www.marksimonson.com/fonts/view/proxima-vara) | $79.98 | $199.99 | full design space |

For someone who needs two styles, the variable font costs 1.5 to 2.5 times as much as the two singles. For someone who needs four or more, the bundle can be the better deal. Either way the variable font comes as a fixed product, not as the styles bought. Per-axis pricing already exists: Simonson bases his price "on the number of axes", Dalton Maag doubles the price with each axis, and Tiro adds "a charge for each variable design axis implemented in the font" ([Tiro, 2025](https://www.tiro.com/articles/something-like-a-typeface)). But all of them still sell the whole range of each axis; none sells a region of it. No distributor publishes how many styles customers buy per order; Peter Constable's 2022 question, "How many buy entire families versus a limited number of styles?", is still unanswered with data ([TypeDrawers](https://typedrawers.com/discussion/4329/variable-fonts)).

## Market survey: every foundry in the directory

{{figure:funnel}}

We checked all 394 foundries in the Type Foundry Directory against their buy pages, licences and store data, then ran a second pass that tried to overturn every classification; 27 changed.

| Group | Foundries |
| --- | --- |
| Directory foundries | 394 |
| Screened out: no variable fonts found | 149 |
| Sell variable fonts or couldn't be settled | 245 |
| Couldn't be settled from public pages | 32 |
| **Classified variable-font sellers** | **213** |
| Sell a VF only with the complete family | 94 |
| Sell a VF without the complete family | 119 |
| …of which a smaller, subfamily VF | 22 |
| …of which a VF scoped to the styles bought | 0 |

Most of the 119 sell a standalone variable font covering the full design space. Where the price could be compared with the complete family (104 of them), the variable font cost less at 71, the same at 24 and more at 9. Every row, with its evidence link, is in the [survey data](/paper/data). The survey covers directory foundries only; distributors such as MyFonts, Fontspring and Adobe Fonts, and anything sold on request by email, are outside it.

## Precedent: 22 foundries sell subfamily variable fonts

22 foundries already sell a smaller variable font without requiring the complete family. Each covers one complete subfamily, such as one width, one optical size, one posture or one corner style, across that subfamily's full range. The slice usually costs about a third of the complete family (range 19–67%).

| Foundry | How the variable font is cut | Slice vs complete family |
| --- | --- | --- |
| [BAL Foundry](https://www.bal-foundry.com/typefaces/thunder-collection) | Thunder: one VF per optical size | €400 vs €600 |
| [CJ Type](https://sites.fastspring.com/cjtype/product/pennypackerwidefamily) | Pennypacker: one VF per width | $337.50 vs $1,600 |
| [CSTM](https://type.today/en/journal/normalidad) | Normalidad: 11 single-axis partial VFs | $200 vs $1,000 |
| [Dalton Maag](https://www.daltonmaag.com/font-library/aktiv-grotesk.html) | Aktiv Grotesk: sold by number of axes | £95 vs £380 |
| [Dinamo](https://abcdinamo.com/buy/diatype) | Diatype: one VF per width | €504 vs €1,224 |
| [DJR](https://djr.com/roslindale) | Roslindale: Display series with a VF, optical size dropped | $150 vs $200 |
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
| [Smuss Type Kiosk](https://typekiosk.smuss.studio/buy?font=bureau-sans) | Bureau Sans: one VF per width | 600 vs 1,500 (currency not recorded) |
| [Socio Type](https://socio-type.com/faq) | Gestura: one VF per optical size | £350 vs £1,050 (not re-verified) |
| [Studio Feixen Fonts](https://fonts.studiofeixen.ch/store) | Ease: one VF per subfamily | 375 vs 1,200 (currency not recorded) |
| [Typotheque](https://www.typotheque.com/help) | Greta Sans: weight-only VF per width | not verified |

None narrows a range inside a subfamily. BAL's Thunder Text VF is limited to weights 400–700, but so is the full Thunder collection. NaN comes closest in policy: its EULA grants "a variable font covering the styles bought, when available", but only with a full family or sub-family licence, so single-style buyers get none. Another 15 foundries sell sub-designs such as upright and italic as separate full-range variable fonts; we don't count those as slices.

Adjacent practices cover some of the remaining pieces. Fontdue already builds a file per order: every delivered font "is watermarked with the ID of that order" ([Fontdue](https://www.fontdue.com/docs/platform/watermark-lookup)). Displaay's licence lets buyers of the variable option "modify the available axes of the variable Fonts to the extent and in ways permitted by the variable format of such Fonts", which reads as using the axes rather than re-cutting the file ([Displaay](https://displaay.net/help/licenses)). And the tools for cutting design sub-spaces exist: Source Foundry's [Slice](https://github.com/source-foundry/Slice) "generates fonts with custom design sub-spaces from variable font inputs", and Dinamo's [Font Gauntlet](https://fontgauntlet.com/) offers "Axis Clipping" and instance generation, with a switch that lets a host disable export.

## Asked for since 2015

The pricing idea is eleven years old. In January 2015, before OpenType variable fonts existed, Nick Sherman proposed it: "One potential solution might be to license ranges of stylistic variation. So it would cost less to license a limited weight range from Light to Medium (300–500) than a wide gamut from Thin to Black (100–900)" ([A List Apart, 2015](https://alistapart.com/blog/post/variable-fonts-for-responsive-design/)). At the format's launch in 2016, Typekit's Tim Brown wrote: "The hard part now will be licensing. Nobody knows yet how to handle the business aspects of variable fonts" ([Typekit, 2016](https://blog.typekit.com/2016/09/14/variable-fonts-a-new-kind-of-font-for-flexible-design/)). A reader asked under that post: "Will we have to pay the full 'font family' price for each 'variable font' regardless of how many variations of that font we actually need?"

The same year Andrew Johnson suggested "allowing people to pick what areas of that design space are finally licensed and downloaded / hosted", while Thomas Phinney warned of "an explosion of purchasing complexities and SKUs" ([TypeDrawers, 2016](https://typedrawers.com/discussion/1813/variable-font-ui-and-licensing)). John Hudson in 2018 proposed "a variable design space subsetting tool, that would enable customers to generate smaller variable fonts containing only the axes and deltas they need" ([TypeDrawers](https://typedrawers.com/discussion/2976/the-current-state-of-variable-fonts-end-of-2018)). Nick Shinn in 2022: "An app on the distributor site could do that, and generate the VF with only the weight instances requested" ([TypeDrawers](https://typedrawers.com/discussion/4252/)). When fontTools added range instancing, Dave Crossland called it "very good news" for anyone wanting "to offer sub-spaces of the full family design space for a discount of the full retail price" ([TypeDrawers](https://typedrawers.com/discussion/4579/fonttools-level-4-variable-font-instancing-opens-up-new-retail-option)). No one reports having built it. Sherman proposed range pricing. This paper adds the delivery step: a file whose design space stops at the licensed range, so the scope is visible in every app that opens it. (It's not protection: see *Engineering caveats*.)

## How it works

{{figure:pipeline}}

fontTools' instancer restricts an axis to a new minimum and maximum, for example \`wght=400:700\`, and returns a valid variable font covering only that range ([fontTools docs](https://fonttools.readthedocs.io/en/latest/varLib/instancer.html)). It's mature, but still changing: fontTools added partial instancing for avar version 2 fonts only in August 2026 (4.64), and still refuses to restrict axes that VARC components use (4.66). In our tests it also prunes the font's tables: clamped to 400–700, Inter keeps only the Regular, Medium, SemiBold and Bold named instances, and its STAT table drops Thin, Light, ExtraBold and Black while keeping the optical-size values. That is what keeps unbought styles out of application menus.

Clamping sells a range, not a set of styles: a Light-and-Bold purchase also delivers the weights in between. In licensing terms, today's static licence is a range of one point, and the range model includes it. As files they still differ: foundry statics may carry hinting and hand corrections that an instance does not.

No font service narrows ranges either. We tested the [Google Fonts CSS2 API](https://developers.google.com/fonts/docs/css2): Inter requested at \`wght@100..900\`, \`400..700\` or \`500..600\` returns the same file: a 48,432-byte Latin subset whose weight axis still runs 100–900 (tested 4 October 2026 with a Chrome 140 user agent). Adding \`opsz\` or \`text=\` changes the subset, never the range. Google and [Fontsource](https://fontsource.org/docs/getting-started/variable) drop or pin whole axes on the fly; neither narrows a range. [vf-clamp](https://vfclamp.com) is one implementation of the full pipeline, as an npm package, CLI, REST API and plugins for Glyphs, RoboFont and VS Code. Reviewing this paper, a font engineer found bugs in it: it removed STAT axes that aren't in \`fvar\` (Inter's \`ital\`), left the source font's PostScript names on the named instances, set contradictory style bits on italic files, and its \`strict\` check missed axes-only requests. All are fixed, with tests, in version 2.3.0.

## Licensing language

Most licences cannot yet express a range. We read 35 foundry and distributor EULAs in October 2026: 27 never mention variable fonts at all, including 15 of the 20 subfamily-VF sellers whose licences we could read, and four mention them only as a file format. Most define the licence as a set of files, so their blanket bans on modification technically forbid a customer from clamping or subsetting a file further. Commercial Type forbids "creating additional weights", though its clause opens with an exception for subsetting web fonts; Production Type forbids "the creation of additional weights, styles, or variations". Others already point the way:

- **BAL Foundry** grants and fences in one clause: "For Variable Font formats, the use and generation of instances within the permitted licensed scope is allowed. However, extraction or reconstruction of axis data, modification of the variation space or interpolation models … is strictly prohibited" ([BAL EULA](https://www.bal-foundry.com/eula)).
- **Displaay** ties axis rights to the invoice: buyers of the "Variable" option "are allowed to modify the available axes of the variable Fonts" ([Displaay](https://displaay.net/help/licenses)).
- **NaN** states the commercial idea plainly: "a variable font covering the styles bought" ([NaN EULA](https://www.nan.xyz/eula)).
- **Dalton Maag** keeps derived files inside the licence: "Font Software includes all subsets or transformations derived from the Font Software" ([Dalton Maag licence](https://www.daltonmaag.com/download/dama/LicenceAgreement.pdf)).

A range licence needs four parts, and the delivered file can carry the scope, since invoices list style names, not ranges:

- **Scope:** the axis ranges recorded in the variable font delivered under the order, spanning the named styles on the invoice.
- **Grant:** use and generation of any instance inside that scope, under the order's existing user, pageview or app limits.
- **Optimisation right:** subsetting, format conversion, pinning or further narrowing, with derived files under the same licence.
- **Fence:** no widening, extrapolating or reconstructing the variation space beyond the scope, by any means, including combining files from separate orders. An upgrade to a wider range replaces the earlier file and licence.

BAL's clause, the closest model, also bans "modification of the variation space", which would forbid narrowing for performance; the optimisation right should say otherwise. Two commercial questions sit outside the licence. Royalties: a foundry that pays designers per style needs a rule for the weights inside a range. And naming: a file named for its range (vf-clamp names it "Inter Regular-Bold") changes family name when an upgrade widens it, which breaks existing documents, so a foundry may prefer one stable name such as "Inter VF".

## Delivery and app support

**In applications.** Apps fall into two groups. Adobe Illustrator, Photoshop and InDesign, Figma, Affinity, Sketch and CorelDRAW let users choose any in-between value; Microsoft Word, PowerPoint, Apple Keynote and Pages "show only the styles the foundry chose to name" ([FontLab, 2026](https://blog.fontlab.com/2026/09/02/transtype-5/)). Windows exposes named instances only, projected through the STAT table ([Microsoft](https://learn.microsoft.com/en-us/windows/win32/directwrite/opentype-variable-fonts)). For a range licence both groups behave well: a file clamped to Regular–Bold lists only the named styles inside the range. We checked with macOS CoreText, the text system behind Pages and Keynote: full Inter lists nine weights, while Inter clamped to Regular–Bold lists Regular, Medium, SemiBold and Bold, with a 400–700 weight axis. We haven't yet tested InDesign, Figma or Word. Slider interfaces themselves remain rough ([Phinney, 2026](https://www.thomasphinney.com/2026/07/variable-font-ui-is-broken/)), which is one more reason to ship the statics alongside.

**On the web.** CSS already treats a clamped file correctly: variation values are "clamped to the value of the font-weight, font-width, and font-style descriptors in that @font-face rule" and then "clamped (possibly again) to the values that are supported by the font" ([CSS Fonts 4](https://www.w3.org/TR/css-fonts-4/)), so \`font-weight: 900\` on a Regular–Bold file renders at Bold rather than failing, provided \`@font-face\` declares \`font-weight: 400 700\`; without that descriptor browsers may synthesise a fake bold. The W3C's Incremental Font Transfer standard, a Candidate Recommendation Draft since November 2025, can segment "design-variation space" into partial axis ranges ([IFT](https://www.w3.org/TR/IFT/)), but no browser ships it yet ([Chrome Status](https://chromestatus.com/feature/5135917565214720)), and it is a transfer mechanism, not a licence boundary.

**Engineering caveats.** Clamping is reliable but not free of edge cases. If the purchased range excludes the font's default instance, the default must move and the name table must be rewritten so the font isn't still called "Thin". When the default sits at an axis end, as in Montserrat (default Thin), the saving over the full VF almost disappears: Montserrat clamped to 400–700 is 6% smaller than the full font. When it doesn't, the saving holds: Inter clamped to 600–700 is 32% smaller. A purchase of Regular and Bold delivers Medium and SemiBold as named instances too, because a range is continuous. vf-clamp's \`planOutputs()\` (used by its demo) avoids this: it merges styles into one file only when no unbought named style falls between them, so Regular and Bold alone come back as two files, while Regular, Medium, SemiBold and Bold come back as one. \`clampFont()\` on its own builds whatever range it's given unless \`strict\` is set. Foundries can choose either policy. Partial instancing of the newest formats (avar2, VARC) arrived in fontTools only in 2026 ([release notes](https://github.com/fonttools/fonttools/releases)). A delivery pipeline should validate names and STAT after every clamp, and add a per-order identifier if tracing matters: vf-clamp rewrites the unique ID (name ID 3) from the output name, so every buyer of the same range gets the same ID. Clamping limits what a file contains, not what can be computed. In our test, scaling the deltas of Inter clamped to 400–700 reproduced Black to within about 2 font units across 2,926 glyphs, because the range sat inside one master segment. So a clamped file isn't protection: it makes the scope clear, the licence's fence does the enforcing, and a per-order watermark helps if tracing matters. Speed is not a constraint: fontTools clamps and saves Inter in 2–3 seconds; vf-clamp, running fontTools in WebAssembly, takes 5–8 seconds per file. A family has few possible ranges, so files can be cached.

## Objections, answered

The strongest objections come from TypeDrawers itself.

| Objection | Answer |
| --- | --- |
| "slicing up variable fonts as a regular part of business would make the retail aspects much more complicated" (Phinney, 2016) | The clamp is one fontTools call plus name and style checks, a few seconds per file, and files can be cached. Customers still pick named styles. Pricing the weights in between is the harder decision (see *Open questions*). |
| Sellers of slices "will, before long, be undercut by someone who selling the whole thing as a unit" (Kosofsky, 2016) | Sell both: the range now, the full space as the upgrade. 22 foundries already sell subfamily VFs alongside families. |
| Cheap VFs will "erode the price of buying a complete family" (Shinn, 2022) | Phinney's reply: "is that a problem, and if so, why?" Whether partial buyers would otherwise buy the family is untested; 22 foundries already take that risk with subfamily VFs. |
| File-size benefits hold "only sometimes" (Visi, 2021) | True for a full VF. Clamped, the VF wins from two adjacent styles. |
| Between two masters there are infinite weights, so a range is worth more | Customers pay for styles they can name; Adobe found the same with Multiple Masters. A premium makes sense. The full-family price doesn't. |
| Desktop apps handle variable fonts badly | True today. Ship the VF alongside the statics, not instead of them. |
| "I see no evidence that variable fonts are something my customers want" (Butterick) | Fair evidence, and Monotype reports the same. The web adopted variable fonts where they were free: 41% of mobile pages. Whether bundle pricing hides paid demand is a hypothesis; a foundry pilot could test it. |
| A clamped file can be extrapolated past its range | True (see *Engineering caveats*). Clamping shows the scope; the licence and a per-order watermark do the rest. |

Sources: TypeDrawers threads [1813](https://typedrawers.com/discussion/1813/variable-font-ui-and-licensing), [4329](https://typedrawers.com/discussion/4329/variable-fonts) (Shinn, Phinney 2022) and [4252](https://typedrawers.com/discussion/4252/) (Visi); Butterick, [The Scorpion Express](https://practicaltypography.com/the-scorpion-express.html).

## Recommendations

**For foundries**

1. Keep selling styles. With every licence of two or more adjacent styles, ship a variable font clamped to the range bought, alongside the statics, and say in the order email what the file is.
2. Pin the axes the customer did not license; keep free ones such as \`opsz\` and \`GRAD\`. Pinning removes an axis entirely.
3. Make upgrades widen the range. A customer who adds Black receives a wider file, not an extra one; keep the family name stable so documents survive the swap.
4. Publish the axes and ranges of every variable font you sell, and list variable fonts as products rather than delivering them on request.

**For storefronts**

5. Add a clamp step at fulfilment, and run one pilot: offer the clamped file as a paid add-on on one family for six months, and compare full-family upgrades with a control family. Fontdue already generates a file per order; today variable fonts exist only as fixed, pre-cut products ([Fontdue](https://www.fontdue.com/docs/platform/variable-fonts)).

**For licence authors**

6. Define a variable-font licence by design space, in four parts: scope on the invoice, a grant for instances inside it, a right to optimise, and a fence against widening (see *Licensing language*). 27 of the 35 licences we read, a sample weighted towards VF sellers, never mention variable fonts.
7. Say explicitly that customers may subset or clamp a font further for performance. Blanket bans on modification currently forbid it by accident.

## Open questions

- **How should a range be priced?** By styles in the range, by axes, or a premium over the statics. Simonson, Dalton Maag and Tiro price by axes; Johannes Neumeier suggested a web VF priced at the base style times "a common number of styles in use on a website", "let's say ~4" ([TypeDrawers](https://typedrawers.com/discussion/4252/p4)). A foundry owner reviewing this paper suggested the named styles the range spans plus a variable-font uplift.
- **Is usage-based pricing the better model?** Yehang Yin proposes "infinite style variations with a more reasonable usage-based pricing model" ([ATypI 2025](https://atypi.org/presentation/towards-infinite-styles-do-we-even-need-fonts/)). A range licence keeps today's style-based purchase; usage pricing replaces it.
- **What remains unclassified?** 32 foundries could not be settled from public pages, and the 149 screened out were not re-checked in the second pass.
- **Should upright/italic splits count?** 15 foundries sell sub-designs as separate full-range VFs. A looser definition would raise the precedent count from 22 to 37.
- **How do clamped files behave in desktop apps?** macOS CoreText lists exactly the named styles in range. Word, InDesign and Figma still need testing.
- **Does a range VF add revenue or cannibalise families?** No foundry publishes this. A pilot with one foundry, offering the clamped VF as an add-on, would answer it.
- **What about non-adjacent purchases?** Light and Black span the whole weight axis. Foundries can sell such pairs as statics only, or price the span.

## Method

**Survey.** The full list of 394 foundries was extracted from typefoundry.directory in October 2026. Each foundry was screened for variable fonts, and every seller's buy pages, licences and store data (including public store APIs such as Fontdue GraphQL and Shopify product JSON) were read and classified. A second, adversarial pass re-checked every category; 27 classifications changed. A "subfamily VF" must drop, pin or narrow an axis of a larger variable font in the same family and be obtainable without the complete family.

**Benchmark.** Inter 4 (vf-clamp's test fixture, \`wght\` 100–900 and \`opsz\` 14–32) and Merriweather (the Type Tools display face, \`wght\` 300–900, \`wdth\` 87–112, \`opsz\` 7–144) were instanced with fontTools 4.63; a re-run on 5 October 2026 matched the first run to within 0.3%. Static sizes are full instances at each named instance's coordinates; clamped sizes restrict \`wght\` to the purchased span with other axes either pinned or kept. All files are WOFF2. Statics were generated with the instancer, not taken from foundry releases, so they are unhinted. The Latin check subset each file to Google Fonts' latin unicode range before instancing.

**Google Fonts.** CSS2 API requests for Inter at three weight ranges, with and without \`opsz\` and \`text=\`, were made with a Chrome 140 user agent on 4 October 2026; each returned file's \`fvar\` table was read with fontTools.

**Licences.** 35 EULAs from the subfamily-VF sellers and major foundries and distributors were read in full and coded for variable-font clauses, the licensed unit, instance generation and modification rights.

**Quotes.** TypeDrawers quotes were taken from the thread pages themselves, with poster and date. Every quotation was re-checked against its source on 5 October 2026 (49 quotes: 45 exact; the rest corrected in this version).

**Tool review.** The published vf-clamp 2.2.0 was run on Inter for each purchase in the benchmark, and a font engineer tried to break it with edge cases (default outside the range, avar, italic files, non-ASCII names, duplicate instance names, \`strict\` bypasses). The bugs found are fixed in 2.3.0.

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
- Typophile archive, 2016 reconstruction ([06b/typophile.github.io](https://github.com/06b/typophile.github.io)): Phinney on Multiple Master sales (thread 1514, 2003), Twardoch on all-or-nothing fonts (29648, 2006)
- Tamye Riggs, [The Adobe Originals Silver Anniversary Story](https://blog.typekit.com/2014/07/30/the-adobe-originals-silver-anniversary-story-how-the-originals-endured-in-an-ever-changing-industry/), Typekit, 2014
- Monotype Foundry Support, [Variable Fonts](https://foundrysupport.monotype.com/hc/en-us/articles/360038548331-Variable-Fonts), updated 2023 (archived copy, August 2025)

**Adoption and the web**

- HTTP Archive Web Almanac, Fonts [2025](https://almanac.httparchive.org/en/2025/fonts), [2024](https://almanac.httparchive.org/en/2024/fonts) and [2022](https://almanac.httparchive.org/en/2022/fonts)
- [font-optical-sizing](https://developer.mozilla.org/en-US/docs/Web/CSS/font-optical-sizing), MDN · Adam Argyle, [Adapting typography to user preferences](https://web.dev/articles/adapting-typography-to-user-preferences-with-css), web.dev
- [Google Fonts CSS2 API](https://developers.google.com/fonts/docs/css2) · [Fontsource variable fonts](https://fontsource.org/docs/getting-started/variable)

**Technique**

- [fontTools varLib.instancer](https://fonttools.readthedocs.io/en/latest/varLib/instancer.html) · [Slice](https://github.com/source-foundry/Slice) · [Font Gauntlet](https://fontgauntlet.com/)
- W3C [Incremental Font Transfer](https://www.w3.org/TR/IFT/) · [CSS Fonts 4](https://www.w3.org/TR/css-fonts-4/) · FontLab, [TransType 5](https://blog.fontlab.com/2026/09/02/transtype-5/)
- [vf-clamp](https://vfclamp.com) · [GitHub](https://github.com/over-punch/vf-clamp) (the authors' tool)

**Survey and licences**

- [Type Foundry Directory](https://typefoundry.directory/) · [our survey data](/paper/data)
- María Ramos and Ana Moliz, [Font Licensing Mess](https://fontlicensingmess.com/) ([Alphabettes, 2025](https://www.alphabettes.org/font-licensing-mess-2/)) · Tiro Typeworks, [Something like a typeface](https://www.tiro.com/articles/something-like-a-typeface), 2025
- [Fontdue: variable fonts](https://www.fontdue.com/docs/platform/variable-fonts) · [Fontdue watermarks](https://www.fontdue.com/docs/platform/watermark-lookup)
- EULAs: [NaN](https://www.nan.xyz/eula/) · [BAL Foundry](https://www.bal-foundry.com/eula) · [Displaay](https://displaay.net/help/licenses) · [Dalton Maag](https://www.daltonmaag.com/download/dama/LicenceAgreement.pdf) · [Commercial Type](https://commercialtype.com/eula) · [Production Type](https://help.productiontype.com/docs/EULA/) · [DJR](https://djr.com/license) · [Tiro](https://www.tiro.com/license/general-license-agreement) (35 read in total)
`
