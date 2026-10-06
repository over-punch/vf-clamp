// src/core/clamp.ts — clampFont() implementation wrapping @web-alchemy/fonttools
import type { AxisValue, ClampOptions, ClampResult, FontInstance, OutputFormat } from './types.js'
import { convertToWoff, convertToWoff2 } from './convert.js'
import { getInstances } from './instances.js'
import { preparePyodide, PyodideFile } from './pyodide.js'
import { findInstance } from './utils.js'

/**
 * Promise-singleton caches for Python functions — initialised once per process.
 * Storing Promises (not resolved values) ensures concurrent callers await the same
 * pending initialisation instead of racing to issue multiple runPythonAsync calls.
 */
let _namePatcherFnP: Promise<(fileOptions: Map<string, string>) => void> | null = null
let _instancerFnP: Promise<(fileOptions: Map<string, string>, axesJson: string) => void> | null = null
let _normalizerFnP: Promise<(fileOptions: Map<string, string>, newMin: string) => string | undefined> | null = null
let _os2UpdaterFnP: Promise<(fileOptions: Map<string, string>) => void> | null = null

async function getNamePatcher() {
	if (!_namePatcherFnP) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		_namePatcherFnP = preparePyodide().then((pyodide: any) =>
			pyodide.runPythonAsync(`
from fontTools import ttLib

def patch_font_names_fn(file_options):
    font = ttLib.TTFont(file_options['input-file'])
    name_table = font['name']
    family_name  = file_options['family-name']
    ps_name      = file_options['postscript-name']

    existing_ids = {r.nameID for r in name_table.names}

    # A family name with no ASCII letters gives an empty PostScript name: fall back to the
    # source PostScript name plus a short hash of the family name (passed in from JS).
    if not ps_name:
        source_ps = name_table.getDebugName(6) or 'Font'
        ps_name = ('%s-%s' % (source_ps[:52], file_options['postscript-suffix']))[:63]

    # nameID 2 must be a RIBBI style that matches OS/2 (already updated): Regular, Italic, Bold or Bold Italic.
    fs = font['OS/2'].fsSelection if 'OS/2' in font else 0x40
    is_italic = bool(fs & 0x01)
    is_bold = bool(fs & 0x20)
    ribbi = ('Bold Italic' if is_italic else 'Bold') if is_bold else ('Italic' if is_italic else 'Regular')

    # nameID 17 (typographic subfamily): the name of the named instance at the new default, if any.
    default_style = None
    if 'fvar' in font:
        defaults = {ax.axisTag: ax.defaultValue for ax in font['fvar'].axes}
        for inst in font['fvar'].instances:
            if all(abs(inst.coordinates.get(t, v) - v) < 0.01 for t, v in defaults.items()):
                default_style = name_table.getDebugName(inst.subfamilyNameID)
                break

    # nameID 1 = Family, 4 = Full name, 6 = PostScript name
    # nameID 2 = Subfamily — reset to 'Regular' so the restricted file does not
    #            collide with the source font's Subfamily in OS font caches.
    # nameID 3 = Unique ID — regenerate so it is distinct from the source font.
    # nameID 16 = Preferred family (update only if present)
    # nameID 25 = Variations PS Name Prefix (update only if present)
    #
    # head.fontRevision is a Fixed value (e.g. 1.000). Fall back to '1.000' if
    # the head table is unreadable.
    try:
        version = '%.3f' % font['head'].fontRevision
    except Exception:
        version = '1.000'
    unique_id = '%s;%s;%s' % (version, ps_name, family_name)

    updates = {
        1: family_name,
        2: ribbi,
        3: unique_id,
        4: family_name if ribbi == 'Regular' else '%s %s' % (family_name, ribbi),
        6: ps_name,
    }
    if 16 in existing_ids:
        updates[16] = family_name
    if 17 in existing_ids and default_style:
        updates[17] = default_style
    if 25 in existing_ids:
        updates[25] = ps_name

    # Named instances' PostScript names must follow the new prefix, e.g. Inter-Regular-Bold-Medium.
    if 'fvar' in font:
        for inst in font['fvar'].instances:
            pid = getattr(inst, 'postscriptNameID', 0xFFFF)
            if pid in (None, 0xFFFF):
                continue
            style = (name_table.getDebugName(inst.subfamilyNameID) or '').replace(' ', '')
            style = ''.join(c for c in style if c.isascii() and (c.isalnum() or c == '-'))
            updates[pid] = ('%s-%s' % (ps_name, style))[:63]

    # Rewrite every platform. A Mac (platform 1) record that can't be encoded in Mac Roman is dropped
    # rather than filled with '?'; Windows and Unicode records always carry the full name.
    keep = []
    for record in name_table.names:
        if record.nameID not in updates:
            keep.append(record)
            continue
        value = updates[record.nameID]
        if record.platformID in (0, 3):
            record.string = value.encode('utf-16-be')
        elif record.platformID == 1:
            try:
                record.string = value.encode('mac_roman')
            except Exception:
                continue
        keep.append(record)
    name_table.names = keep

    font.save(file_options['output-file'])

patch_font_names_fn
`)
		)
	}
	return _namePatcherFnP!
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
		_instancerFnP = preparePyodide().then((pyodide: any) =>
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

    partial = instancer.instantiateVariableFont(font, limits)
    partial.save(file_options['output-file'])

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
 * Update OS/2.usWeightClass, OS/2.fsSelection, and head.macStyle to reflect
 * the new wght default after clamping. Without this, the OS reports the
 * restricted file with the source font's original weight metadata.
 */
async function getOs2Updater() {
	if (!_os2UpdaterFnP) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		_os2UpdaterFnP = preparePyodide().then((pyodide: any) =>
			pyodide.runPythonAsync(`
from fontTools.ttLib import TTFont

def vf_clamp_update_os2(file_options):
    font = TTFont(file_options['input-file'])

    if 'fvar' not in font:
        font.save(file_options['output-file'])
        return

    wght_axis = next((ax for ax in font['fvar'].axes if ax.axisTag == 'wght'), None)
    if wght_axis is not None:
        # OS/2.usWeightClass valid range is 1..1000.
        weight_class = int(round(max(1, min(1000, wght_axis.defaultValue))))
    elif 'OS/2' in font:
        # wght was pinned: fontTools has already set usWeightClass to the pinned weight.
        weight_class = font['OS/2'].usWeightClass
    else:
        font.save(file_options['output-file'])
        return

    if 'OS/2' in font:
        os2 = font['OS/2']
        os2.usWeightClass = weight_class
        # fsSelection: 0x01 ITALIC (kept), 0x20 BOLD, 0x40 REGULAR. REGULAR only when neither ITALIC nor BOLD.
        fs = os2.fsSelection
        fs &= ~(0x20 | 0x40)
        if weight_class >= 700:
            fs |= 0x20
        elif not fs & 0x01:
            fs |= 0x40
        os2.fsSelection = fs

    if 'head' in font:
        head = font['head']
        # macStyle bit 0 = bold.
        ms = head.macStyle
        if weight_class >= 700:
            ms |= 0x01
        else:
            ms &= ~0x01
        head.macStyle = ms

    font.save(file_options['output-file'])

vf_clamp_update_os2
`)
		)
	}
	return _os2UpdaterFnP!
}

