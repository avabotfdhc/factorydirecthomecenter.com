#!/usr/bin/env python3
"""Draw the extracted openings over the rendered sheet so a human can check them."""
import json, sys, os
sys.path.insert(0, os.path.dirname(__file__))
import extract_elevations as ex
from PIL import ImageDraw

COLORS = {"window": (0, 120, 255), "door": (230, 60, 0), "open": (160, 0, 200), "gap": (255, 170, 0)}


def overlay(pdf, rec, out):
    img = ex.render(pdf).convert("RGB")
    d = ImageDraw.Draw(img)
    x0, y0, x1, y1, t = rec["boxPx"]
    ppf = rec["pxPerFt"]
    d.rectangle([x0, y0, x1, y1], outline=(0, 200, 0), width=2)
    for wall, items in rec["walls"].items():
        for it in items:
            a = (it["at"] - it["w"] / 2) * ppf
            b = (it["at"] + it["w"] / 2) * ppf
            c = COLORS.get(it["type"], (0, 0, 0))
            if wall == "top":
                box = [x0 + a, y0 - 14, x0 + b, y0 + t + 2]
            elif wall == "bottom":
                box = [x0 + a, y1 - t - 2, x0 + b, y1 + 14]
            elif wall == "left":
                box = [x0 - 14, y0 + a, x0 + t + 2, y0 + b]
            elif wall == "right":
                box = [x1 - t - 2, y0 + a, x1 + 14, y0 + b]
            else:  # porchBack
                p = rec["porch"]
                bx = x1 - p["lengthFt"] * ppf if p["side"] == "right" else x0 + p["lengthFt"] * ppf
                box = [bx - 8, y0 + a, bx + 8, y0 + b]
            d.rectangle(box, outline=c, width=3)
            tag = it.get("code", it["type"][0]) + ("E" if it.get("egress") else "") + ("*" if it.get("opt") else "")
            d.text((box[0], box[1] - 12 if wall != "bottom" else box[3] + 2), tag, fill=c)
    p = rec.get("porch")
    if p and p.get("lengthFt"):
        if p["kind"] == "recessed":
            bx = x1 - p["lengthFt"] * ppf if p["side"] == "right" else x0 + p["lengthFt"] * ppf
            ya, yb = y0, y1
            if p.get("depth") == "top": yb = (y0 + y1) / 2
            if p.get("depth") == "bottom": ya = (y0 + y1) / 2
            d.rectangle([min(bx, x1 if p["side"] == "right" else x0), ya, max(bx, x1 if p["side"] == "right" else x0), yb], outline=(0, 160, 160), width=3)
        d.text((x0, y1 + 30), f"porch: {p}", fill=(0, 120, 120))
    d.text((x0, y0 - 40), f"{rec['model']}  {rec['lengthFt']}' x {rec['widthFt']}'  scaleErr {rec['scaleErr']}", fill=(0, 150, 0))
    img.save(out)


if __name__ == "__main__":
    recs = json.load(open(sys.argv[1]))
    pdf_dir, out_dir = sys.argv[2], sys.argv[3]
    os.makedirs(out_dir, exist_ok=True)
    models = sys.argv[4:] or [m for m, r in recs.items() if r.get("ok")]
    for m in models:
        r = recs.get(m)
        if not r or not r.get("ok"):
            print("skip", m); continue
        overlay(os.path.join(pdf_dir, m + ".pdf"), r, os.path.join(out_dir, m + ".png"))
        print("wrote", m)
