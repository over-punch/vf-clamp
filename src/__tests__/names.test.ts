// Unit tests for PostScript-name generation: transliteration, length limit and uniqueness.
import { describe, it, expect } from 'vitest'
import { toPostScriptName, shortHash } from '../core/clamp.js'

describe('toPostScriptName', () => {
	it('joins words with hyphens', () => {
		expect(toPostScriptName('Encode Sans Regular-Bold')).toBe('Encode-Sans-Regular-Bold')
	})

	it('transliterates accented Latin instead of dropping letters', () => {
		expect(toPostScriptName('Été Grotesk')).toBe('Ete-Grotesk')
	})

	it('returns an empty string for names with no Latin letters (Python then falls back to the source name)', () => {
		expect(toPostScriptName('源ノ角ゴシック')).toBe('')
	})

	it('stays within 63 characters and keeps two long names distinct', () => {
		const a = toPostScriptName('Very Long Family Name Extended Condensed Display Text Regular-Bold A')
		const b = toPostScriptName('Very Long Family Name Extended Condensed Display Text Regular-Bold B')
		expect(a.length).toBeLessThanOrEqual(63)
		expect(b.length).toBeLessThanOrEqual(63)
		expect(a).not.toBe(b)
	})
})

describe('shortHash', () => {
	it('is six characters and stable', () => {
		expect(shortHash('Inter')).toHaveLength(6)
		expect(shortHash('Inter')).toBe(shortHash('Inter'))
		expect(shortHash('Inter')).not.toBe(shortHash('Inter '))
	})
})