/**
 * Convert a human-readable family name to a valid PostScript name.
 * Transliterates accents (Été → Ete), drops other non-ASCII characters, replaces spaces with
 * hyphens, and keeps within the 63-character OpenType limit (long names end in a short hash).
 * An empty result is replaced in Python by the source PostScript name plus a hash.
 */
export function toPostScriptName(familyName: string): string {
	const ascii = familyName
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^A-Za-z0-9 -]/g, '')
		.trim()
		.split(/\s+/)
		.join('-')
		.replace(/-+/g, '-')
		.replace(/^-+|-+$/g, '')
	// Over 63 characters: keep a readable prefix and add a hash of the full name so long names stay unique.
	return ascii.length <= 63 ? ascii : `${ascii.slice(0, 56).replace(/-+$/, '')}-${shortHash(familyName)}`
}

/** Six-character FNV-1a hash of a string, used to keep shortened or transliterated PostScript names unique. */
export function shortHash(text: string): string {
	let h = 0x811c9dc5
	for (const ch of text) {
		h ^= ch.codePointAt(0)!
		h = Math.imul(h, 0x01000193) >>> 0
	}
	return h.toString(36).padStart(6, '0').slice(-6)
}

/**
 * Patch the name table of a font buffer to reflect the restricted instance range.
 * Updates nameIDs 1 (Family), 4 (Full name), 6 (PostScript), 16 and 25 if present.
 * Throws if patching fails, so a file still carrying the retail names is never returned.
 */
