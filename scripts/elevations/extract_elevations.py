#!/usr/bin/env python3
"""Read exterior openings off a Champion L-101 sales sheet, or a Decatur
LIT-1 colour floor plan.

For each sheet (page 1): render the page, find the thick exterior wall outline,
walk each of the four walls for breaks in the thick wall, and label each break
as a window (a WWHH[E] code sits just outside it), a door, or a porch recess.
Dimensions come from the printed "LL'-L" x WW'-W"" line; the pixel scale is
checked against both printed dimensions so a bad read is flagged, not shipped.

LIT-1 sheets (the Prime series, Decatur) carry no window codes and their big
overall-dimension labels are drawn as outlines, not text. For those the box is
the thick wall rectangle itself, the scale comes from the plan's length in the
catalogue (passed in), a window is the thin-outlined box set into the wall
band, and an exterior door is a clean break with its leaf swung outward — the
dark leaf and arc just outside the wall are what tell the two apart. Run with
`--lit sizes.json` ({model: {"L": 76, "W": 16}}) to use this mode.
"""
import json, os, re, subprocess, sys, tempfile
from xml.etree import ElementTree as ET
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

DPI = 100
PX_PER_PT = DPI / 72.0
# LIT-1 sheets are read at a finer grain: the window symbol is a pair of thin
# lines that anti-aliasing washes out at 100 dpi
LIT_DPI = 150

CODE_RE = re.compile(r"^(?:(OPT\.?)\s*)?(T?)(\d{4})(E|SG|ESG|ES)?$", re.I)
DIM_RE = re.compile(r"^(\d+)'(?:-(\d+)\")?$")


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True, check=True).stdout


def words_on_page(pdf, px_per_pt=PX_PER_PT):
    """pdftotext -bbox words for page 1, in rendered-page px (handles /Rotate)."""
    xml = run(["pdftotext", "-f", "1", "-l", "1", "-bbox", pdf, "-"])
    xml = xml.replace('xmlns="http://www.w3.org/1999/xhtml"', "")
    root = ET.fromstring(xml)
    out = []
    for w in root.iter("word"):
        out.append({
            "t": (w.text or "").strip(),
            "x0": float(w.get("xMin")) * px_per_pt, "x1": float(w.get("xMax")) * px_per_pt,
            "y0": float(w.get("yMin")) * px_per_pt, "y1": float(w.get("yMax")) * px_per_pt,
        })
    return out


def merge_words(words, gap=4.0):
    """Join words that sit on one baseline with almost no gap ("30" "61" "E")."""
    words = sorted(words, key=lambda w: (round(w["y0"] / 3), w["x0"]))
    merged = []
    for w in words:
        if merged:
            m = merged[-1]
            same_line = abs(m["y0"] - w["y0"]) < 3 and abs(m["y1"] - w["y1"]) < 3
            plain = re.match(r"^[A-Za-z0-9.]+$", m["t"]) and re.match(r"^[A-Za-z0-9.]+$", w["t"])
            if same_line and plain and -2.5 <= w["x0"] - m["x1"] <= gap and (len(m["t"]) + len(w["t"])) <= 12:
                m["t"] += w["t"]; m["x1"] = w["x1"]
                continue
        merged.append(dict(w))
    # rotated text comes out as stacked fragments ("36" above "30" for a code
    # that reads upward); join narrow fragments that share a column
    narrow = [w for w in merged if (w["x1"] - w["x0"]) < 14 and re.match(r"^[A-Z0-9]+$", w["t"], re.I)]
    narrow.sort(key=lambda w: (round(w["x0"] / 3), w["y0"]))
    used, stacks = set(), []
    for i, w in enumerate(narrow):
        if i in used:
            continue
        chain = [w]; used.add(i)
        for j in range(i + 1, len(narrow)):
            v = narrow[j]
            if j in used:
                continue
            last = chain[-1]
            if abs(v["x0"] - last["x0"]) < 3 and abs(v["x1"] - last["x1"]) < 3 and -2 <= v["y0"] - last["y1"] <= 4:
                chain.append(v); used.add(j)
        if len(chain) > 1:
            stacks.append(chain)
    for chain in stacks:
        # reads upward (bottom fragment first) — Champion's end-wall labels
        text_up = "".join(c["t"] for c in reversed(chain))
        text_down = "".join(c["t"] for c in chain)
        text = text_up if CODE_RE.match(text_up) or not CODE_RE.match(text_down) else text_down
        merged.append({"t": text, "x0": min(c["x0"] for c in chain), "x1": max(c["x1"] for c in chain),
                       "y0": min(c["y0"] for c in chain), "y1": max(c["y1"] for c in chain), "stacked": True})
    return merged


def render(pdf, dpi=DPI):
    with tempfile.TemporaryDirectory() as d:
        run(["pdftoppm", "-r", str(dpi), "-f", "1", "-l", "1", "-gray", "-png", pdf, os.path.join(d, "p")])
        f = [x for x in os.listdir(d) if x.endswith(".png")][0]
        return Image.open(os.path.join(d, f)).convert("L")


