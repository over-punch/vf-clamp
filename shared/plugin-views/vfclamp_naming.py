# vfclamp_naming.py — the single implementation of vf-clamp's naming, style-bit and STAT clean-up rules (docs/NAMING.md), shared by the npm package (run in Pyodide), the Glyphs plugin and the RoboFont extension.
#
# Canonical copy: vfClamp/shared/plugin-views/vfclamp_naming.py. The plugins get byte-identical copies via
# `npm run sync-plugin-views`; the npm package imports this file's text at build time. Never edit a copy.
# Pure fontTools: no Glyphs, RoboFont or AppKit imports.

import re
import unicodedata

#: OS/2.fsSelection bits this module owns.
FS_ITALIC = 0x01
FS_BOLD = 0x20
FS_REGULAR = 0x40
FS_OBLIQUE = 0x200
#: head.macStyle bits this module owns.
MAC_BOLD = 0x01
MAC_ITALIC = 0x02

#: Label for an axis value that has no word in the font's style names (e.g. wdth 100 in "Light").
DEFAULT_AXIS_WORDS = {'wght': 'Regular', 'wdth': 'Normal', 'ital': 'Upright', 'slnt': 'Upright'}

#: The four style-linking (RIBBI) subfamily names.
RIBBI = ('Regular', 'Italic', 'Bold', 'Bold Italic')


def short_hash(text):
	"""Six-character FNV-1a hash of a string, base 36; identical to shortHash() in the npm package."""
	h = 0x811c9dc5
	for ch in text:
		h ^= ord(ch)
		h = (h * 0x01000193) & 0xFFFFFFFF
	digits = '0123456789abcdefghijklmnopqrstuvwxyz'
	out = ''
	while h:
		h, rem = divmod(h, 36)
		out = digits[rem] + out
	return (out or '0').rjust(6, '0')[-6:]


def ps_name(text, max_len=63):
	"""PostScript name (nameID 6): accents transliterated, [A-Za-z0-9-] only, at most 63 characters.

	Over 63 characters, a readable prefix plus a hash of the full text keeps names unique. Text with
	letters in another script becomes 'Font-<hash>' (never the source font's name); text with no
	letters at all becomes 'Font'.
	"""
	ascii_text = unicodedata.normalize('NFKD', text or '').encode('ascii', 'ignore').decode('ascii')
	s = re.sub(r'[^A-Za-z0-9 -]', '', ascii_text).strip()
	s = re.sub(r'\s+', '-', s)
	s = re.sub(r'-+', '-', s).strip('-')
	if not s:
		return f'Font-{short_hash(text)}' if any(c.isalpha() for c in (text or '')) else 'Font'
	if len(s) > max_len:
		s = f'{s[:max_len - 7].rstrip("-")}-{short_hash(text)}'
	return s


def vf_prefix(ps, family):
	"""Variations PostScript Name Prefix (nameID 25): ASCII letters and digits only (OpenType spec), at most 27."""
	alnum = re.sub(r'[^A-Za-z0-9]', '', ps)
	if not alnum:
		return 'Font'
	if len(alnum) > 27:
		return alnum[:21] + short_hash(family)
	return alnum


def full_name(family, style):
	"""Full name (nameID 4): family plus style, leaving out 'Regular' and a style the family name already ends with."""
	if not style or style == 'Regular' or family.lower().endswith(style.lower()):
		return family
	return f'{family} {style}'


def number_key(value):
	"""Stable text key for an axis value, identical in Python and JavaScript ('100', '87.5')."""
	return ('%f' % float(value)).rstrip('0').rstrip('.')


# ---------------------------------------------------------------------------
# Inputs read from the source font (before instancing)
# ---------------------------------------------------------------------------

def source_style_info(font):
	"""What the style rules need to know about the source: its italic/oblique bits and whether ital/slnt exist."""
	fs = font['OS/2'].fsSelection if 'OS/2' in font else 0
	tags = {ax.axisTag for ax in font['fvar'].axes} if 'fvar' in font else set()
	return {'italic': bool(fs & FS_ITALIC), 'oblique': bool(fs & FS_OBLIQUE), 'has_ital_slnt': bool(tags & {'ital', 'slnt'})}


