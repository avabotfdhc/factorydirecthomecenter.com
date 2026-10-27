#!/usr/bin/env python3
"""Read exterior openings off a Champion L-101 sales sheet.

For each sheet (page 1): render the page, find the thick exterior wall outline,
walk each of the four walls for breaks in the thick wall, and label each break
as a window (a WWHH[E] code sits just outside it), a door, or a porch recess.
Dimensions come from the printed "LL'-L" x WW'-W"" line; the pixel scale is
checked against both printed dimensions so a bad read is flagged, not shipped.
"""
import json, os, re, subprocess, sys, tempfile
from xml.etree import ElementTree as ET
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

DPI = 100
PX_PER_PT = DPI / 72.0

CODE_RE = re.compile(r"^(?:(OPT\.?)\s*)?(T?)(\d{4})(E|SG|ESG|ES)?$", re.I)
DIM_RE = re.compile(r"^(\d+)'(?:-(\d+)\")?$")


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True, check=True).stdout


def words_on_page(pdf):
    """pdftotext -bbox words for page 1, in rendered-page px (handles /Rotate)."""
    xml = run(["pdftotext", "-f", "1", "-l", "1", "-bbox", pdf, "-"])
    xml = xml.replace('xmlns="http://www.w3.org/1999/xhtml"', "")
    root = ET.fromstring(xml)
    out = []
    for w in root.iter("word"):
        out.append({
            "t": (w.text or "").strip(),
            "x0": float(w.get("xMin")) * PX_PER_PT, "x1": float(w.get("xMax")) * PX_PER_PT,
            "y0": float(w.get("yMin")) * PX_PER_PT, "y1": float(w.get("yMax")) * PX_PER_PT,
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


def render(pdf):
    with tempfile.TemporaryDirectory() as d:
        run(["pdftoppm", "-r", str(DPI), "-f", "1", "-l", "1", "-gray", "-png", pdf, os.path.join(d, "p")])
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


def profile(dark, box, wall):
    """Fraction of dark pixels across the wall band, per position along the wall."""
    x0, y0, x1, y1, t = box
    if wall == "top":
        band = dark[y0:y0 + t, x0:x1]; return band.mean(axis=0)
    if wall == "bottom":
        band = dark[y1 - t:y1, x0:x1]; return band.mean(axis=0)
    if wall == "left":
        band = dark[y0:y1, x0:x0 + t]; return band.mean(axis=1)
    band = dark[y0:y1, x1 - t:x1]; return band.mean(axis=1)


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


def extract(pdf, model):
    img = render(pdf)
    dark = np.array(img) < 110
    words = merge_words(words_on_page(pdf))
    found, why = find_box(img, words)
    if found is None:
        return {"model": model, "ok": False, "why": why}
    x0, y0, x1, y1, t, length_ft, width_ft = found
    box = (x0, y0, x1, y1, t)
    dims, sqft = parse_dims(words)
    px_per_ft = (x1 - x0) / length_ft
    width_px_ft = (y1 - y0) / px_per_ft
    scale_err = abs(width_px_ft - width_ft) / width_ft
    dims_err = None
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
        prof = profile(dark, box, wall)
        items = []
        for a, b, density in openings(prof):
            w_ft = (b - a) / px_per_ft
            c_ft = ((a + b) / 2) / px_per_ft
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
        "codesFound": len(codes),
    }


if __name__ == "__main__":
    pdf_dir, out = sys.argv[1], sys.argv[2]
    only = sys.argv[3:] or None
    results = {}
    files = sorted(f for f in os.listdir(pdf_dir) if f.endswith(".pdf"))
    for f in files:
        model = f[:-4]
        if only and model not in only:
            continue
        try:
            results[model] = extract(os.path.join(pdf_dir, f), model)
        except Exception as e:  # keep going; the summary shows what failed
            results[model] = {"model": model, "ok": False, "why": f"{type(e).__name__}: {e}"}
        r = results[model]
        print(model, "OK" if r.get("ok") else "FAIL", r.get("why", ""), r.get("scaleErr", ""),
              {k: len(v) for k, v in r.get("walls", {}).items()}, flush=True)
    json.dump(results, open(out, "w"), indent=1)