DIMLABEL_RE = re.compile(r"^(\d+)'(?:-(\d+)\")?$")


def feet(label):
    m = DIMLABEL_RE.match(label)
    return int(m.group(1)) + int(m.group(2) or 0) / 12


def longest_run(line, tol=2):
    """Longest run of True in a 1-D bool array, bridging gaps up to `tol` px."""
    best, start, last = (0, 0, 0), None, None
    for i, v in enumerate(line):
        if v:
            if start is None:
                start = i
            elif i - last > tol + 1:
                if last - start > best[0]:
                    best = (last - start, start, last)
                start = i
            last = i
    if start is not None and last - start > best[0]:
        best = (last - start, start, last)
    return best  # (length, a, b)


def words_len_label(words):
    """The overall-length label's text (the biggest horizontal N' label)."""
    horiz = [w for w in words if DIMLABEL_RE.match(w["t"]) and (w["y1"] - w["y0"]) < 1.5 * (w["x1"] - w["x0"])]
    return max(horiz, key=lambda w: w["y1"] - w["y0"])["t"] if horiz else None


def find_box(img, words):
    """The box outline from the sheet's own dimension lines.

    The overall length label ("52'") sits above a dimension line whose arrow
    tips touch the box ends; the width label ("23'-4"", rotated) sits left of
    a vertical one. Those two lines give the box exactly; the thick wall
    band just inside them gives the wall thickness.
    """
    arr = np.array(img)
    dark = arr < 110
    H, W = dark.shape
    horiz = [w for w in words if DIMLABEL_RE.match(w["t"]) and (w["y1"] - w["y0"]) < (w["x1"] - w["x0"]) and w["y0"] < 0.6 * H]
    vert = [w for w in words if DIMLABEL_RE.match(w["t"]) and (w["y1"] - w["y0"]) > (w["x1"] - w["x0"])]
    if not horiz or not vert:
        return None, "no dimension labels"
    L = max(horiz, key=lambda w: w["y1"] - w["y0"])
    Wl = max(vert, key=lambda w: w["y1"] - w["y0"])
    # horizontal dimension line: the longest dark run in the rows under the label
    best = (0, 0, 0, 0)
    for y in range(int(L["y0"]), min(int(L["y1"]) + 110, H)):
        n, a, b = longest_run(dark[y])
        if n > best[0]:
            best = (n, a, b, y)
    n, xa, xb, ydim = best
    if n < 150:
        return None, "no length dimension line"
    # vertical dimension line: the longest dark run in the columns right of the label
    # the vertical line sits left of the box and below the length dimension line
    # (an option inset drawn above the plan has walls that would otherwise win)
    best = (0, 0, 0, 0)
    for x in range(int(Wl["x0"]), min(int(Wl["x1"]) + 110, W, xa - 2)):
        n, a, b = longest_run(dark[ydim + 2:, x])
        if n > best[0]:
            best = (n, a + ydim + 2, b + ydim + 2, x)
    n, ya, yb, xdim = best
    if n < 60:
        return None, "no width dimension line"
    x0, y0, x1, y1 = xa, ya, xb + 1, yb + 1
    # wall thickness: the dark run inward from the top face, sampled at many
    # positions; take a low percentile so hatching under the wall cannot inflate it
    runs = []
    for i in range(1, 40):
        x = int(x0 + i / 40 * (x1 - x0))
        col = dark[y0:y0 + 40, x]
        if col[:3].all():
            runs.append(int(np.argmin(col)) if not col.all() else 40)
    px_per_ft = (x1 - x0) / feet(L["t"])
    t = int(np.percentile(runs, 25)) if runs else 8
    t = int(min(max(t, 4), max(4, 0.8 * px_per_ft)))
    return (x0, y0, x1, y1, max(t, 4), feet(L["t"]), feet(Wl["t"])), None