def naming_inputs(font):
	"""Instances, axes and STAT labels of a source font, in the shape range_name() takes."""
	name = font['name']
	axes = [{'tag': ax.axisTag, 'default': ax.defaultValue} for ax in font['fvar'].axes] if 'fvar' in font else []
	instances = [
		{'name': name.getDebugName(inst.subfamilyNameID) or '', 'coordinates': dict(inst.coordinates)}
		for inst in (font['fvar'].instances if 'fvar' in font else [])
	]
	labels = {}
	if 'STAT' in font and font['STAT'].table.AxisValueArray:
		stat = font['STAT'].table
		tags = [a.AxisTag for a in stat.DesignAxisRecord.Axis]
		for av in stat.AxisValueArray.AxisValue:
			if av.Format in (1, 2, 3) and av.AxisIndex < len(tags):
				value = av.NominalValue if av.Format == 2 else av.Value
				labels.setdefault(tags[av.AxisIndex], {})[number_key(value)] = name.getDebugName(av.ValueNameID) or ''
	return {'instances': instances, 'axes': axes, 'labels': labels}


# ---------------------------------------------------------------------------
# Default output name for a selection
# ---------------------------------------------------------------------------

def _words(text):
	"""Whitespace-separated words of a style name."""
	return [w for w in (text or '').split() if w]


def range_name(selected, instances, axes, labels=None):
	"""Default name for a selection of named instances: one range per axis, in the font's own style words.

	Each word in the font's style names is attributed to the one axis that is constant wherever the word
	appears and varies across the font ("SemiCondensed" -> wdth, "Thin" -> wght). An axis that varies in
	the selection becomes "low-high" ("SemiCondensed-Normal", "Thin-Light"); an axis that doesn't shows
	its word once, or nothing when that value has no word. A value with no word (wdth 100 in "Light")
	takes its STAT name ("Normal"), else a default word, else "<tag><value>". Parts follow the order the
	words appear in the font's names; words shared by every selected name and owned by no axis (a family prefix,
	"Italic" in an italic-only font) stay in place before or after them.

	``selected``/``instances``: dicts with 'name' and 'coordinates'; ``axes``: dicts with 'tag' and
	'default'; ``labels``: {tag: {number_key(value): name}} from STAT. Mirrored by rangeName() in
	TypeScript; both are checked against shared/naming-cases.json.
	"""
	if not selected:
		return ''
	if len(selected) == 1:
		return selected[0]['name']
	labels = labels or {}
	defaults = {a['tag']: a['default'] for a in axes}
	tags = [a['tag'] for a in axes]

	def coord(inst, tag):
		return inst['coordinates'].get(tag, defaults.get(tag))

	varying = [t for t in tags if len({coord(i, t) for i in instances}) > 1]

	owner_cache = {}

	def owner(word):
		if word not in owner_cache:
			having = [i for i in instances if word in _words(i['name'])]
			cands = [t for t in varying if len({coord(i, t) for i in having}) == 1] if having else []
			owner_cache[word] = cands[0] if len(cands) == 1 else None
		return owner_cache[word]

	def label(tag, value):
		at = [i for i in instances if coord(i, tag) == value]
		if not at:
			return ''
		common = [w for w in _words(at[0]['name']) if owner(w) == tag and all(w in _words(i['name']) for i in at)]
		return ' '.join(common)

	def fallback(tag, value):
		stat = labels.get(tag, {}).get(number_key(value))
		if stat:
			return stat
		return DEFAULT_AXIS_WORDS.get(tag) or f'{tag}{number_key(value)}'

	# Axis order follows the font's own names: positions come from names carrying words for two or more
	# axes ("SemiCondensed Thin" puts width before weight); a plain "Thin" says nothing about order.
	def owned_axes(inst):
		return {owner(w) for w in _words(inst['name'])} - {None}

	rich = [i for i in instances if len(owned_axes(i)) > 1] or instances

	def axis_position(tag):
		found = [k for i in rich for k, w in enumerate(_words(i['name'])) if owner(w) == tag]
		return min(found) if found else 10_000

	parts = []
	for order, tag in enumerate(tags):
		values = sorted({coord(i, tag) for i in selected})
		lo, hi = values[0], values[-1]
		if lo == hi:
			text = label(tag, lo)
			if not text:
				continue
		else:
			a = label(tag, lo) or fallback(tag, lo)
			b = label(tag, hi) or fallback(tag, hi)
			text = a if a == b else f'{a}-{b}'
		parts.append((axis_position(tag), order, text))
	parts.sort()

	first_words = _words(selected[0]['name'])
	shared = [w for w in first_words if owner(w) is None and all(w in _words(i['name']) for i in selected)]
	owned_positions = [k for k, w in enumerate(first_words) if owner(w) is not None]
	first_owned = min(owned_positions) if owned_positions else len(first_words)
	before = [w for w in shared if first_words.index(w) < first_owned]
	after = [w for w in shared if first_words.index(w) >= first_owned]
	name = ' '.join(before + [p[2] for p in parts] + after).strip()
	return name or f'{selected[0]["name"]}-{selected[-1]["name"]}'


