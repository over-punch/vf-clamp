// src/core/clamp.ts — clampFont() implementation wrapping @web-alchemy/fonttools
import type { AxisValue, ClampOptions, ClampResult, FontInstance, OutputFormat } from './types.js'
import { convertToWoff, convertToWoff2 } from './convert.js'
import { getInstances } from './instances.js'
import { preparePyodide, PyodideFile } from './pyodide.js'
import { findInstance, rangeName } from './utils.js'
// The one implementation of the naming, style-bit and STAT rules, shared with the Glyphs and RoboFont plugins.
import NAMING_PY from '../../shared/plugin-views/vfclamp_naming.py?raw'

/**
 * Promise-singleton caches for Python functions — initialised once per process.
 * Storing Promises (not resolved values) ensures concurrent callers await the same
 * pending initialisation instead of racing to issue multiple runPythonAsync calls.
 */
let _namingP: Promise<void> | null = null
let _finisherFnP: Promise<(fileOptions: Map<string, string>, optsJson: string) => void> | null = null
let _instancerFnP: Promise<(fileOptions: Map<string, string>, axesJson: string) => string> | null = null
let _normalizerFnP: Promise<(fileOptions: Map<string, string>, newMin: string) => string | undefined> | null = null

/** Loads shared/plugin-views/vfclamp_naming.py into Pyodide's global namespace, once per process. */
export function loadNaming(): Promise<void> {
	if (!_namingP) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		_namingP = preparePyodide().then(async (pyodide: any) => { await pyodide.runPythonAsync(NAMING_PY) })
	}
	return _namingP!
}

/** Python step run after instancing: STAT links, style bits and names, via vfclamp_naming.finish(). */
async function getFinisher() {
	if (!_finisherFnP) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		_finisherFnP = loadNaming().then(() => preparePyodide()).then((pyodide: any) =>
			pyodide.runPythonAsync(`
import json
from fontTools.ttLib import TTFont

def vf_clamp_finish(file_options, opts_json):
    opts = json.loads(opts_json)
    font = TTFont(file_options['input-file'])
    finish(font, opts['family'], opts.get('style'), opts.get('pinned') or {}, opts['source'])
    font.save(file_options['output-file'])

vf_clamp_finish
`)
		)
	}
	return _finisherFnP!
}

/**
 * Custom Python instancer. Axis specs are JSON-serialised so Pyodide receives plain
 * Python dicts/lists — avoiding the JsProxy type-bridging bug in the @web-alchemy
 * wrapper, which caused the instancer to receive JS arrays instead of AxisTriple
 * objects and produce wrong fvar axis coordinates.
 */
async function getInstancer() {
	if (!_instancerFnP) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		_instancerFnP = loadNaming().then(() => preparePyodide()).then((pyodide: any) =>
			pyodide.runPythonAsync(`
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
import json

def vf_clamp_instantiate(file_options, axes_json):
    font = TTFont(file_options['input-file'])
    axes_spec = json.loads(axes_json)

    # The bundled fontTools can't restrict avar version 2 or VARC fonts correctly: refuse instead of mis-cutting.
    if 'avar' in font and getattr(font['avar'], 'majorVersion', 1) >= 2:
        raise ValueError('vf-clamp: avar version 2 fonts are not supported yet')
    if 'VARC' in font:
        raise ValueError('vf-clamp: fonts with a VARC table are not supported yet')

    limits = {}
    axes_by_tag = {ax.axisTag: ax for ax in font['fvar'].axes}

    for tag, spec in axes_spec.items():
        if spec is None:
            continue
        ax = axes_by_tag.get(tag)
        if isinstance(spec, list):
            mn = float(spec[0])
            mx = float(spec[1])
            default = ax.defaultValue if ax else (mn + mx) / 2
            default = max(mn, min(mx, default))
            limits[tag] = instancer.AxisTriple(mn, default, mx)
        else:
            limits[tag] = float(spec)

    # The style rules need the source's italic bits and which axes were pinned (they leave fvar).
    source = source_style_info(font)
    pinned = {tag: value for tag, value in limits.items() if isinstance(value, float)}
    partial = instancer.instantiateVariableFont(font, limits)
    partial.save(file_options['output-file'])
    return json.dumps({'source': source, 'pinned': pinned})

vf_clamp_instantiate
`)
		)
	}
	return _instancerFnP!
}

