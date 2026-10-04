# vf-clamp

[![npm](https://img.shields.io/npm/v/%40overpunch%2Fvf-clamp.svg)](https://www.npmjs.com/package/@overpunch/vf-clamp) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![part of liiift type-tools](https://img.shields.io/badge/liiift-type--tools-blueviolet)](https://github.com/over-punch/type-tools)

The delivery layer for per-purchase micro-VFs. Restrict a variable font's axis ranges to exactly the named instances a customer bought — like CSS `clamp()` for design space.

```
npm install @overpunch/vf-clamp
```

**[Interactive demo at vfclamp.com →](https://vfclamp.com)**

![Clamp to the styles a customer bought: a weight axis showing a full family's nine named instances (Thin–Black), and a clamped output that keeps only Light–Bold (wght 300–700) as a variable range while the variation outside the purchase is removed](https://raw.githubusercontent.com/over-punch/vf-clamp/main/assets/design-space.png?v=2)

**Choose your path**

| You are… | Start here |
|---|---|
| A type designer or foundry | [For type designers](#for-type-designers) — plugins for Glyphs and RoboFont, no code |
| Building a storefront's fulfilment step | [Selling named styles safely](#selling-named-styles-safely) and the [REST API](#rest-api) |
| A web developer trimming fonts | [Quickstart](#quickstart) |
| Curious why this matters | The talk and paper, [*Sell the Styles, Ship the Space*](https://vfclamp.com/talk/paper) |

---

## What it does

Takes a variable font (TTF, OTF, WOFF, or WOFF2) and produces one restricted variant per configured output. Each variant is a valid variable font whose axis ranges are restricted (variation data outside the range is dropped and the rest rescaled), whose named instances and STAT entries outside the range are removed, and whose name table is updated to reflect the restricted instance range. See [What it does to the font](#what-it-does-to-the-font) for the exact changes. No Python required — powered by [fonttools](https://github.com/fonttools/fonttools) compiled to WASM via [Pyodide](https://pyodide.org).

---

## For foundries

A variable font is usually all-or-nothing: customers buy the whole family to get one, or they buy statics and lose interpolation. A survey of 394 foundries found 22 that sell subfamily variable fonts and none that scope one to the styles a customer bought ([paper](https://vfclamp.com/talk/paper), [data](https://vfclamp.com/talk/data)). vf-clamp adds the tier in between — a variable font scoped to exactly the named instances a customer purchased, generated and delivered at checkout.

**Purchase → Clamp → Deliver.** A customer buys two or more adjacent styles ([`planOutputs`](#selling-named-styles-safely) splits any other selection so no unbought style is handed over); your store POSTs the order to the [REST API](#rest-api); a scoped VF comes back in seconds with its name table rewritten to the purchased range, in the format the licence calls for.

Why it matters:

- **A new revenue tier** — two adjacent styles become a variable purchase, not just two statics. Price a ladder: two-style VF → subfamily → full family.
- **Licence scope you can see** — a full VF exposes every weight, including ones the customer never paid for. A clamped VF's axes, named instances and STAT entries stop at the purchased range, so the file matches the invoice. (A determined user could still extrapolate simple two-master designs past the range; the licence's terms do the enforcing.)
- **Named for the purchase** — the name table (family, full name, PostScript name) is rewritten to the purchased range, so the file is identifiable as that range. It does not identify the order: the unique ID (name ID 3) is rewritten to `version;PostScriptName;family`, which is the same for every buyer of that range, so add a watermark or per-order ID at fulfilment if you need tracing.
- **Lighter files for the web** — a site that uses only Medium–Black shouldn't ship Thin–Light deadweight. Clamping drops the variation data outside the licensed range: variation across what they bought, at a smaller download — from two styles up, smaller than the statics themselves (see below).
- **Sell bespoke cuts** — pin an axis to a coordinate that was never a named instance (a custom optical size or width) and sell that exact cut, without shipping it in the retail family.
- **Ready for `opsz` demand** — browsers drive the optical-size axis automatically via `font-optical-sizing: auto`, keyed off the rendered point size. Delivering `opsz` clamped to a usable range keeps files small as that axis matters more.

The npm package, CLI, and editor plugins all share the same axis-constraint model, so the same delivery logic runs in your build pipeline, your storefront, or a designer's font editor.

**Real numbers** — Inter (wght 100–900) clamped to a Text weight range (400–700), same WOFF2 format so the delta is pure clamping:

| Font | Source TTF | Full WOFF2 | Text-clamped WOFF2 |
|---|---|---|---|
| Inter | 843 KB | 337 KB | **243 KB** — −28% vs full WOFF2 |

Pinning an axis outright (e.g. a fixed width or optical size) removes that axis and its variation data entirely and saves more.

Against the static files a two-style buyer would otherwise get (Inter 4, fontTools instancer, WOFF2, October 2026 — [method](https://vfclamp.com/talk/paper#method)):

| Inter, Regular + Bold | Two statics | Clamped VF (wght 400–700, opsz pinned) |
|---|---|---|
| Full character set | 226 KB | **173 KB** |
| Latin subset | 64,104 B | **50,168 B** (−22%) |

At seven styles the clamped VF is 72% smaller than the statics. Keeping a free axis such as `opsz` variable costs size: worth it from about three styles up.

### For type designers

You don't need to write code:

- **Glyphs.app or RoboFont** — install the [Glyphs plugin](https://github.com/over-punch/vf-clamp-glyphs) or [RoboFont extension](https://github.com/over-punch/vf-clamp-robofont), tick the named instances a customer licensed, and export the restricted VF (setup steps and screenshots are in [each plugin's README](https://vfclamp.com/integrations/glyphs-robofont)).
- **Try it in a browser** — the [demo at vfclamp.com](https://vfclamp.com) loads Encode Sans or any variable font you drop in, lets you pick styles as if placing an order, and downloads the result.
- **What your customer sees** — on macOS (CoreText, which Pages and Keynote use), a file clamped to Regular–Bold lists Regular, Medium, SemiBold and Bold in the font menu, with a 400–700 weight axis; apps with sliders (InDesign, Figma) show a 400–700 slider. Word on Windows is not yet tested. Ship the statics alongside — many apps still prefer them.
- **Licensing** — most licences don't mention variable fonts yet. The paper's [*Licensing language*](https://vfclamp.com/talk/paper#licensing-language) section sets out a four-part range licence (scope on the invoice, a grant for instances inside it, an optimisation right, and a fence against widening) with real clauses from BAL, Displaay, NaN and Dalton Maag.

---

## Quickstart

Node.js only (tested on Node 24), at build time or on a server — never in the browser. The first call starts the Pyodide runtime (~10–20 s); later calls in the same process take ~1–2 s.

```ts
import { clampFont } from '@overpunch/vf-clamp'
import { readFile, writeFile } from 'fs/promises'

// Inter is free (Google Fonts); the repo's fixtures/Inter-Variable.ttf works too
const source = await readFile('Inter-Variable.ttf')

const [text] = await clampFont(source, {
  format: 'woff2',
  outputs: [{ name: 'Inter Text', axes: { wght: { min: 400, max: 700 } } }],
})

await writeFile('Inter-Text.woff2', text.buffer)
```

```css
@font-face {
  font-family: 'Inter Text';
  src: url('/fonts/Inter-Text.woff2') format('woff2');
  font-weight: 400 700; /* declare the clamped range: font-weight: 900 then renders at Bold instead of a synthesised bold */
}
```

---

## Usage

### Inspect a font first

```ts
import { getInstances } from '@overpunch/vf-clamp'
import { readFile } from 'fs/promises'

const font = await readFile('MyFont-VF.ttf')
const { axes, instances } = await getInstances(font)

// axes:     [{ tag: 'wght', minimum: 100, default: 400, maximum: 900, name: 'Weight' }, ...]
// instances:[{ name: 'Regular', coordinates: { wght: 400 } }, ...]
```

Use the named instances to figure out what to clamp — adjacent instances naturally define the bounds for each output. Instance names must match exactly (case-sensitive); an unknown name throws `Named instance "X" not found in font`.

### Clamp from named instances

```ts
import { clampFont } from '@overpunch/vf-clamp'
import { readFile, writeFile } from 'fs/promises'

const source = await readFile('Omnes-VF.ttf')

const results = await clampFont(source, {
  outputs: [
    // one VF spanning the full weight range for Condensed
    {
      name: 'Omnes Condensed', // written into the name table as the family name — include the family
      instances: ['Condensed Thin', 'Condensed Black'],
    },
    // one VF for a narrower weight slice of SemiCondensed
    {
      name: 'Omnes SemiCondensed Text',
      instances: ['SemiCondensed Light', 'SemiCondensed Bold'],
    },
  ],
})

for (const result of results) {
  await writeFile(`${result.name.replace(/ /g, '-')}-VF.ttf`, result.buffer)
}
```

### Selling named styles safely

`clampFont` hulls whatever instances you pass: give it Light and Black and the output spans everything between, including styles nobody paid for. For a storefront, turn the customer's selection into outputs with `planOutputs`, which merges styles into one file only when no unselected named instance falls inside the combined range:

```ts
import { clampFont, getInstances, planOutputs } from '@overpunch/vf-clamp'

const font = await getInstances(source)

planOutputs(font, ['Regular', 'Medium', 'SemiBold', 'Bold'], 'Inter')
// → [{ name: 'Inter Regular-Bold', instances: ['Regular', 'Medium', 'SemiBold', 'Bold'] }]   one VF

planOutputs(font, ['Regular', 'Bold'], 'Inter')
// → [{ name: 'Inter Regular', … }, { name: 'Inter Bold', … }]   two files — Medium and SemiBold were not bought

const bought = ['Regular', 'Medium', 'SemiBold', 'Bold'] // the styles on the order
const results = await clampFont(source, { outputs: planOutputs(font, bought, 'Inter'), strict: true })
```

`strict: true` makes `clampFont` throw rather than build an output that would include unselected named instances, as a backstop for hand-written configs. `unboughtInstances(font, names)` lists what a given set would give away (`['Medium', 'SemiBold']` for Regular + Bold) if you would rather price the span than split it.

### Clamp with explicit axis constraints

```ts
const results = await clampFont(source, {
  outputs: [
    // Pin wdth to 75 — axis is removed from the output font
    { name: 'Condensed', axes: { wdth: 75 } },

    // Restrict wdth to a range — axis stays variable within [87.5, 100]
    { name: 'SemiCondensed', axes: { wdth: { min: 87.5, max: 100 } } },
  ],
})
```

### Mix instances and explicit axes

```ts
const results = await clampFont(source, {
  format: 'woff2',
  outputs: [
    {
      name: 'Condensed Text',
      instances: ['Condensed Light', 'Condensed Bold'],
      // Clamp opsz independently of the named instance range
      axes: { opsz: { min: 8, max: 24 } },
    },
  ],
})

// result.buffer is a valid WOFF2 file — Brotli-compressed
await writeFile('Omnes-Condensed-Text-VF.woff2', results[0].buffer)
```

---

## Axis value types

| Value | Effect |
|---|---|
| `number` | Pin the axis to that value — axis is locked and removed from the output |
| `{ min, max }` | Restrict to a range — axis stays variable within those bounds |
| `null` | Keep the full original range — same as omitting the axis entirely |
| *(omitted)* | Keep the full original range — axis is unchanged |

---

## Verifying output

Clamping is inspectable — read the result back with `getInstances` and the fvar table reflects the restricted range. Clamping Inter (wght 100–900, 9 instances) to a Text weight range:

```ts
const [text] = await clampFont(source, {
  outputs: [{ name: 'Text', axes: { wght: { min: 400, max: 700 } } }],
})

const { axes, instances } = await getInstances(text.buffer)
// axes:      wght 400 → 700          (was 100 → 900)
// instances: Regular, Medium, SemiBold, Bold   (the 5 outside the range are gone)
```

The output is a valid variable font you can drop into a build or hand to a customer: variation data is restricted to the range, and named instances and STAT values outside it are removed, so font menus show only what was bought.

---

## API

### `getInstances(input)`

```ts
async function getInstances(
  input: ArrayBuffer | Uint8Array | Buffer
): Promise<FontInstancesResult>

interface FontInstancesResult {
  axes: AxisDefinition[]
  instances: FontInstance[]
}
```

Reads the fvar table and returns every axis and named instance defined in the font. Use this to discover what can be clamped before building an output config.

### `clampFont(input, options)`

```ts
async function clampFont(
  input: ArrayBuffer | Uint8Array | Buffer,
  options: ClampOptions
): Promise<ClampResult[]>
```

**Parameters**

- `input` — Source variable font binary (TTF, OTF, WOFF, or WOFF2).
- `options.outputs` — Array of `OutputConfig` entries, one per output variant.
- `options.format` — `'ttf'` (default), `'otf'`, `'woff'`, or `'woff2'`. `'otf'` does not convert outlines: it requires a CFF/CFF2 source and throws for a TrueType-outline font.
- `options.strict` — When `true`, throw instead of building an instances-based output whose range would include unselected named instances. Defaults to `false`.
- `options.normalizeWeightAxis` — When `true`, remaps the wght axis minimum to 100 so that CSS `font-weight: 100` reaches the lightest weight. Useful for fonts whose design space starts above wght 100 (e.g. 250). Defaults to `false`.

**Throws** if an instance name is not found, if `strict` rejects an output, if `'otf'` is requested for a TrueType-outline font, or if any post-processing step (STAT pruning, OS/2 update, weight normalisation, name patching) fails — a half-processed file that still carries the retail family name is never returned.

**Returns**

Array of `ClampResult` in the same order as `options.outputs`:

```ts
interface ClampResult {
  name: string       // matches OutputConfig.name (or auto-derived instance range)
  buffer: Uint8Array // restricted font binary
  format: OutputFormat
}
```

### `planOutputs(font, selected, family?)`

```ts
function planOutputs(
  font: FontInstancesResult,   // from getInstances()
  selected: string[],          // instance names the customer bought
  family?: string              // optional prefix for output names, e.g. 'Inter'
): OutputConfig[]
```

Groups selected named instances into outputs so that no output's range contains an unselected named instance. Outputs are sorted along the font's widest axis and named with `compactName`. Throws on an unknown instance name. See [Selling named styles safely](#selling-named-styles-safely).

### `unboughtInstances(font, names)`

```ts
function unboughtInstances(font: FontInstancesResult, names: string[]): string[]
```

Returns the named instances a single output built from `names` would include without their being listed. Empty means the output is purchase-safe.

### `convertToWoff2(input)`

```ts
async function convertToWoff2(
  input: Uint8Array | Buffer
): Promise<Uint8Array>
```

Standalone WOFF2 encoder. Wraps the same Brotli-based pipeline used internally by `clampFont`. Useful for converting any TTF/OTF to WOFF2 without clamping.

### `convertToWoff(input)`

```ts
async function convertToWoff(
  input: Uint8Array | Buffer
): Promise<Uint8Array>
```

Standalone WOFF encoder. Wraps the same zlib-based pipeline used internally by `clampFont`. Useful for converting any TTF/OTF to WOFF without clamping.

### `compactName(first, last)`

```ts
function compactName(first: string, last: string): string
```

Produces a compact display name from the first and last selected instance names. Strips shared leading prefix and trailing suffix tokens, joins differing parts with a hyphen.

```ts
compactName('Inter Light', 'Inter Bold')         // → 'Inter Light-Bold'
compactName('Condensed Thin', 'Condensed Black') // → 'Condensed Thin-Black'
compactName('Regular', 'Regular')                // → 'Regular'
```

---

## Types

```ts
type AxisValue = number | AxisRange | null

interface AxisRange {
  min: number
  max: number
}

interface OutputConfig {
  name?: string           // label for this output — written into the name table
  instances?: string[]    // named instances to hull; hull derived automatically
  axes?: Record<string, AxisValue>  // explicit axis constraints; override hull per-tag
}

interface ClampOptions {
  outputs: OutputConfig[]
  format?: 'ttf' | 'otf' | 'woff' | 'woff2'  // defaults to 'ttf'
  normalizeWeightAxis?: boolean                 // remap wght min to 100 for CSS compatibility
  strict?: boolean                              // throw if an output would include unselected instances
}

interface ClampResult {
  name: string
  buffer: Uint8Array
  format: OutputFormat
}

interface AxisDefinition {
  tag: string
  name: string
  minimum: number
  default: number
  maximum: number
}

interface FontInstance {
  name: string
  coordinates: Record<string, number>
}

interface FontInstancesResult {
  axes: AxisDefinition[]
  instances: FontInstance[]
}

// Deprecated alias — use OutputConfig
type SubfamilyConfig = OutputConfig
```

---

## Notes

- **Pyodide cold start**: first call initialises the Python WASM runtime (~10–20 s on first use per process). Subsequent calls in the same process reuse the singleton — warm calls are fast (~1–2 s).
- **Input format**: TTF, OTF, WOFF, and WOFF2 are all accepted as input.
- **Outputs are processed sequentially** — Pyodide is single-threaded.
- **Name table patching**: each output font's family (IDs 1 and 16), full name (4), PostScript name (6) and variations PostScript prefix (25) are set from the output's name; the subfamily (2) is reset to `Regular` and the unique ID (3) becomes `version;PostScriptName;family` — the same for every buyer of that range, so add a watermark or order ID yourself if you need per-order tracing. Version (5) and the legal/designer IDs (7–14) are untouched.
- **Next.js**: add `@overpunch/vf-clamp` to `serverExternalPackages` in `next.config.ts` to prevent webpack bundling the Pyodide runtime.
- **Vite / other bundlers**: externalise `@overpunch/vf-clamp` and run it server-side or at build time, so the multi-MB Pyodide runtime isn't shipped to the browser.

---

## REST API

The delivery layer: wire vf-clamp into a storefront so a purchase event becomes a delivered file. vfclamp.com exposes hosted endpoints — one to read a font's instances, one to clamp and return scoped fonts by URL. Useful for server-side workflows where the font is fetched by URL. Contact [hello@overpunch.ca](mailto:hello@overpunch.ca) to request an API key.

```
POST https://vfclamp.com/api/clamp
X-API-Key: <your-key>
Content-Type: application/json

{
  "fontUrl": "https://cdn.example.com/MyFont-VF.ttf",
  "format": "woff2",
  "outputs": [
    { "name": "Text", "instances": ["Light", "Bold"] },
    { "name": "Condensed", "axes": { "wdth": 75 } }
  ]
}
// → { results: [{ name, data, format, size }] }

POST https://vfclamp.com/api/instances
X-API-Key: <your-key>

{ "fontUrl": "https://cdn.example.com/MyFont-VF.ttf" }
// → { axes: [...], instances: [...] }
```

**Performance & limits.** The hosted endpoints keep the runtime warm, so a typical clamp returns in ~1–2 s (a cold instance adds the one-time ~10–20 s Pyodide init). Rate limits, concurrency, and uptime depend on your API plan — ask when you request a key.

---

## Running at scale

Pyodide is single-threaded and warms up once per process (~10–20 s cold, then ~1–2 s per call). In a storefront, **don't clamp inside the request handler** and don't drive one instance from parallel requests — serialise through a warm worker, and scale out with a pool of processes:

```ts
import PQueue from 'p-queue'
import { clampFont } from '@overpunch/vf-clamp'

// one warm engine, requests queued — the checkout response isn't blocked on the clamp
const queue = new PQueue({ concurrency: 1 }) // the engine is single-threaded

export function enqueueClamp(source, options) {
  return queue.add(() => clampFont(source, options))
}
```

For higher throughput, run **N worker processes** (each with its own warm Pyodide) behind a job queue or round-robin — concurrency scales with processes, not threads — or offload entirely to the [hosted REST API](#rest-api).

---

## What it does to the font

For font engineers — the pipeline, in order, per output:

1. **Instance** — fontTools [`varLib.instancer.instantiateVariableFont`](https://fonttools.readthedocs.io/en/latest/varLib/instancer.html) with each axis pinned (`number`) or restricted (`{ min, max }`, a range instance). Variation data outside the range is dropped and the rest renormalised; there are no "masters" in a binary VF to remove. If the range excludes an axis's default, the default moves to the nearest edge (vf-clamp logs a warning), which re-bases the default outlines and metrics; such files save little over the full VF.
2. **STAT** — axis records and axis values for pinned or out-of-range positions are pruned, so OS font menus don't surface unlicensed names.
3. **Weight normalisation** (only with `normalizeWeightAxis`) — the wght user-space range is remapped to start at 100; avar is unchanged because normalised values are preserved. This changes registered-axis semantics, so use it only when CSS `font-weight` must reach the lightest weight.
4. **OS/2 and head** — `usWeightClass`, `fsSelection` and `macStyle` follow the new default.
5. **Names** — see the name table note under [Notes](#notes).
6. **Encode** — WOFF or WOFF2 when requested.

The engine is fontTools **4.56.0** (via [`@web-alchemy/fonttools`](https://www.npmjs.com/package/@web-alchemy/fonttools)) on **Pyodide 0.29.3** — about 15 MB on disk, none of it shipped to browsers. Fonts that rely on newer formats (avar2, VARC) may be refused by this fontTools version. Hinting is whatever the instancer keeps; most VFs ship unhinted.

If you already run Python, the core step is one command — vf-clamp adds the STAT, OS/2 and name handling, and runs it from Node:

```sh
fonttools varLib.instancer Inter-Variable.ttf wght=400:700 opsz=14 -o Inter-Text.ttf
```

Clamping limits what a file contains, not what can be computed: in a simple two-master design the remaining data can be extrapolated past the range. The file makes the licensed scope visible; the licence's terms do the enforcing.

---

## Development

```sh
git clone --recurse-submodules https://github.com/over-punch/vf-clamp.git   # plugins/ are git submodules
cd vf-clamp
npm install
npm run test:run   # unit tests + Pyodide integration tests (~70 s; the first test warms the runtime)
npm run lint       # tsc --noEmit
npm run build      # vite → dist/ (ESM + CJS + types)
```

Layout: `src/core/` (the package: `clamp.ts`, `instances.ts`, `plan.ts`, `convert.ts`, `types.ts`), `src/__tests__/` (vitest; `fixtures/Inter-Variable.ttf` is Inter 4, wght 100–900 + opsz 14–32), `site/` (vfclamp.com, Next.js), `plugins/` (CLI, Glyphs, RoboFont and VS Code submodules), `shared/plugin-views/` (canonical NSView files synced into the Glyphs and RoboFont plugins with `npm run sync-plugin-views`).

Report bugs and requests in [GitHub issues](https://github.com/over-punch/vf-clamp/issues).

---

## Integrations

vf-clamp is available as a CLI and as native plugins for Glyphs.app, RoboFont, and VS Code — all using the same axis-constraint model as the npm package.

| Integration | Distribution |
|---|---|
| [vf-clamp-cli](https://github.com/over-punch/vf-clamp-cli) | `npm install -g @overpunch/vf-clamp-cli` |
| [vf-clamp-glyphs](https://github.com/over-punch/vf-clamp-glyphs) | `.glyphsPlugin` download |
| [vf-clamp-robofont](https://github.com/over-punch/vf-clamp-robofont) | `.roboFontExt` download |
| [vf-clamp-vscode](https://github.com/over-punch/vf-clamp-vscode) | `.vsix` download / VS Code Marketplace |

The CLI in action — inspect a font, then clamp it:

![vf-clamp CLI: inspecting Inter's axes and 9 named instances, then clamping Regular–Bold to a Text WOFF2](https://raw.githubusercontent.com/over-punch/vf-clamp-cli/main/assets/demo.gif?v=1)

---

## License

MIT — [Liiift Studio](https://overpunch.ca). See [LICENSE](LICENSE). The CLI, Glyphs and VS Code plugins are MIT too; the RoboFont extension has its own proprietary licence.
