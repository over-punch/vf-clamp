# summarize.py — the fields the parity harness compares for one clamped font: axes, instances and their PostScript names, STAT, name IDs, style bits, glyph count and one outline hash.
import json, sys, hashlib
from fontTools.ttLib import TTFont
def _outline_hash(f):
	"""Hash of the first letter-like glyph's default outline, or None (fonts name glyphs differently)."""
	if 'glyf' not in f:
		return None
	cmap = f.getBestCmap() or {}
	gname = cmap.get(ord('a')) or cmap.get(ord('H'))
	if not gname:
		return None
	coords, _, _ = f['glyf'][gname].getCoordinates(f['glyf'])
	return hashlib.md5(json.dumps([list(p) for p in coords]).encode()).hexdigest()[:8]


def summarize(path):
	f = TTFont(path); n = f['name']
	g = lambda i: n.getDebugName(i)
	out = {
		'fvar': [(a.axisTag, a.minValue, a.defaultValue, a.maxValue) for a in f['fvar'].axes] if 'fvar' in f else [],
		'instances': [g(i.subfamilyNameID) for i in f['fvar'].instances] if 'fvar' in f else [],
		'instancePS': [g(i.postscriptNameID) for i in f['fvar'].instances if i.postscriptNameID != 0xFFFF] if 'fvar' in f else [],
		'statAxes': [a.AxisTag for a in f['STAT'].table.DesignAxisRecord.Axis] if 'STAT' in f else [],
		'statValues': sorted(g(v.ValueNameID) or '?' for v in (f['STAT'].table.AxisValueArray.AxisValue if 'STAT' in f and f['STAT'].table.AxisValueArray else [])),
		'link0': any(v.Format == 3 and v.LinkedValue == 0 for v in (f['STAT'].table.AxisValueArray.AxisValue if 'STAT' in f and f['STAT'].table.AxisValueArray else [])),
		'names': {i: g(i) for i in (1, 2, 4, 6, 16, 17, 25)},
		'platforms': sorted({(r.platformID, r.nameID) for r in n.names if r.nameID in (1, 2, 4, 6)}),
		'fsSelection': {'italic': bool(f['OS/2'].fsSelection & 1), 'bold': bool(f['OS/2'].fsSelection & 0x20), 'regular': bool(f['OS/2'].fsSelection & 0x40), 'oblique': bool(f['OS/2'].fsSelection & 0x200)},
		'nameRecords3': sorted((r.nameID, r.toUnicode()) for r in n.names if r.platformID == 3 and r.nameID in (1,2,3,4,6,16,17,25)),
		'weightClass': f['OS/2'].usWeightClass,
		'macStyle': f['head'].macStyle & 3,
		'glyphs': len(f.getGlyphOrder()),
		'aOutline': _outline_hash(f),
	}
	return out
if __name__ == '__main__':
	print(json.dumps(summarize(sys.argv[1])))