/**
 * Remap the wght axis so its minimum becomes new_min (default 100), making CSS
 * font-weight values work as expected for fonts whose design space starts above 100.
 *
 * Technique: proportionally remap all below-default coordinates so their normalised
 * value is preserved. The avar table requires no changes because normalised values
 * are unchanged. Only fvar min, instance coordinates, and STAT axis values are updated.
 */
async function getNormalizer() {
	if (!_normalizerFnP) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		_normalizerFnP = preparePyodide().then((pyodide: any) =>
			pyodide.runPythonAsync(`
from fontTools.ttLib import TTFont

def vf_clamp_normalize_wght(file_options, new_min_str):
    new_min = float(new_min_str)
    font = TTFont(file_options['input-file'])

    if 'fvar' not in font:
        font.save(file_options['output-file'])
        return

    wght_axis = next((ax for ax in font['fvar'].axes if ax.axisTag == 'wght'), None)

    # Only normalize when the font's minimum is above the target (e.g. 251 > 100)
    if wght_axis is None or wght_axis.minValue <= new_min:
        font.save(file_options['output-file'])
        return

    old_min = wght_axis.minValue
    default = wght_axis.defaultValue
    # With the default at the minimum there is no below-default range to stretch; leave the font as is.
    if default <= old_min:
        font.save(file_options['output-file'])
        return 'skipped'
    scale = (default - new_min) / (default - old_min)

    def remap(v):
        return (default + (v - default) * scale) if v < default else v

    # Update fvar axis minimum
    wght_axis.minValue = new_min

    # Update named instance wght coordinates
    for inst in font['fvar'].instances:
        if 'wght' in inst.coordinates:
            inst.coordinates['wght'] = remap(inst.coordinates['wght'])

    # Update STAT axis values that reference wght
    if 'STAT' in font and font['STAT'].table.AxisValueArray:
        stat = font['STAT'].table
        wght_idx = None
        if hasattr(stat, 'DesignAxisRecord') and stat.DesignAxisRecord:
            for i, ax in enumerate(stat.DesignAxisRecord.Axis):
                if ax.AxisTag == 'wght':
                    wght_idx = i
                    break
        if wght_idx is not None:
            for av in stat.AxisValueArray.AxisValue:
                fmt = av.Format
                if fmt in (1, 3) and av.AxisIndex == wght_idx:
                    av.Value = remap(av.Value)
                    if fmt == 3:
                        av.LinkedValue = remap(av.LinkedValue)
                elif fmt == 2 and av.AxisIndex == wght_idx:
                    av.NominalValue = remap(av.NominalValue)
                    av.RangeMinValue = remap(av.RangeMinValue)
                    av.RangeMaxValue = remap(av.RangeMaxValue)
                elif fmt == 4:
                    for rec in getattr(av, 'AxisValueRecord', []) or []:
                        if rec.AxisIndex == wght_idx:
                            rec.Value = remap(rec.Value)

    font.save(file_options['output-file'])
    return 'done'

vf_clamp_normalize_wght
`)
		)
	}
	return _normalizerFnP!
}

/**
 * Apply vf-clamp's naming, style-bit and STAT rules to a clamped font (docs/NAMING.md).
 * Throws if it fails, so a file still carrying the retail names is never returned.
 */
async function runFinisher(buffer: Uint8Array, opts: { family: string; style: string | null; pinned: Record<string, number>; source: unknown }): Promise<Uint8Array> {
	const pyodide = await preparePyodide()
	const inputFile  = new PyodideFile({ pyodide })
	const outputFile = new PyodideFile({ pyodide })
	try {
		await inputFile.upload(buffer)
		const fileOptions = new Map([
			['input-file',  inputFile.filename],
			['output-file', outputFile.filename],
		])
		const fn = await getFinisher()
		fn(fileOptions, JSON.stringify(opts))
		return outputFile.download() as Uint8Array
	} catch (err) {
		throw Object.assign(new Error(`vf-clamp: name table patching failed for "${opts.family}"`), { cause: err })
	} finally {
		try { inputFile.delete() } catch { /* already cleaned */ }
		try { outputFile.delete() } catch { /* already cleaned */ }
	}
}