# ---------------------------------------------------------------------------
# Rules applied to the clamped font (after instancing)
# ---------------------------------------------------------------------------

_WIDTH_CLASSES = ((62.5, 1), (75.0, 2), (87.5, 3), (100.0, 4), (112.5, 5), (125.0, 6), (150.0, 7), (200.0, 8))


def location_after(font, pinned):
	"""The clamped font's default location: remaining fvar defaults plus the values of pinned axes."""
	loc = {ax.axisTag: ax.defaultValue for ax in font['fvar'].axes} if 'fvar' in font else {}
	for tag, value in (pinned or {}).items():
		loc.setdefault(tag, value)
	return loc


def unlink_out_of_range_stat(font, location):
	"""Turn STAT Format 3 values whose LinkedValue the clamped font can't reach into Format 1 (same name, no link)."""
	if 'STAT' not in font or not font['STAT'].table.AxisValueArray:
		return
	stat = font['STAT'].table
	tags = [a.AxisTag for a in stat.DesignAxisRecord.Axis]
	ranges = {ax.axisTag: (ax.minValue, ax.maxValue) for ax in font['fvar'].axes} if 'fvar' in font else {}
	for av in stat.AxisValueArray.AxisValue:
		if av.Format != 3 or av.AxisIndex >= len(tags):
			continue
		tag = tags[av.AxisIndex]
		if tag in ranges:
			lo, hi = ranges[tag]
			reachable = lo <= av.LinkedValue <= hi
		elif tag in location:
			reachable = av.LinkedValue == location[tag]
		else:
			continue
		if not reachable:
			av.Format = 1
			del av.LinkedValue


def apply_style_bits(font, location, source):
	"""Set usWeightClass/usWidthClass, fsSelection and macStyle from the clamped font's default location.

	BOLD from weight 700; ITALIC from ital >= 0.5 or slnt < 0 (OBLIQUE as well for a slant without ital);
	with neither axis in the source, the source's italic/oblique bits are kept. REGULAR only when none of
	BOLD, ITALIC or OBLIQUE is set. Returns (is_bold, is_italic).
	"""
	if 'OS/2' not in font:
		return False, False
	os2 = font['OS/2']
	wght, wdth = location.get('wght'), location.get('wdth')
	if wght is not None:
		os2.usWeightClass = max(1, min(1000, int(round(wght))))
	if wdth is not None:
		os2.usWidthClass = next((cls for edge, cls in _WIDTH_CLASSES if wdth < edge), 9)
	if source.get('has_ital_slnt'):
		ital, slnt = location.get('ital'), location.get('slnt')
		is_italic = (ital is not None and ital >= 0.5) or (slnt is not None and slnt < 0)
		is_oblique = slnt is not None and slnt < 0 and not (ital is not None and ital >= 0.5)
	else:
		is_italic, is_oblique = source.get('italic', False), source.get('oblique', False)
	is_bold = os2.usWeightClass >= 700
	fs = os2.fsSelection & ~(FS_ITALIC | FS_BOLD | FS_REGULAR | FS_OBLIQUE)
	if is_italic or is_oblique:
		fs |= FS_ITALIC
	if is_oblique:
		fs |= FS_OBLIQUE
	if is_bold:
		fs |= FS_BOLD
	if not (is_bold or is_italic or is_oblique):
		fs |= FS_REGULAR
	os2.fsSelection = fs
	if 'head' in font:
		mac = font['head'].macStyle & ~(MAC_BOLD | MAC_ITALIC)
		font['head'].macStyle = mac | (MAC_BOLD if is_bold else 0) | (MAC_ITALIC if (is_italic or is_oblique) else 0)
	return is_bold, (is_italic or is_oblique)


