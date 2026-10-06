// src/core/utils.ts — shared utility functions
import type { FontInstance } from './types.js'

/**
 * Produce a compact display name from the first and last selected instance names.
 * Strips shared leading prefix and trailing suffix tokens, joins differing parts with a dash.
 *
 * Examples:
 *   compactName('Inter Light', 'Inter Bold')         → 'Inter Light-Bold'
 *   compactName('Condensed Thin', 'Condensed Black') → 'Condensed Thin-Black'
 *   compactName('Regular', 'Regular')                → 'Regular'
 *
 * Canonical implementation — also duplicated in the Python plugins and VS Code webview
 * (both sandboxed contexts that cannot import this package at runtime).
 */
export function compactName(first: string, last: string): string {
	if (first === last) return first
	const fw = first.split(' ')
	const lw = last.split(' ')
	let prefixLen = 0
	while (prefixLen < fw.length && prefixLen < lw.length && fw[prefixLen] === lw[prefixLen]) {
		prefixLen++
	}
	let suffixLen = 0
	while (
		suffixLen < fw.length - prefixLen &&
		suffixLen < lw.length - prefixLen &&
		fw[fw.length - 1 - suffixLen] === lw[lw.length - 1 - suffixLen]
	) {
		suffixLen++
	}
	const prefix = fw.slice(0, prefixLen).join(' ')
	const a = fw.slice(prefixLen, fw.length - (suffixLen || 0)).join(' ')
	const b = lw.slice(prefixLen, lw.length - (suffixLen || 0)).join(' ')
	const suffix = suffixLen > 0 ? fw.slice(fw.length - suffixLen).join(' ') : ''
	const middle = a && b ? `${a}-${b}` : a || b
	return [prefix, middle, suffix].filter(Boolean).join(' ')
}

/**
 * Finds a named instance by name. Throws if it is missing, or if several instances share the name
 * (e.g. "Bold" at two optical sizes), since a name alone can't say which one was bought.
 */
export function findInstance(name: string, fontInstances: FontInstance[]): FontInstance {
	const matches = fontInstances.filter((i) => i.name === name)
	if (!matches.length) throw new Error(`Named instance "${name}" not found in font`)
	if (matches.length > 1) throw new Error(`Named instance "${name}" is ambiguous: ${matches.length} instances share that name`)
	return matches[0]
}

/** Label for an axis value that has no word in the font's style names (e.g. wdth 100 in "Light"). */
const DEFAULT_AXIS_WORDS: Record<string, string> = { wght: 'Regular', wdth: 'Normal', ital: 'Upright', slnt: 'Upright' }

/** Stable text key for an axis value, identical to number_key() in Python ('100', '87.5'). */
export function numberKey(value: number): string {
	return value.toFixed(6).replace(/0+$/, '').replace(/\.$/, '')
}

/** Whitespace-separated words of a style name. */
function words(text: string): string[] {
	return (text || '').split(/\s+/).filter(Boolean)
}

/**
 * Default name for a selection of named instances: one range per axis, in the font's own style words
 * ("SemiCondensed-Normal Thin-Light"). TypeScript twin of range_name() in
 * shared/plugin-views/vfclamp_naming.py; both are checked against shared/naming-cases.json, so change
 * them together.
 *
 * Each word is attributed to the one axis that is constant wherever the word appears and varies across
 * the font. An axis that varies in the selection becomes "low-high"; one that doesn't shows its word
 * once, or nothing when that value has no word. A value with no word takes its STAT label, else a
 * default word, else "<tag><value>". Parts follow the order the font's names use; words shared by every
 * selected name and owned by no axis stay before or after them.
 *
 * @param selected - The selected named instances
 * @param instances - Every named instance of the font
 * @param axes - The font's axes (tag and default)
 * @param labels - STAT names by axis tag and numberKey(value), e.g. { wdth: { '100': 'Normal' } }
 */
export function rangeName(
	selected: FontInstance[],
	instances: FontInstance[],
	axes: Array<{ tag: string; default: number }>,
	labels: Record<string, Record<string, string>> = {},
): string {
	if (!selected.length) return ''
	if (selected.length === 1) return selected[0].name
	const defaults = Object.fromEntries(axes.map((a) => [a.tag, a.default]))
	const tags = axes.map((a) => a.tag)
	const coord = (inst: FontInstance, tag: string) => inst.coordinates[tag] ?? defaults[tag]
	const varying = tags.filter((t) => new Set(instances.map((i) => coord(i, t))).size > 1)

	const ownerCache = new Map<string, string | null>()
	const owner = (word: string): string | null => {
		if (!ownerCache.has(word)) {
			const having = instances.filter((i) => words(i.name).includes(word))
			const cands = having.length ? varying.filter((t) => new Set(having.map((i) => coord(i, t))).size === 1) : []
			ownerCache.set(word, cands.length === 1 ? cands[0] : null)
		}
		return ownerCache.get(word)!
	}
	const label = (tag: string, value: number) => {
		const at = instances.filter((i) => coord(i, tag) === value)
		if (!at.length) return ''
		return words(at[0].name).filter((w) => owner(w) === tag && at.every((i) => words(i.name).includes(w))).join(' ')
	}
	const fallback = (tag: string, value: number) =>
		labels[tag]?.[numberKey(value)] || DEFAULT_AXIS_WORDS[tag] || `${tag}${numberKey(value)}`

	const ownedAxes = (inst: FontInstance) => new Set(words(inst.name).map(owner).filter((t): t is string => t !== null))
	const rich = instances.filter((i) => ownedAxes(i).size > 1)
	const orderFrom = rich.length ? rich : instances
	const axisPosition = (tag: string) => {
		const found = orderFrom.flatMap((i) => words(i.name).flatMap((w, k) => (owner(w) === tag ? [k] : [])))
		return found.length ? Math.min(...found) : 10_000
	}

	const parts: Array<[number, number, string]> = []
	tags.forEach((tag, order) => {
		const values = [...new Set(selected.map((i) => coord(i, tag)))].sort((a, b) => a - b)
		const lo = values[0], hi = values[values.length - 1]
		let text: string
		if (lo === hi) {
			text = label(tag, lo)
			if (!text) return
		} else {
			const a = label(tag, lo) || fallback(tag, lo)
			const b = label(tag, hi) || fallback(tag, hi)
			text = a === b ? a : `${a}-${b}`
		}
		parts.push([axisPosition(tag), order, text])
	})
	parts.sort((x, y) => x[0] - y[0] || x[1] - y[1])

	const firstWords = words(selected[0].name)
	const shared = firstWords.filter((w) => owner(w) === null && selected.every((i) => words(i.name).includes(w)))
	const ownedPositions = firstWords.flatMap((w, k) => (owner(w) !== null ? [k] : []))
	const firstOwned = ownedPositions.length ? Math.min(...ownedPositions) : firstWords.length
	const before = shared.filter((w) => firstWords.indexOf(w) < firstOwned)
	const after = shared.filter((w) => firstWords.indexOf(w) >= firstOwned)
	const name = [...before, ...parts.map((p) => p[2]), ...after].join(' ').trim()
	return name || `${selected[0].name}-${selected[selected.length - 1].name}`
}