/** Convert a vf-clamp AxisValue to a JSON-serialisable form for the Python instancer */
function toInstancerValue(value: AxisValue): number | [number, number] | null {
	if (typeof value === 'number') return value
	if (value === null) return null
	return [value.min, value.max]
}

/** Run the Python instancer via Pyodide, passing axis specs as JSON to avoid bridging issues */
async function runInstancer(bytes: Uint8Array | Buffer, instancerAxes: Record<string, number | [number, number] | null>): Promise<{ buffer: Uint8Array; info: { source: unknown; pinned: Record<string, number> } }> {
	const pyodide = await preparePyodide()
	const inputFile  = new PyodideFile({ pyodide })
	const outputFile = new PyodideFile({ pyodide })

	try {
		await inputFile.upload(bytes)

		const fileOptions = new Map([
			['input-file',  inputFile.filename],
			['output-file', outputFile.filename],
		])

		const fn = await getInstancer()
		const info = JSON.parse(fn(fileOptions, JSON.stringify(instancerAxes)))

		return { buffer: outputFile.download() as Uint8Array, info }
	} finally {
		try { inputFile.delete() } catch { /* already cleaned */ }
		try { outputFile.delete() } catch { /* already cleaned */ }
	}
}

/** Remap the wght axis minimum to newMin, preserving normalised values throughout */
async function runNormalizer(bytes: Uint8Array, newMin: number): Promise<Uint8Array> {
	const pyodide = await preparePyodide()
	const inputFile  = new PyodideFile({ pyodide })
	const outputFile = new PyodideFile({ pyodide })

	try {
		await inputFile.upload(bytes)

		const fileOptions = new Map([
			['input-file',  inputFile.filename],
			['output-file', outputFile.filename],
		])

		const fn = await getNormalizer()
		if (fn(fileOptions, String(newMin)) === 'skipped') {
			console.warn('vf-clamp: normalizeWeightAxis skipped: the weight default is the axis minimum, so there is no lower range to remap')
		}

		const result = outputFile.download()
		return result as Uint8Array
	} catch (err) {
		throw Object.assign(new Error('vf-clamp: wght normalisation failed'), { cause: err })
	} finally {
		try { inputFile.delete() } catch { /* already cleaned */ }
		try { outputFile.delete() } catch { /* already cleaned */ }
	}
}

/**
 * Compute the axis hull (min/max per axis) across a set of named instances.
 * Uses a Map for O(1) instance lookup by name.
 * Axes where min === max are returned as a pinned number; varying axes as an AxisRange.
 * Throws if any instance name is not found in the font.
 */
function computeHull(
	requestedNames: string[],
	fontInstances: FontInstance[],
): Record<string, AxisValue> {
	const hull: Record<string, { min: number; max: number }> = {}

	for (const name of requestedNames) {
		const inst = findInstance(name, fontInstances)

		for (const [tag, val] of Object.entries(inst.coordinates)) {
			if (!hull[tag]) hull[tag] = { min: val, max: val }
			else {
				hull[tag].min = Math.min(hull[tag].min, val)
				hull[tag].max = Math.max(hull[tag].max, val)
			}
		}
	}

	const result: Record<string, AxisValue> = {}
	for (const [tag, { min, max }] of Object.entries(hull)) {
		result[tag] = min === max ? min : { min, max }
	}
	return result
}

/** True when an sfnt buffer starts with the 'OTTO' tag (CFF/CFF2 outlines). */
function isCffSfnt(buf: Uint8Array): boolean {
	return buf.length >= 4 && buf[0] === 0x4f && buf[1] === 0x54 && buf[2] === 0x54 && buf[3] === 0x4f
}

/**
 * Produce one restricted variable font per output config from a source variable font.
 * Outputs are processed sequentially (Pyodide is single-threaded).
 *
 * Each output can specify:
 * - instances: named instances to include — hull (min/max per axis) computed automatically
 * - axes: explicit axis constraints — override or extend the instance hull
 *
 * @param input - Source variable font binary (TTF, OTF, WOFF, or WOFF2)
 * @param options - Output configs and optional format
 * @returns One ClampResult per output, in the same order as options.outputs
 */