async function patchFontNames(buffer: Uint8Array, familyName: string): Promise<Uint8Array> {
	if (!familyName) return buffer
	const pyodide = await preparePyodide()
	const inputFile  = new PyodideFile({ pyodide })
	const outputFile = new PyodideFile({ pyodide })
	try {
		const psName = toPostScriptName(familyName)

		await inputFile.upload(buffer)

		const fileOptions = new Map([
			['input-file', inputFile.filename],
			['output-file', outputFile.filename],
			['family-name', familyName],
			['postscript-name', psName],
			['postscript-suffix', shortHash(familyName)],
		])

		const patcher = await getNamePatcher()
		patcher(fileOptions)

		const result = outputFile.download()
		return result as Uint8Array
	} catch (err) {
		throw Object.assign(new Error(`vf-clamp: name table patching failed for "${familyName}"`), { cause: err })
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
async function runInstancer(bytes: Uint8Array | Buffer, instancerAxes: Record<string, number | [number, number] | null>): Promise<Uint8Array> {
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
		fn(fileOptions, JSON.stringify(instancerAxes))

		const result = outputFile.download()
		return result as Uint8Array
	} finally {
		try { inputFile.delete() } catch { /* already cleaned */ }
		try { outputFile.delete() } catch { /* already cleaned */ }
	}
}

/** Update OS/2.usWeightClass, fsSelection, and head.macStyle from the new wght default */
async function runOs2Updater(bytes: Uint8Array): Promise<Uint8Array> {
	const pyodide = await preparePyodide()
	const inputFile  = new PyodideFile({ pyodide })
	const outputFile = new PyodideFile({ pyodide })

	try {
		await inputFile.upload(bytes)

		const fileOptions = new Map([
			['input-file',  inputFile.filename],
			['output-file', outputFile.filename],
		])

		const fn = await getOs2Updater()
		fn(fileOptions)

		const result = outputFile.download()
		return result as Uint8Array
	} catch (err) {
		throw Object.assign(new Error('vf-clamp: OS/2 and macStyle update failed'), { cause: err })
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
	const { instances: fontInstances, axes: axisDefs, family: sourceFamily } = await getInstances(bytes)

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

		// Derive name before patching so the name table reflects it. Without an explicit name, prefix the
		// source family so the delivered file isn't called just "Regular-Bold".
		// Use ASCII hyphen (not en-dash) so toPostScriptName preserves the separator
		const range = output.instances?.length
			? output.instances.length === 1
				? output.instances[0]
				: `${output.instances[0]}-${output.instances[output.instances.length - 1]}`
			: 'Clamped'
		const name = output.name || (sourceFamily ? `${sourceFamily} ${range}` : range)

		let buffer = await runInstancer(bytes, instancerAxes)

		// 'otf' is a label, not a conversion: refuse it for TrueType-outline fonts rather than mislabel them
		if (format === 'otf' && !isCffSfnt(buffer)) {
			throw new Error("vf-clamp: format 'otf' needs a CFF/CFF2 source font; this font has TrueType outlines — use 'ttf'")
		}

		// STAT is left to fontTools: its instancer drops axis values outside the new range, and STAT may
		// legitimately describe axes that are not in fvar (Inter's ital), which upright/italic linking needs.

		// Optionally remap wght axis to CSS 100–900 range
		if (options.normalizeWeightAxis) {
			buffer = await runNormalizer(buffer, 100)
		}

		// Sync OS/2.usWeightClass + head.macStyle to the new wght default so the
		// OS reports the restricted file with the correct weight metadata.
		buffer = await runOs2Updater(buffer)

		// Update the name table so the restricted font reflects its actual instance range
		buffer = await patchFontNames(buffer, name)

		if (format === 'woff2') {
			buffer = await convertToWoff2(buffer)
		} else if (format === 'woff') {
			buffer = await convertToWoff(buffer)
		}

		results.push({ name, buffer, format })
	}

	return results
}
