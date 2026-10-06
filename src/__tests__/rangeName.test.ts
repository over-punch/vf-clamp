// rangeName() against shared/naming-cases.json — the same cases the Python range_name() and the plugins are checked with.
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { rangeName, numberKey } from '../core/utils.js'

const CASES = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../../shared/naming-cases.json'), 'utf8'))

describe('rangeName — shared cases', () => {
	for (const c of CASES.cases) {
		it(`${c.font}: ${c.selected.join(' + ')} → ${c.expected}`, () => {
			const font = CASES.fonts[c.font]
			const selected = c.selected.map((n: string) => font.instances.find((i: { name: string }) => i.name === n))
			expect(rangeName(selected, font.instances, font.axes, font.labels)).toBe(c.expected)
		})
	}
})

describe('numberKey', () => {
	it('matches Python number_key()', () => {
		expect(numberKey(100)).toBe('100')
		expect(numberKey(87.5)).toBe('87.5')
		expect(numberKey(-10)).toBe('-10')
	})
})