export async function clampFont(
	input: ArrayBuffer | Uint8Array | Buffer,
	options: ClampOptions
): Promise<ClampResult[]> {
	if (options.outputs.length === 0) return []

	// Pyodide's FS.writeFile requires Uint8Array or Buffer, not a raw ArrayBuffer.
	const bytes: Uint8Array | Buffer =
		input instanceof ArrayBuffer ? new Uint8Array(input) : input

	const format: OutputFormat = options.format ?? 'ttf'

	// Read axes and named instances once — needed for the instances path, the strict check and the default-range warning
	const { instances: fontInstances, axes: axisDefs, family: sourceFamily, labels } = await getInstances(bytes)

	const results: ClampResult[] = []

	for (const output of options.outputs) {
		// Start with instance hull if instances provided, then layer explicit axes on top
		let axesConfig: Record<string, AxisValue> = {}

		if (output.instances?.length) {
			axesConfig = computeHull(output.instances, fontInstances)
		}

		if (output.axes) {
			axesConfig = { ...axesConfig, ...output.axes }
		}

		// strict: refuse any output whose final range (after any explicit axes) holds a named instance it did not list.
		// An axes-only output lists none, so it passes only if its range holds no named instance at all.
		if (options.strict) {
			const listed = new Set((output.instances ?? []).map((n) => findInstance(n, fontInstances)))
			const extra = fontInstances.filter((inst) => !listed.has(inst) && axisDefs.every((ax) => {
				const v = inst.coordinates[ax.tag] ?? ax.default
				const c = axesConfig[ax.tag]
				if (c === null || c === undefined) return true
				return typeof c === 'number' ? v === c : v >= c.min && v <= c.max
			})).map((inst) => inst.name)
			if (extra.length) {
				throw new Error(`vf-clamp: output "${output.name || (output.instances ?? []).join(', ') || 'axes-only'}" would include unselected instances (${extra.join(', ')}); use planOutputs() to split the selection`)
			}
		}

		// Warn if any axis default falls outside the restricted range — fonttools silently clamps it.
		// Only checked when axisDefs are available (i.e., getInstances was already called).
		for (const axDef of axisDefs) {
			const constraint = axesConfig[axDef.tag]
			if (constraint !== null && constraint !== undefined && typeof constraint === 'object') {
				const range = constraint as { min: number; max: number }
				if (axDef.default < range.min || axDef.default > range.max) {
					const clamped = Math.max(range.min, Math.min(range.max, axDef.default))
					console.warn(
						`vf-clamp: axis "${axDef.tag}" default (${axDef.default}) is outside restricted range [${range.min}, ${range.max}] — will be clamped to ${clamped}`
					)
				}
			}
		}

		// Build the instancer axis map (skip null — keeps full range)
		const instancerAxes: Record<string, number | [number, number] | null> = {}
		for (const [tag, value] of Object.entries(axesConfig)) {
			if (value !== null) instancerAxes[tag] = toInstancerValue(value)
		}

		// Without an explicit name: the source family plus one range per axis, in the font's own style words
		// ("Encode Sans SemiCondensed-Normal Thin-Light"). A blank name counts as no name.
		const picked = (output.instances ?? []).map((n) => findInstance(n, fontInstances))
		const range = picked.length ? rangeName(picked, fontInstances, axisDefs, labels ?? {}) : 'Clamped'
		const name = output.name?.trim() || (sourceFamily ? `${sourceFamily} ${range}` : range)

		const { buffer: instanced, info } = await runInstancer(bytes, instancerAxes)
		let buffer = instanced

		// 'otf' is a label, not a conversion: refuse it for TrueType-outline fonts rather than mislabel them
		if (format === 'otf' && !isCffSfnt(buffer)) {
			throw new Error("vf-clamp: format 'otf' needs a CFF/CFF2 source font; this font has TrueType outlines — use 'ttf'")
		}

		// Optionally remap wght axis to CSS 100–900 range
		if (options.normalizeWeightAxis) {
			buffer = await runNormalizer(buffer, 100)
		}

		// STAT links, OS/2 style bits and names, all from the shared module (docs/NAMING.md). A single picked
		// instance names the file's style; a range takes the instance at its new default.
		buffer = await runFinisher(buffer, { family: name, style: picked.length === 1 ? picked[0].name : null, pinned: info.pinned, source: info.source })

		if (format === 'woff2') {
			buffer = await convertToWoff2(buffer)
		} else if (format === 'woff') {
			buffer = await convertToWoff(buffer)
		}

		results.push({ name, buffer, format })
	}

	return results
}