def default_instance_style(font):
	"""Subfamily name of the named instance at the clamped font's default location, or None."""
	if 'fvar' not in font:
		return None
	defaults = {ax.axisTag: ax.defaultValue for ax in font['fvar'].axes}
	for inst in font['fvar'].instances:
		if all(abs(inst.coordinates.get(t, v) - v) < 0.01 for t, v in defaults.items()):
			return font['name'].getDebugName(inst.subfamilyNameID)
	return None


def apply_names(font, family, style=None, keep_mac=True, version=None):
	"""Write name IDs 1, 2, 3, 4, 6, 16/17, 25 and the named instances' PostScript names. Run after apply_style_bits.

	``family`` is the output name; blank raises ValueError. ``style`` is the picked instance's name for a
	single-style output; for a range it defaults to the instance at the new default location. nameID 2 is
	the RIBBI style matching OS/2; a non-RIBBI style (SemiBold) goes into 16/17, and for a static file
	into nameID 1 too ("Family SemiBold" + "Regular"), as the OpenType spec describes. A static file's
	PostScript name includes its style so two pins never collide.
	"""
	family = (family or '').strip()
	if not family:
		raise ValueError('vf-clamp: the output name is empty')
	name_table = font['name']
	existing = {r.nameID for r in name_table.names}
	static = 'fvar' not in font
	fs = font['OS/2'].fsSelection if 'OS/2' in font else FS_REGULAR
	is_bold, is_italic = bool(fs & FS_BOLD), bool(fs & FS_ITALIC)
	ribbi = ('Bold Italic' if is_italic else 'Bold') if is_bold else ('Italic' if is_italic else 'Regular')

	typo = (style or '').strip() or default_instance_style(font) or ribbi
	if is_italic and 'Italic' not in typo and 'Oblique' not in typo:
		typo = 'Italic' if typo == 'Regular' else f'{typo} Italic'
	core = ' '.join(w for w in typo.split() if w not in ('Italic', 'Oblique'))
	non_ribbi = core not in ('', 'Regular', 'Bold')

	name1 = family
	if static and non_ribbi and not family.lower().endswith(core.lower()):
		name1 = f'{family} {core}'
	ps_base = family if not static or typo == 'Regular' or family.lower().endswith(typo.lower()) else f'{family} {typo}'
	ps = ps_name(ps_base)
	prefix = vf_prefix(ps, family)
	if version is None:
		try:
			version = '%.3f' % font['head'].fontRevision
		except Exception:
			version = '1.000'

	updates = {
		1: name1,
		2: ribbi,
		3: f'{version};{ps};{family}',
		4: full_name(family, typo if static else ribbi),
		6: ps,
	}
	if 16 in existing or 17 in existing or non_ribbi:
		updates[16] = family
		updates[17] = typo
	if 25 in existing:
		updates[25] = prefix
	if 'fvar' in font:
		for inst in font['fvar'].instances:
			pid = getattr(inst, 'postscriptNameID', 0xFFFF)
			if pid in (None, 0xFFFF) or pid in updates:
				continue
			inst_style = re.sub(r'[^A-Za-z0-9-]', '', (name_table.getDebugName(inst.subfamilyNameID) or '').replace(' ', ''))
			updates[pid] = f'{prefix}-{inst_style}'[:63]

	english = {0, 0x0409}
	kept = []
	written = set()
	for record in name_table.names:
		if record.nameID not in updates:
			kept.append(record)
			continue
		if record.platformID in (1, 3) and record.langID not in english:
			continue  # stale localised name for an ID we're rewriting
		value = updates[record.nameID]
		if record.platformID in (0, 3):
			record.string = value.encode('utf-16-be')
		elif record.platformID == 1:
			if not keep_mac:
				continue
			try:
				record.string = value.encode('mac_roman')
			except (UnicodeEncodeError, LookupError):
				continue  # drop rather than write '?'
		kept.append(record)
		written.add((record.nameID, record.platformID))
	name_table.names = kept
	for name_id, value in updates.items():
		if (name_id, 3) not in written:
			name_table.setName(value, name_id, 3, 1, 0x0409)
	return updates


def finish(font, family, style, pinned, source, keep_mac=True):
	"""Everything after instancing, in order: STAT links, style bits, names. Returns the name updates."""
	location = location_after(font, pinned)
	unlink_out_of_range_stat(font, location)
	apply_style_bits(font, location, source)
	return apply_names(font, family, style, keep_mac=keep_mac)
