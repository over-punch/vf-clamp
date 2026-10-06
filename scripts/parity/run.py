# run.py — parity harness: runs the same fonts and purchases through every vf-clamp implementation and diffs the output tables.
#
# Usage (from vfClamp/): python3 scripts/parity/run.py <fonts-dir> [--glyphs DIR] [--robofont DIR] [--npm DIST ...]
#   <fonts-dir> holds Inter.ttf, Montserrat.ttf, RobotoFlex.ttf and RobotoItalic.ttf (google/fonts; see CASES).
#   --glyphs   a Glyphs plugin bundle's parent dir (default: plugins/glyphs; or an unzipped release)
#   --robofont a RoboFont extension's parent dir  (default: plugins/robofont; or an unzipped release)
#   --npm      one or more vf-clamp dist/index.cjs files to compare (default: dist/index.cjs; add a .vsix's copy)
# Exit 1 on any difference outside ALLOWED. The target is zero (tool-talk skill, section 1b).
import argparse, json, os, re, subprocess, sys, tempfile, types

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, HERE)
from summarize import summarize  # noqa: E402

ap = argparse.ArgumentParser()
ap.add_argument('fonts')
ap.add_argument('--glyphs', default=os.path.join(ROOT, 'plugins', 'glyphs'))
ap.add_argument('--robofont', default=os.path.join(ROOT, 'plugins', 'robofont'))
ap.add_argument('--npm', nargs='+', default=[os.path.join(ROOT, 'dist', 'index.cjs')])
args = ap.parse_args()
F = args.fonts
E = os.path.join(ROOT, 'site', 'public', 'fonts', 'EncodeSans.ttf')

#: (id, font, picked instances, output name). Covers the cases section 1b of the skill requires.
CASES = [
	('inter-reg-bold4', f'{F}/Inter.ttf', ['Regular', 'Medium', 'SemiBold', 'Bold'], 'Parity Inter'),
	('inter-bold', f'{F}/Inter.ttf', ['Bold'], 'Parity Inter'),
	('inter-semibold', f'{F}/Inter.ttf', ['SemiBold'], 'Parity Inter'),
	('inter-ete', f'{F}/Inter.ttf', ['Regular', 'Bold'], 'Été Grotesk'),
	('inter-cjk', f'{F}/Inter.ttf', ['Regular', 'Bold'], '源ノ角ゴシック'),
	('inter-long', f'{F}/Inter.ttf', ['Regular', 'Bold'], 'Aaaaaaaaaa Bbbbbbbbbb Cccccccccc Dddddddddd Eeeeeeeeee Ffffffffff Gggggggggg H'),
	('mont-bold', f'{F}/Montserrat.ttf', ['Bold'], 'Test Sans'),
	('mont-light-medium', f'{F}/Montserrat.ttf', ['Light', 'Regular', 'Medium'], 'Test Sans'),
	('flex-bold-italic', f'{F}/RobotoFlex.ttf', ['Bold Italic'], 'Test Flex'),
	('ital-cond-semibold', f'{F}/RobotoItalic.ttf', ['Condensed SemiBold Italic'], 'Test Italic'),
	('ital-range', f'{F}/RobotoItalic.ttf', ['Light Italic', 'Italic', 'Medium Italic'], 'Test Italic'),
	('encode-multi', E, ['SemiCondensed Thin', 'SemiCondensed ExtraLight', 'SemiCondensed Light', 'Thin', 'ExtraLight', 'Light'], 'Encode Sans SemiCondensed-Normal Thin-Light'),
	('encode-reg-bold4', E, ['Regular', 'Medium', 'SemiBold', 'Bold'], 'Parity Encode'),
]
FIELDS = ['fvar', 'instancePS', 'statAxes', 'statValues', 'link0', 'names', 'nameRecords3', 'fsSelection', 'weightClass', 'macStyle', 'glyphs', 'aOutline']
#: Deliberate differences (docs/NAMING.md): RoboFont bumps the font revision (nameID 3's version); Glyphs drops unticked in-range instances.
GLYPHS_SKIP = {'instancePS'}
OUT = tempfile.mkdtemp(prefix='vfclamp-parity-')


