# gen-naming-cases.py — writes shared/naming-cases.json: real fonts' instances, axes and STAT labels plus selections and the
# expected range_name() result, so the Python module and its TypeScript twin (rangeName) are tested against the same cases.
# Usage: python3 scripts/gen-naming-cases.py <dir with Inter.ttf Montserrat.ttf RobotoItalic.ttf>   (Encode Sans comes from site/public/fonts)
import json, os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'shared', 'plugin-views'))
from fontTools.ttLib import TTFont
import vfclamp_naming as N

ROOT = os.path.join(os.path.dirname(__file__), '..')
FONT_DIR = sys.argv[1]
FONTS = {
	'Encode Sans': os.path.join(ROOT, 'site', 'public', 'fonts', 'EncodeSans.ttf'),
	'Inter': os.path.join(FONT_DIR, 'Inter.ttf'),
	'Montserrat': os.path.join(FONT_DIR, 'Montserrat.ttf'),
	'Roboto Italic': os.path.join(FONT_DIR, 'RobotoItalic.ttf'),
}
SELECTIONS = {
	'Encode Sans': [
		['SemiCondensed Thin', 'SemiCondensed ExtraLight', 'SemiCondensed Light', 'Thin', 'ExtraLight', 'Light'],
		['SemiCondensed Thin', 'Light'],
		['SemiCondensed Thin', 'SemiCondensed Light'],
		['Regular', 'Medium', 'SemiBold', 'Bold'],
		['SemiCondensed Regular', 'Regular'],
		['Condensed Bold', 'Expanded Bold'],
		['Condensed Thin', 'Expanded Black'],
		['Expanded Light'],
	],
	'Inter': [['Regular', 'Medium', 'SemiBold', 'Bold'], ['Thin', 'Black'], ['Bold']],
	'Montserrat': [['Light', 'Regular', 'Medium'], ['Thin', 'ExtraLight']],
	'Roboto Italic': [['Light Italic', 'Italic', 'Medium Italic']],
}
out = {'fonts': {}, 'cases': []}
for font, path in FONTS.items():
	inp = N.naming_inputs(TTFont(path))
	out['fonts'][font] = inp
	by_name = {i['name']: i for i in inp['instances']}
	for sel in SELECTIONS[font]:
		chosen = [by_name[n] for n in sel]
		out['cases'].append({'font': font, 'selected': sel, 'expected': N.range_name(chosen, inp['instances'], inp['axes'], inp['labels'])})
json.dump(out, open(os.path.join(ROOT, 'shared', 'naming-cases.json'), 'w'), indent='\t', ensure_ascii=False)
for c in out['cases']:
	print(f"{c['font']:13} {' + '.join(c['selected'][:2])}{' …' if len(c['selected']) > 2 else ''} -> {c['expected']}")