def find_box_lit(img, length_ft):
    """The box on a LIT-1 colour floor plan.

    The overall dimension line above the plan is the one unbroken run that
    spans the box, arrow tip to arrow tip, so it gives x0..x1 exactly (the
    wall rows themselves are broken by every door and window). The long walls
    are then the first and last bands of several consecutive rows below it
    that are mostly ink across that span; a partition or the marriage line
    of a double-wide lies between them, and the heading rule and any option
    inset are far shorter than the span. The scale is the span over the
    catalogue length.
    """
    arr = np.array(img)
    dark = arr < 110
    H, W = dark.shape
    runs = [longest_run(dark[y], tol=3) for y in range(H)]
    # an image-only L-101 has a title-block frame around the whole page; a run
    # across (nearly) the full page width is that frame, never the plan
    frame = lambda y: runs[y][0] >= 0.96 * W  # noqa: E731
    # The dimension line is a long row with two thick walls of the same span
    # below it. A page frame, a title-block rule, the marriage line of a
    # double or an unbroken wall can be as long or longer, so every long row
    # is tried from the top down and the first whose walls match its span
    # wins: under a frame the plan's walls cover only part of the span.
    found = None
    for ydim in (y for y in range(H) if not frame(y) and runs[y][0] >= 0.3 * W):
        n, xa, xb = runs[ydim]
        x0, x1 = xa, xb + 1
        fill = dark[:, x0:x1].mean(axis=1)
        wall_rows = [y for y in range(ydim + 2, H) if fill[y] >= 0.55 and not frame(y)]
        if not wall_rows:
            continue
        groups, cur = [], [wall_rows[0]]
        for y in wall_rows[1:]:
            if y - cur[-1] <= 1:
                cur.append(y)
            else:
                groups.append(cur); cur = [y]
        groups.append(cur)
        thick = [g for g in groups if len(g) >= 3]
        if len(thick) < 2:
            continue
        ok = True
        for g in (thick[0], thick[-1]):
            cols = np.where(dark[g[0]:g[-1] + 1, x0:x1].any(axis=0))[0]
            if cols.size == 0 or (cols[-1] - cols[0]) < 0.9 * (x1 - x0):
                ok = False
        if ok:
            found = (ydim, x0, x1, thick[0], thick[-1])
            break
    if found is None:
        return None, "no dimension line with two thick walls of its span below it"
    ydim, x0, x1, top, bottom = found
    y0, y1 = top[0], bottom[-1] + 1
    # the end walls: tighten x0/x1 to the first/last column that is mostly ink
    # between the long walls. The vertical dimension's arrow tick can join the
    # horizontal line at a corner, so the run may start a few feet before the
    # wall; an end wall with a window still fills over 40% of its column.
    # The vertical dimension line is one full-height column at the far left,
    # so a wall is three such columns in a row, not one.
    colfill = dark[y0:y1, x0:x1].mean(axis=0)
    span = x1 - x0
    solid = colfill >= 0.4
    lefts = [i for i in range(0, span // 8) if solid[i:i + 3].all()]
    rights = [i for i in range(span - span // 8, span) if i >= 2 and solid[i - 2:i + 1].all()]
    nx0 = x0 + lefts[0] if lefts else x0
    nx1 = x0 + rights[-1] + 1 if rights else x1
    x0, x1 = nx0, nx1
    t = max(len(top), len(bottom))
    px_per_ft = (x1 - x0) / length_ft
    t = int(min(max(t, 4), max(4, 0.8 * px_per_ft)))
    width_ft = (y1 - y0) / px_per_ft
    return (x0, y0, x1, y1, t, float(length_ft), round(width_ft, 2)), None


def swing_outside(dark, box, wall, a, b, px_per_ft):
    """Dark ink just outside the wall over an opening: a door leaf swung out,
    or nothing for a window. Rows/columns carrying the dimension line (a run
    across most of the box) are ignored."""
    x0, y0, x1, y1, t = box
    reach = int(3.3 * px_per_ft)
    H, W = dark.shape
    total, hit = 0, 0
    if wall in ("top", "bottom"):
        lo, hi = x0 + a, x0 + b
        rows = range(max(0, y0 - reach), y0 - 1) if wall == "top" else range(y1 + 1, min(H, y1 + reach))
        for y in rows:
            if dark[y, x0:x1].sum() > 0.5 * (x1 - x0):
                continue
            seg = dark[y, lo:hi]
            total += seg.size; hit += int(seg.sum())
    else:
        lo, hi = y0 + a, y0 + b
        cols = range(max(0, x0 - reach), x0 - 1) if wall == "left" else range(x1 + 1, min(W, x1 + reach))
        for x in cols:
            if dark[y0:y1, x].sum() > 0.5 * (y1 - y0):
                continue
            seg = dark[lo:hi, x]
            total += seg.size; hit += int(seg.sum())
    return hit / total if total else 0.0


WINDOW_WIDTHS_IN = (24, 30, 36, 46, 60, 72)


def band_rows(dark, box, wall, a, b):
    """Ink per row across the wall band over the stretch [a, b) along it."""
    x0, y0, x1, y1, t = box
    if wall == "top":
        return dark[y0:y0 + t, x0 + a:x0 + b].mean(axis=1)
    if wall == "bottom":
        return dark[y1 - t:y1, x0 + a:x0 + b].mean(axis=1)
    if wall == "left":
        return dark[y0 + a:y0 + b, x0:x0 + t].mean(axis=0)
    return dark[y0 + a:y0 + b, x1 - t:x1].mean(axis=0)


def classify_lit(dark, box, wall, a, b, w_ft, c_ft, density, px_per_ft, opt=False, cad=False):
    """One break in a wall band, read from the stripes across the band.

    LIT-1 (Decatur colour plan): a door is an empty break (its leaf is drawn
    outside), a window symbol is thin lines with white between them, solid
    ink in every row is wall.
    CAD L-101 (`cad`, image-only Topeka sheet): a window symbol is two or
    three lines running the full width of the break; a door break carries at
    most a threshold line, its leaf and swing drawn beside the wall.
    Windows get a WWHH code from their width so the rest of the pipeline
    treats them like the coded ones; the height is Champion's 61" except the
    short kitchen window."""
    rows = band_rows(dark, box, wall, a, b)
    mn, mx = float(rows.min()), float(rows.max())
    full = int((rows >= 0.8).sum())
    # a window box is hollow: two full-width lines with light between them;
    # a door's threshold is one or two lines together
    idx = [i for i, v in enumerate(rows) if v >= 0.8]
    hollow = any(j - i >= 2 and float(rows[i + 1:j].min()) < 0.4 for i in idx for j in idx if j > i)
    sw = swing_outside(dark, box, wall, a, b, px_per_ft)
    at, w = round(c_ft, 2), round(w_ft, 2)
    base = {"at": at, "w": w, "density": round(density, 2), "rows": [round(mn, 2), round(mx, 2)], "full": full, "swing": round(sw, 3)}

    def window():
        win = min(WINDOW_WIDTHS_IN, key=lambda n: abs(n - w_ft * 12))
        hh = 36 if win <= 30 and density < 0.2 else 61
        return {"type": "window", "code": f"{win:02d}{hh:02d}", "egress": False, "opt": opt, "transom": False, **base}

    def door_like():
        if w_ft >= 7.5:
            return {"type": "open", **base}
        if w_ft >= 4.6:
            return {"type": "patio", "code": "7280", "opt": opt, **base}
        if w_ft >= 2.3:
            return {"type": "door", "opt": opt, **base}
        return {"type": "gap", **base}

    if cad:
        if mn >= 0.35:
            return {"type": "wall", **base}
        if hollow and w_ft >= 1.4:
            return window()
        return door_like()
    if mx < 0.15:
        return door_like()
    if mn < 0.35 and mx > 0.6 and w_ft >= 1.4:
        return window()
    if mn < 0.35 and w_ft >= 1.4:
        return {"type": "gap", **base}
    return {"type": "wall", **base}


OCR_DPI = 300


def ocr_label(hi, box, wall, a, b, px_per_ft, side="outside"):
    """Read the code printed by one opening on an image-only sheet: a window's
    just outside the wall, a door's inside beside its swing (`side`). `hi` is
    the page at OCR_DPI; the box and positions are in the LIT_DPI frame.
    Returns (label, opt_seen): the strip is upscaled and read with the
    characters a Champion code can contain, rotated upright for the end
    walls."""
    try:
        import pytesseract
    except ImportError:  # the pipeline still runs; those openings use the stripe test
        return None, False
    k = OCR_DPI / LIT_DPI
    x0, y0, x1, y1, t = box
    reach = 2.2 * px_per_ft
    slack = 0.6 * px_per_ft
    if side == "outside":
        if wall == "top":
            crop = (x0 + a - slack, y0 - reach, x0 + b + slack, y0 + 1)
        elif wall == "bottom":
            crop = (x0 + a - slack, y1 - 1, x0 + b + slack, y1 + reach)
        elif wall == "left":
            crop = (x0 - reach, y0 + a - slack, x0 + 1, y0 + b + slack)
        else:
            crop = (x1 - 1, y0 + a - slack, x1 + reach, y0 + b + slack)
    else:
        inner = 3.2 * px_per_ft
        if wall == "top":
            crop = (x0 + a - inner, y0 + t, x0 + b + inner, y0 + t + inner)
        elif wall == "bottom":
            crop = (x0 + a - inner, y1 - t - inner, x0 + b + inner, y1 - t)
        elif wall == "left":
            crop = (x0 + t, y0 + a - inner, x0 + t + inner, y0 + b + inner)
        else:
            crop = (x1 - t - inner, y0 + a - inner, x1 - t, y0 + b + inner)
    W, H = hi.size
    cx0, cy0, cx1, cy1 = (max(0, int(crop[0] * k)), max(0, int(crop[1] * k)), min(W, int(crop[2] * k)), min(H, int(crop[3] * k)))
    if cx1 - cx0 < 8 or cy1 - cy0 < 8:
        return None, False
    im = hi.crop((cx0, cy0, cx1, cy1))
    if wall == "left":
        im = im.rotate(-90, expand=True)  # labels on the left wall read upward
    elif wall == "right":
        im = im.rotate(90, expand=True)
    im = im.resize((im.width * 3, im.height * 3), Image.LANCZOS)
    cfg = ("--psm 7" if side == "outside" else "--psm 11") + " -c tessedit_char_whitelist=0123456789TESGOPTopt. "
    best, opt = None, False
    for angle in (0, 180) if wall in ("left", "right") else (0,):
        pic = im if angle == 0 else im.rotate(180)
        d = pytesseract.image_to_data(pic, config=cfg, output_type=pytesseract.Output.DICT)
        for i, txt in enumerate(d["text"]):
            txt = (txt or "").strip().replace(" ", "")
            conf = float(d["conf"][i])
            if conf < 45 or not txt:
                continue
            if re.match(r"^opt\.?$", txt, re.I):
                opt = True
                continue
            m = CODE_RE.match(txt)
            if m and txt not in ("1976", "2024", "2025", "2026") and (best is None or conf > best[0]):
                best = (conf, m)
    if best is None:
        return None, opt
    m = best[1]
    return {"opt": bool(m.group(1)) or opt, "transom": bool(m.group(2)), "code": m.group(3), "egress": "E" in (m.group(4) or "").upper()}, opt


def profile(dark, box, wall, outer=1.0):
    """Fraction of dark pixels across the wall band, per position along the
    wall. `outer` < 1 reads only that share of the band nearest the outside
    face: a LIT-1 wall is drawn thinner along some rooms, but its outer face
    is always flush with the box, and the window symbols sit at that face."""
    x0, y0, x1, y1, t = box
    tt = max(3, int(round(t * outer)))
    if wall == "top":
        band = dark[y0:y0 + tt, x0:x1]; return band.mean(axis=0)
    if wall == "bottom":
        band = dark[y1 - tt:y1, x0:x1]; return band.mean(axis=0)
    if wall == "left":
        band = dark[y0:y1, x0:x0 + tt]; return band.mean(axis=1)
    band = dark[y0:y1, x1 - tt:x1]; return band.mean(axis=1)


def openings(prof, solid=0.82, min_len=6):
    """Runs along the wall where the band is not solid wall."""
    weak = prof < solid
    runs, start = [], None
    for i, v in enumerate(weak):
        if v and start is None:
            start = i
        elif not v and start is not None:
            if i - start >= min_len:
                runs.append((start, i, float(prof[start:i].mean())))
            start = None
    if start is not None and len(weak) - start >= min_len:
        runs.append((start, len(weak), float(prof[start:].mean())))
    # merge runs separated by a sliver (window mullions, door jambs)
    merged = []
    for r in runs:
        if merged and r[0] - merged[-1][1] <= 3:
            a = merged[-1]; merged[-1] = (a[0], r[1], (a[2] + r[2]) / 2)
        else:
            merged.append(r)
    return merged


def parse_dims(words):
    """The printed 'LL'-L" x WW'-W"' line and the square footage."""
    dims, sqft, bedbath = None, None, None
    line_words = sorted(words, key=lambda w: (round(w["y0"] / 4), w["x0"]))
    for i, w in enumerate(line_words):
        if w["t"].lower() == "x" and i > 0 and i + 1 < len(line_words):
            a, b = line_words[i - 1], line_words[i + 1]
            ma, mb = DIM_RE.match(a["t"]), DIM_RE.match(b["t"])
            if ma and mb and abs(a["y0"] - w["y0"]) < 4 and abs(b["y0"] - w["y0"]) < 4:
                fa = int(ma.group(1)) + int(ma.group(2) or 0) / 12
                fb = int(mb.group(1)) + int(mb.group(2) or 0) / 12
                # length is the bigger number; the sheet prints length first
                cand = (max(fa, fb), min(fa, fb), w["y0"])
                if dims is None or cand[0] > dims[0]:
                    dims = cand
        if w["t"].lower() in ("sq.", "sq") and i > 0:
            m = re.match(r"^(\d{3,4})$", line_words[i - 1]["t"])
            if m:
                sqft = int(m.group(1))
        if re.match(r"^\d?bedroom$", w["t"].lower()) and i + 1 < len(line_words):
            bedbath = (w["t"], line_words[i + 1]["t"])
    return dims, sqft


def extract(pdf, model, size=None):
    """Read one sheet. Three shapes of sheet, one pipeline:

    l101        Topeka's L-101: the big dimension labels are text, so the box
                comes from them; windows carry WWHH codes.
    l101-nolabel the same drawing with the labels drawn as outlines (ten
                Aspire sheets, one Prime): the box comes from the dimension
                line and wall fill, the scale from the catalogue length in
                `size`, and the codes still classify every opening.
    lit1        Decatur's LIT-1 colour plan: box as above, no codes, so the
                stripes across the wall band tell windows from doors.
    `size` is {"L", "W", "sqft"?, "kind"?: "lit1"} from the catalogue; without
    it only the first shape can be read.
    """
    img = render(pdf, DPI)
    words = merge_words(words_on_page(pdf, DPI / 72.0))
    found, why = (None, "LIT-1 sheet") if (size or {}).get("kind") == "lit1" else find_box(img, words)
    mode = "l101"
    if found is None and size:
        img = render(pdf, LIT_DPI)
        words = merge_words(words_on_page(pdf, LIT_DPI / 72.0))
        found, why = find_box_lit(img, size["L"])
        mode = "lit1" if size.get("kind") == "lit1" else "l101-ocr"
    if found is None:
        return {"model": model, "ok": False, "why": why}
    lit = mode == "lit1"
    # an image-only L-101 has its codes as pixels: read each one by OCR over
    # its opening, from a sharper render
    hi = render(pdf, OCR_DPI) if mode == "l101-ocr" else None
    dark = np.array(img) < 110
    x0, y0, x1, y1, t, length_ft, width_ft = found
    box = (x0, y0, x1, y1, t)
    dims, sqft = parse_dims(words)
    if size and not sqft:
        sqft = size.get("sqft")
    px_per_ft = (x1 - x0) / length_ft
    dims_err = None
    if mode != "l101":
        # the drawn box is the actual width, about 10" under the nominal
        # (15'-2" for a 16-wide, 26'-8" for a 28-wide); far off means the
        # box finder caught something else
        ratio = width_ft / size["W"]
        scale_err = abs(ratio - 0.95)
    else:
        width_px_ft = (y1 - y0) / px_per_ft
        scale_err = abs(width_px_ft - width_ft) / width_ft
        if dims:
            dims_err = round(max(abs(dims[0] - length_ft) / length_ft, abs(dims[1] - width_ft) / width_ft), 3)

    # window codes: words that parse as a code, with their centres. "Opt" is
    # usually its own word, sitting just left of or just above the code.
    opt_words = [w for w in words if re.match(r"^opt\.?$", w["t"], re.I)]

    def has_opt(w):
        for o in opt_words:
            beside = abs(o["y0"] - w["y0"]) < 4 and -2 <= w["x0"] - o["x1"] <= 8
            x_overlap = o["x0"] < w["x1"] and o["x1"] > w["x0"]
            y_overlap = o["y0"] < w["y1"] and o["y1"] > w["y0"]
            above = x_overlap and -2 <= w["y0"] - o["y1"] <= 6
            below = x_overlap and -2 <= o["y0"] - w["y1"] <= 6
            # rotated labels stack as parallel columns: "Opt" in the column beside the code
            column = y_overlap and (-2 <= w["x0"] - o["x1"] <= 6 or -2 <= o["x0"] - w["x1"] <= 6)
            if beside or above or below or column:
                return True
        return False

    codes = []
    for w in words:
        m = CODE_RE.match(w["t"].replace(" ", ""))
        if m and w["t"] not in ("1976", "2024", "2025", "2026"):
            codes.append({"opt": bool(m.group(1)) or has_opt(w), "transom": bool(m.group(2)), "code": m.group(3),
                          "egress": "E" in (m.group(4) or "").upper(), "cx": (w["x0"] + w["x1"]) / 2, "cy": (w["y0"] + w["y1"]) / 2,
                          "x0": w["x0"], "x1": w["x1"], "y0": w["y0"], "y1": w["y1"]})

    reach = max(int(0.9 * px_per_ft * 3), 24)  # how far outside the wall a label may sit

    def opt_near(wall, a, b):
        """An "OPT" label just outside the wall over the opening (LIT-1 marks
        optional windows and doors that way, with no code)."""
        pad = 0.6 * px_per_ft
        for o in opt_words:
            ocx, ocy = (o["x0"] + o["x1"]) / 2, (o["y0"] + o["y1"]) / 2
            # the label sits just outside the wall, or just inside it
            r = 1.2 * px_per_ft
            if wall in ("top", "bottom"):
                over = x0 + a - pad <= ocx <= x0 + b + pad
                near = (y0 - r <= ocy <= y0 + t + r) if wall == "top" else (y1 - t - r <= ocy <= y1 + r)
            else:
                over = y0 + a - pad <= ocy <= y0 + b + pad
                near = (x0 - r <= ocx <= x0 + t + r) if wall == "left" else (x1 - t - r <= ocx <= x1 + r)
            if over and near:
                return True
        return False

    def label_for(wall, a, b):
        """A code whose centre lies over the opening [a,b] and just outside this wall."""
        best = None
        for c in codes:
            if wall in ("top", "bottom"):
                pos, lo, hi = c["cx"], x0 + a, x0 + b
                outside = (y0 - reach <= c["cy"] <= y0 + 2) if wall == "top" else (y1 - 2 <= c["cy"] <= y1 + reach)
            else:
                pos, lo, hi = c["cy"], y0 + a, y0 + b
                outside = (x0 - reach <= c["cx"] <= x0 + 2) if wall == "left" else (x1 - 2 <= c["cx"] <= x1 + reach)
            if not outside:
                continue
            slack = 0.35 * (hi - lo) + 4
            if lo - slack <= pos <= hi + slack:
                d = abs(pos - (lo + hi) / 2)
                if best is None or d < best[0]:
                    best = (d, c)
        return best[1] if best else None

    walls = {}
    for wall in ("top", "bottom", "left", "right"):
        prof = profile(dark, box, wall, outer=1.0 if mode == "l101" else 0.6)
        items = []
        for a, b, density in openings(prof):
            w_ft = (b - a) / px_per_ft
            c_ft = ((a + b) / 2) / px_per_ft
            if lit:
                it = classify_lit(dark, box, wall, a, b, w_ft, c_ft, density, px_per_ft, opt=opt_near(wall, a, b))
                if it["type"] != "wall":
                    items.append(it)
                continue
            if hi is not None:
                lab, opt_seen = ocr_label(hi, box, wall, a, b, px_per_ft)
                if lab is None:
                    # a door's code (WW80) is printed inside, by its swing
                    inner, _ = ocr_label(hi, box, wall, a, b, px_per_ft, side="inside")
                    if inner and int(inner["code"][2:]) >= 78:
                        lab = inner
                if lab is None:
                    # no code read: the stripes still tell a door from a window
                    it = classify_lit(dark, box, wall, a, b, w_ft, c_ft, density, px_per_ft, opt=opt_seen, cad=True)
                    if it["type"] != "wall":
                        it["ocr"] = "none"
                        items.append(it)
                    continue
                lab = {**lab, "ocr": True}
            else:
                lab = label_for(wall, a, b)
            if lab is not None and int(lab["code"][2:]) >= 78:
                # a door code (WW80): a slider when it is 60" or wider, else a swing door
                kind = "patio" if int(lab["code"][:2]) >= 60 else "door"
                items.append({"type": kind, "at": round(c_ft, 2), "w": round(w_ft, 2), "code": lab["code"], "opt": lab["opt"]})
            elif lab is not None:
                items.append({"type": "window", "at": round(c_ft, 2), "w": round(w_ft, 2), "code": lab["code"],
                              "egress": lab["egress"], "opt": lab["opt"], "transom": lab["transom"]})
            elif w_ft >= 7.5:
                items.append({"type": "open", "at": round(c_ft, 2), "w": round(w_ft, 2), "density": round(density, 2)})
            elif 2.3 <= w_ft < 7.5:
                items.append({"type": "door", "at": round(c_ft, 2), "w": round(w_ft, 2), "density": round(density, 2)})
            else:
                items.append({"type": "gap", "at": round(c_ft, 2), "w": round(w_ft, 2), "density": round(density, 2)})
        walls[wall] = items

    # porches. A "Porch" label inside the box is a recessed porch cut into the
    # floor: its length is the stretch of long wall that is railing, not wall,
    # at that end. A "Porch" label outside the box (usually under "Optional
    # Porch") is an add-on drawn beside the box with its own length label.
    porch = None
    labels = [w for w in words if w["t"].lower() == "porch"]
    inside = [w for w in labels if x0 <= w["x0"] <= x1 and y0 <= w["y0"] <= y1]
    outside = [w for w in labels if w not in inside]
    if inside:
        cx = sum((w["x0"] + w["x1"]) / 2 for w in inside) / len(inside)
        side = "right" if cx > (x0 + x1) / 2 else "left"
        # porch length: walk each long wall inward from that end until a solid
        # stretch of at least a foot of wall begins; the porch is what lies beyond
        lens = {}
        for wall in ("top", "bottom"):
            prof = profile(dark, box, wall)
            solid = prof >= 0.82
            seq = solid if side == "left" else solid[::-1]
            need = int(1.0 * px_per_ft)
            run = 0
            for i, v in enumerate(seq):
                run = run + 1 if v else 0
                if run >= need:
                    lens[wall] = (i - need + 1) / px_per_ft
                    break
        touches = [w for w, l in lens.items() if l >= 3]
        plen = round(max(lens[w] for w in touches), 1) if touches else None
        # a porch across the whole end touches both long walls; a one-section
        # porch (half the width) touches only the wall of that section
        depth = "full" if len(touches) == 2 else (touches[0] if touches else None)
        porch = {"kind": "recessed", "side": side, "lengthFt": plen, "depth": depth}
        if not touches:
            # a porch cut into the middle of a long wall (an entry porch at the
            # foyer): the wall nearest the label has an opening under the label
            lab = min(inside, key=lambda w: w["y0"])
            lcy = (lab["y0"] + lab["y1"]) / 2
            wall = "top" if abs(lcy - y0) < abs(lcy - y1) else "bottom"
            lx_ft = ((lab["x0"] + lab["x1"]) / 2 - x0) / px_per_ft
            hit = None
            for it in walls[wall]:
                if it["type"] in ("door", "open", "gap") and abs(it["at"] - lx_ft) <= it["w"] / 2 + 1.5:
                    if hit is None or abs(it["at"] - lx_ft) < abs(hit["at"] - lx_ft):
                        hit = it
            porch = {"kind": "recessed-mid", "wall": wall, "at": None, "w": None, "depthFt": None}
            if hit:
                walls[wall] = [it for it in walls[wall] if it is not hit]
                # depth: from the wall face inward to the first thick wall at the opening's centre
                cxp = int(x0 + hit["at"] * px_per_ft)
                depth_px = None
                for dpx in range(t + 2, int(0.6 * (y1 - y0))):
                    yy = y0 + dpx if wall == "top" else y1 - 1 - dpx
                    seg = dark[yy, cxp - 3: cxp + 4]
                    nxt = dark[yy + (1 if wall == "top" else -1), cxp - 3: cxp + 4]
                    if seg.all() and nxt.all():
                        depth_px = dpx
                        break
                porch = {"kind": "recessed-mid", "wall": wall, "at": hit["at"], "w": hit["w"],
                         "depthFt": round(depth_px / px_per_ft, 1) if depth_px else None}
        if plen:
            lo, hi = (0, plen) if side == "left" else (length_ft - plen, length_ft)
            for wall in touches:
                walls[wall] = [it for it in walls[wall] if not (lo - 0.5 <= it["at"] <= hi + 0.5)]
            end_wall = "right" if side == "right" else "left"
            if depth == "full":
                walls[end_wall] = []
            else:
                half = width_ft / 2
                keep = (lambda it: it["at"] < half - 0.3) if depth == "bottom" else (lambda it: it["at"] > half + 0.3)
                walls[end_wall] = [it for it in walls[end_wall] if keep(it)]
            # the house wall at the back of the porch: scan it like a fifth wall
            bx = int(x1 - plen * px_per_ft) if side == "right" else int(x0 + plen * px_per_ft)
            ry0, ry1 = y0, y1
            if depth == "top":
                ry1 = int((y0 + y1) / 2)
            elif depth == "bottom":
                ry0 = int((y0 + y1) / 2)
            cx0 = max(bx - 3 * t, 0)
            col = dark[ry0:ry1, cx0: bx + 3 * t]
            sums = col.sum(axis=0)
            peak = int(np.argmax(sums))
            # the wall is the run of columns around the peak that are nearly as dark
            lo_c, hi_c = peak, peak
            while lo_c > 0 and sums[lo_c - 1] >= 0.35 * sums[peak]:
                lo_c -= 1
            while hi_c < len(sums) - 1 and sums[hi_c + 1] >= 0.35 * sums[peak]:
                hi_c += 1
            wx = cx0 + peak
            band = dark[ry0:ry1, cx0 + lo_c: cx0 + hi_c + 1]
            prof = band.mean(axis=1)
            items = []
            for a, b, density in openings(prof):
                w_ft = (b - a) / px_per_ft
                c_ft = ((a + b) / 2 + (ry0 - y0)) / px_per_ft
                lab = None
                for c in codes:
                    in_porch = (wx <= c["cx"] <= x1 + 2) if side == "right" else (x0 - 2 <= c["cx"] <= wx)
                    if in_porch and (ry0 + a - 0.35 * (b - a) - 4) <= c["cy"] <= (ry0 + b + 0.35 * (b - a) + 4):
                        lab = c
                if lab is not None:
                    items.append({"type": "window", "at": round(c_ft, 2), "w": round(w_ft, 2), "code": lab["code"],
                                  "egress": lab["egress"], "opt": lab["opt"], "transom": lab["transom"]})
                elif 2.3 <= w_ft < 7.5:
                    items.append({"type": "door", "at": round(c_ft, 2), "w": round(w_ft, 2), "density": round(density, 2)})
                elif w_ft >= 7.5:
                    items.append({"type": "open", "at": round(c_ft, 2), "w": round(w_ft, 2), "density": round(density, 2)})
            walls["porchBack"] = items
    elif outside:
        cx = sum((w["x0"] + w["x1"]) / 2 for w in outside) / len(outside)
        side = "right" if cx > x1 else ("left" if cx < x0 else None)
        # its length label: a small horizontal "N'" above the porch drawing
        dim = None
        for w in words:
            if DIMLABEL_RE.match(w["t"]) and (w["y1"] - w["y0"]) < 1.5 * (w["x1"] - w["x0"]) and w["t"] != words_len_label(words):
                if (side == "right" and w["x0"] > x1) or (side == "left" and w["x1"] < x0):
                    if w["y0"] < min(o["y0"] for o in outside):
                        dim = feet(w["t"])
        optional = any(w["t"].lower().startswith("optional") for w in words)
        porch = {"kind": "addon", "side": side, "lengthFt": dim, "optional": optional}
    return {
        "model": model, "ok": scale_err < 0.06, "scaleErr": round(scale_err, 3), "dimsErr": dims_err,
        "lengthFt": round(length_ft, 2), "widthFt": round(width_ft, 2), "sqft": sqft,
        "boxPx": [x0, y0, x1, y1, t], "pxPerFt": round(px_per_ft, 3),
        "walls": walls, "porch": porch,
        "codesFound": len(codes), "mode": mode,
    }


if __name__ == "__main__":
    # extract_elevations.py [--sizes sizes.json] pdf_dir out.json [MODEL ...]
    # sizes.json: {model: {"L": 76, "W": 16, "sqft": 1152, "kind": "lit1"?}} —
    # the catalogue sizes that let a sheet without dimension labels be read
    args = sys.argv[1:]
    sizes = {}
    for flag in ("--sizes", "--lit"):
        if flag in args:
            i = args.index(flag)
            sizes = json.load(open(args[i + 1]))
            if flag == "--lit":
                for v in sizes.values():
                    v.setdefault("kind", "lit1")
            args = args[:i] + args[i + 2:]
    pdf_dir, out = args[0], args[1]
    only = args[2:] or None
    results = {}
    files = sorted(f for f in os.listdir(pdf_dir) if f.endswith(".pdf"))
    for f in files:
        model = f[:-4]
        if only and model not in only:
            continue
        try:
            results[model] = extract(os.path.join(pdf_dir, f), model, sizes.get(model))
            if results[model].get("mode") in ("lit1", "l101-ocr"):
                results[model]["lit1"] = True  # overlay renders these at LIT_DPI
        except Exception as e:  # keep going; the summary shows what failed
            results[model] = {"model": model, "ok": False, "why": f"{type(e).__name__}: {e}"}
        r = results[model]
        print(model, "OK" if r.get("ok") else "FAIL", r.get("why", ""), r.get("scaleErr", ""),
              {k: len(v) for k, v in r.get("walls", {}).items()}, flush=True)
    json.dump(results, open(out, "w"), indent=1)