def run_python():
	"""Run the Glyphs core and the RoboFont controller (vanilla stubbed) on every case."""
	sys.path.insert(0, os.path.join(args.glyphs, 'vf-clamp.glyphsPlugin', 'Contents', 'Resources'))
	import core as gcore
	class _A:
		def __init__(self, *a, **k): pass
		def __getattr__(self, n): return _A()
		def __call__(self, *a, **k): return _A()
	stub = types.ModuleType('vanilla'); stub.__getattr__ = lambda n: _A; sys.modules.setdefault('vanilla', stub)
	sys.path.insert(0, os.path.join(args.robofont, 'vf-clamp.roboFontExt', 'lib'))
	from vfClamp import controller as rc
	from fontTools.ttLib import TTFont
	res = {}
	for cid, font, picks, family in CASES:
		res[cid] = {}
		out = os.path.join(OUT, f'glyphs-{cid}.ttf')
		try:
			gcore.produce_restricted_vf(font, picks, family, out, 'TTF'); res[cid]['glyphs'] = summarize(out)
		except Exception as e:
			res[cid]['glyphs'] = {'error': str(e)}
		out = os.path.join(OUT, f'robofont-{cid}.ttf')
		try:
			f = TTFont(font)
			labels = [rc._get_instance_label(f['name'], inst, i) for i, inst in enumerate(f['fvar'].instances)]
			rc.produce_restricted_vf(f, [labels.index(p) for p in picks], family, out, overwrite=True); res[cid]['robofont'] = summarize(out)
		except Exception as e:
			res[cid]['robofont'] = {'error': str(e)}
	return res


def run_npm(dist, key):
	"""Run one vf-clamp build (dist/index.cjs) on every case through Node."""
	js = f"""
const {{ clampFont }} = require({json.dumps(dist)}); const fs = require('fs')
const cases = {json.dumps([{'id': c[0], 'font': c[1], 'picks': c[2], 'family': c[3]} for c in CASES], ensure_ascii=False)}
;(async () => {{ for (const c of cases) {{ try {{
	const [r] = await clampFont(fs.readFileSync(c.font), {{ outputs: [{{ name: c.family, instances: c.picks }}], format: 'ttf' }})
	fs.writeFileSync({json.dumps(OUT)} + '/{key}-' + c.id + '.ttf', r.buffer)
}} catch (e) {{ console.error(c.id, e.message) }} }} }})()
"""
	subprocess.run(['node', '-e', js], check=True, stderr=subprocess.DEVNULL)


results = run_python()
npm_keys = []
for i, dist in enumerate(args.npm):
	key = f'npm{i}'; npm_keys.append(key); run_npm(dist, key)
	for cid, *_ in CASES:
		try: results[cid][key] = summarize(os.path.join(OUT, f'{key}-{cid}.ttf'))
		except Exception as e: results[cid][key] = {'error': str(e)}

def norm(fld, value):
	v = json.dumps(value, ensure_ascii=False)
	return re.sub(r'\[3, "\d+\.\d+;', '[3, "V;', v) if fld == 'nameRecords3' else v

diffs = 0
for cid, *_ in CASES:
	r = results[cid]
	for k, v in r.items():
		if 'error' in v: diffs += 1; print('ERROR', cid, k, v['error'][:150])
	for fld in FIELDS:
		vals = {k: norm(fld, v.get(fld)) for k, v in r.items() if 'error' not in v and not (k == 'glyphs' and fld in GLYPHS_SKIP)}
		if len(set(vals.values())) > 1:
			diffs += 1; print('DIFF', cid, fld); [print('   ', k, v[:200]) for k, v in vals.items()]
print(f'{len(CASES)} cases x {len(FIELDS)} fields x {2 + len(npm_keys)} implementations: {diffs} difference(s) outside the allow-list')
sys.exit(1 if diffs else 0)
