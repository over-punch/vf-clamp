// Unit tests for planOutputs / unboughtInstances — purchase-safe grouping of selected named instances.
import { describe, it, expect } from 'vitest'
import { planOutputs, unboughtInstances } from '../core/plan'
import type { FontInstancesResult } from '../core/types'

/** A one-axis weight family, Thin–Black. */
const WEIGHTS: FontInstancesResult = {
	axes: [{ tag: 'wght', name: 'Weight', minimum: 100, default: 400, maximum: 900 }],
	instances: ['Thin', 'ExtraLight', 'Light', 'Regular', 'Medium', 'SemiBold', 'Bold', 'ExtraBold', 'Black']
		.map((name, i) => ({ name, coordinates: { wght: (i + 1) * 100 } })),
}

/** A two-axis family: three widths × Regular/Bold. */
const WIDTHS: FontInstancesResult = {
	axes: [
		{ tag: 'wght', name: 'Weight', minimum: 400, default: 400, maximum: 700 },
		{ tag: 'wdth', name: 'Width', minimum: 75, default: 100, maximum: 125 },
	],
	instances: [75, 100, 125].flatMap((wdth) => [
		{ name: `W${wdth} Regular`, coordinates: { wght: 400, wdth } },
		{ name: `W${wdth} Bold`, coordinates: { wght: 700, wdth } },
	]),
}

describe('planOutputs', () => {
	it('merges a contiguous run into one output', () => {
		expect(planOutputs(WEIGHTS, ['Bold', 'Regular', 'SemiBold', 'Medium'])).toEqual([
			{ name: 'Regular-Bold', instances: ['Regular', 'Medium', 'SemiBold', 'Bold'] },
		])
	})

	it('splits a selection with unbought styles between them', () => {
		expect(planOutputs(WEIGHTS, ['Regular', 'Bold'])).toEqual([
			{ name: 'Regular', instances: ['Regular'] },
			{ name: 'Bold', instances: ['Bold'] },
		])
	})

	it('keeps two runs separate and sorted', () => {
		const out = planOutputs(WEIGHTS, ['Black', 'Light', 'ExtraBold', 'Regular'])
		expect(out.map((o) => o.name)).toEqual(['Light-Regular', 'ExtraBold-Black'])
	})

	it('prefixes the family name when given', () => {
		expect(planOutputs(WEIGHTS, ['Regular', 'Medium'], 'Encode Sans')[0].name).toBe('Encode Sans Regular-Medium')
	})

	it('merges across a second axis only when the rectangle is fully bought', () => {
		expect(planOutputs(WIDTHS, ['W75 Regular', 'W100 Regular'])).toHaveLength(1)
		expect(planOutputs(WIDTHS, ['W75 Regular', 'W100 Bold'])).toHaveLength(2)
	})

	it('throws on an unknown instance name', () => {
		expect(() => planOutputs(WEIGHTS, ['Heavy'])).toThrow('Named instance "Heavy" not found')
	})

	it('returns nothing for an empty selection', () => {
		expect(planOutputs(WEIGHTS, [])).toEqual([])
	})
})

describe('unboughtInstances', () => {
	it('lists the styles a Regular + Bold range would give away', () => {
		expect(unboughtInstances(WEIGHTS, ['Regular', 'Bold'])).toEqual(['Medium', 'SemiBold'])
	})

	it('is empty for a contiguous run', () => {
		expect(unboughtInstances(WEIGHTS, ['Regular', 'Medium', 'SemiBold', 'Bold'])).toEqual([])
	})
})

describe('ambiguous instance names', () => {
	/** Text and Display optical sizes that both name a "Bold". */
	const OPSZ: FontInstancesResult = {
		axes: [
			{ tag: 'wght', name: 'Weight', minimum: 400, default: 400, maximum: 700 },
			{ tag: 'opsz', name: 'Optical size', minimum: 14, default: 14, maximum: 32 },
		],
		instances: [14, 32].flatMap((opsz) => [
			{ name: 'Regular', coordinates: { wght: 400, opsz } },
			{ name: 'Bold', coordinates: { wght: 700, opsz } },
		]),
	}

	it('planOutputs refuses a name that matches more than one instance', () => {
		expect(() => planOutputs(OPSZ, ['Bold'])).toThrow(/ambiguous/)
	})

	it('unboughtInstances refuses an ambiguous name instead of guessing', () => {
		expect(() => unboughtInstances(OPSZ, ['Regular', 'Bold'])).toThrow(/ambiguous/)
	})
})
