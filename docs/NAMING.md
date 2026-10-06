# vf-clamp naming and style rules

The single specification for what a clamped font's name table, style bits and STAT look like.

There is **one implementation**: [`shared/plugin-views/vfclamp_naming.py`](../shared/plugin-views/vfclamp_naming.py).
- The npm package runs it in Pyodide.
- The Glyphs and RoboFont plugins get byte-identical copies through `npm run sync-plugin-views`.

The only other code is `rangeName()` in `src/core/utils.ts`, a TypeScript twin of `range_name()` for the browser and the VS Code extension. Both are checked against [`shared/naming-cases.json`](../shared/naming-cases.json); regenerate that file with `scripts/gen-naming-cases.py`.

When implementations disagree, the [OpenType `name` spec](https://learn.microsoft.com/en-us/typography/opentype/spec/name) decides.

## Default output name

When no name is given, the name is the source family plus **one range per axis**, written in the font's own style words.

| Selection (Encode Sans) | Name |
|---|---|
| SemiCondensed Thin–Light + Thin–Light (wdth 87.5–100, wght 100–300) | Encode Sans SemiCondensed-Normal Thin-Light |
| SemiCondensed Thin–Light | Encode Sans SemiCondensed Thin-Light |
| Regular–Bold | Encode Sans Regular-Bold |
| SemiCondensed Regular + Regular | Encode Sans SemiCondensed-Normal Regular |

How it's built:
- **Words are assigned to axes.** Each word in the style names belongs to the one axis that stays constant wherever the word appears.
- **Each axis contributes a range or a single word.** An axis that varies in the selection becomes `low-high`. An axis that doesn't vary shows its word once, or nothing.
- **Values without a word get a label.** A value with no word (wdth 100 in "Light") takes its STAT name ("Normal"), else a default word, else `<tag><value>`.
- **Order follows the font.** Axes appear in the order the font's own names use.

## Name table

`F` is the output name, and a blank name is an error. `T` is the style: the picked instance for a single-style output, otherwise the instance at the new default location.

| ID | Value |
|---|---|
| 1 | `F`. For a **static** file with a non-RIBBI style, `F` plus that style, e.g. "Test Sans SemiBold" (the spec's "Arial Black" pattern). |
| 2 | The RIBBI style matching OS/2: Regular, Italic, Bold or Bold Italic. Never anything else. |
| 3 | `version;PostScriptName;F`. The same for every buyer of an output name; add a watermark if you need to trace orders. |
| 4 | `F` plus the style. "Regular" is left out, and so is a style `F` already ends with. A variable file uses the RIBBI style here. |
| 6 | The PostScript name: accents transliterated, `[A-Za-z0-9-]` only, at most 63 characters (a longer name ends in a hash). A static file includes its style, so two pins never collide. A name in another script becomes `Font-<hash>` and never the source's name. |
| 16, 17 | `F` and `T`. Written when the source has them, or when `T` is not RIBBI (e.g. SemiBold). |
| 25 | ASCII letters and digits only (spec), at most 27 characters (longer: 21 plus a hash). Written if the source has it. |
| Instances | Each named instance's PostScript name becomes `<nameID 25 prefix>-<style>` (Adobe TN #5902). |

Records are rewritten on every platform:
- Unicode (platform 0) and Windows (platform 3) records are written as UTF-16.
- Mac (platform 1) records are written as Mac Roman, and dropped if they can't be encoded. RoboFont drops all Mac records by design.
- Non-English records for the rewritten IDs are removed.

## Style bits

| Field | Rule |
|---|---|
| usWeightClass | `wght` at the clamped default, or the pinned value. |
| usWidthClass | Mapped from `wdth`. |
| BOLD | Weight 700 or more. A SemiBold default is not bold. |
| ITALIC / OBLIQUE | `ital` ≥ 0.5, or `slnt` < 0 (OBLIQUE as well when the slant comes without `ital`). If the source has neither axis, the source's own italic and oblique bits are kept. |
| REGULAR | Only when none of BOLD, ITALIC or OBLIQUE is set. |
| macStyle | Bold, and italic for italic or oblique. |

## STAT

- **Design-axis records are never removed.** STAT may describe axes outside `fvar`, such as Inter's `ital`, and upright/italic linking depends on them.
- **Values outside the range are dropped** (by fontTools).
- **A Format 3 value whose link points outside the range becomes Format 1:** same name, no link.

## Allowed differences between implementations

- **RoboFont omits Mac name records**, and bumps `head.fontRevision` by 0.001 (so nameID 3's version differs).
- **Glyphs removes the ticked range's unticked named instances from `fvar`.** npm and RoboFont keep every instance inside the range.
