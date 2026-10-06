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
