// src/core/plan.ts — purchase-safe grouping: turn a customer's selected named instances into clampFont outputs that never include an unbought named instance.
import type { AxisDefinition, FontInstance, FontInstancesResult, OutputConfig } from './types.js'
import { findInstance, rangeName } from './utils.js'

/** Per-axis min/max of a set of instances; axes an instance omits use the axis default. */
type Hull = Record<string, { min: number; max: number }>

/** Computes the per-axis hull of a group of instances. */
function hullOf(group: FontInstance[], axes: AxisDefinition[]): Hull {
	const h: Hull = {}
	for (const axis of axes) {
		const vals = group.map((i) => i.coordinates[axis.tag] ?? axis.default)
		h[axis.tag] = { min: Math.min(...vals), max: Math.max(...vals) }
	}
	return h
}

/** Returns the named instances that fall inside a hull but are not in the selected set (matched by instance, not name). */
export function unboughtInstancesInHull(hull: Hull, instances: FontInstance[], selected: Set<FontInstance>, axes: AxisDefinition[]): FontInstance[] {
	return instances.filter((inst) => {
		if (selected.has(inst)) return false
		return axes.every((axis) => {
			const v = inst.coordinates[axis.tag] ?? axis.default
			const r = hull[axis.tag]
			return !r || (v >= r.min && v <= r.max)
		})
	})
}

/** The axis with the widest user-space range — the primary sort key for groups. */
function primaryAxis(axes: AxisDefinition[]): AxisDefinition | undefined {
	return axes.reduce<AxisDefinition | undefined>((best, a) => (!best || a.maximum - a.minimum > best.maximum - best.minimum ? a : best), undefined)
}

/**
 * Groups a customer's selected named instances into clampFont outputs so that no output's range
 * contains a named instance the customer did not select.
 *
 * Selections merge into one output only when their combined range holds no unselected named
 * instance: Regular + Medium + SemiBold + Bold → one output; Regular + Bold alone → two outputs
 * (each pinned to its own instance). Output names come from rangeName() (one range per axis), optionally prefixed
 * with `family`.
 *
 * @param font - The font's axes and named instances, from getInstances()
 * @param selected - Names of the instances the customer bought (must match exactly)
 * @param family - Optional family name to prefix each output name with, e.g. "Encode Sans"
 * @returns OutputConfig entries ready for clampFont(), sorted along the primary axis
 * @throws If a selected name is not a named instance of the font, or names more than one (ambiguous)
 */
export function planOutputs(font: FontInstancesResult, selected: string[], family?: string): OutputConfig[] {
	const { axes, instances } = font
	const picked: FontInstance[] = [...new Set(selected)].map((name) => findInstance(name, instances))
	if (!picked.length) return []
	const chosen = new Set(picked)

	// One group if the whole selection is clean; otherwise greedy pairwise merging of clean pairs.
	let buckets: FontInstance[][]
	if (!unboughtInstancesInHull(hullOf(picked, axes), instances, chosen, axes).length) {
		buckets = [picked]
	} else {
		buckets = picked.map((i) => [i])
		let merged = true
		while (merged) {
			merged = false
			outer: for (let i = 0; i < buckets.length; i++) {
				for (let j = i + 1; j < buckets.length; j++) {
					const combined = [...buckets[i], ...buckets[j]]
					if (!unboughtInstancesInHull(hullOf(combined, axes), instances, chosen, axes).length) {
						buckets[i] = combined
						buckets.splice(j, 1)
						merged = true
						break outer
					}
				}
			}
		}
	}

	// Sort instances within each group, then groups, along the primary axis (ties broken by the other axes).
	const primary = primaryAxis(axes)
	const order = primary ? [primary, ...axes.filter((a) => a.tag !== primary.tag)] : axes
	const cmp = (a: FontInstance, b: FontInstance) => {
		for (const axis of order) {
			const d = (a.coordinates[axis.tag] ?? axis.default) - (b.coordinates[axis.tag] ?? axis.default)
			if (d) return d
		}
		return 0
	}
	buckets = buckets.map((g) => [...g].sort(cmp)).sort((a, b) => cmp(a[0], b[0]))

	return buckets.map((g) => {
		const range = rangeName(g, instances, axes, font.labels ?? {})
		return { name: family ? `${family} ${range}` : range, instances: g.map((i) => i.name) }
	})
}

/**
 * Lists the named instances that a single output built from `names` would include without being selected,
 * e.g. ['Medium', 'SemiBold'] for Regular + Bold. An empty array means the output is purchase-safe.
 *
 * @param font - The font's axes and named instances, from getInstances()
 * @param names - The instance names one output would hull
 */
export function unboughtInstances(font: FontInstancesResult, names: string[]): string[] {
	const group = names.map((n) => findInstance(n, font.instances))
	if (!group.length) return []
	return unboughtInstancesInHull(hullOf(group, font.axes), font.instances, new Set(group), font.axes).map((i) => i.name)
}
