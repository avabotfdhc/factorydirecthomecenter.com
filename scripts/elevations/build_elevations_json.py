#!/usr/bin/env python3
"""Turn the raw extraction (all.json, plan-drawing coordinates) into the
compact, viewer-oriented file the site ships: src/lib/plan-elevations.json.

Viewer orientation: every view lists openings by x from the viewer's left
while standing outside, facing that wall. The front is the long wall a buyer
would call the front: the wall with the entry porch, else the wall with the
most glass. End views are named left/right as seen from the front.
"""
import json, sys, collections

src, out = sys.argv[1], sys.argv[2]
raw = json.load(open(src))


def glass(items):
    tot = 0
    for it in items:
        if it["type"] == "window" and not it.get("opt"):
            tot += int(it["code"][:2]) * int(it["code"][2:])
    return tot


def conv(items, mirror, length):
    """Openings for one view: [kind, x, w, code, egress]."""
    out = []
    for it in items:
        if it.get("opt"):
            continue  # factory options are not drawn
        kind = {"window": "w", "door": "d", "patio": "p", "open": "o"}.get(it["type"])
        if kind is None:
            continue  # sub-2ft gaps are corner posts and jambs, not openings
        x = round(length - it["at"], 2) if mirror else it["at"]
        rec = [kind, x, it["w"]]
        if it.get("code"):
            rec.append(it["code"])
            if it.get("egress"):
                rec.append(1)
        out.append(rec)
    return sorted(out, key=lambda r: r[1])


plans, stats = {}, collections.Counter()
for model, r in sorted(raw.items()):
    if not r.get("ok"):
        stats["failed"] += 1
        continue
    L, W = r["lengthFt"], r["widthFt"]
    walls = r["walls"]
    porch = r.get("porch") or {}
    # which long wall is the front
    if porch.get("kind") == "recessed-mid":
        front = porch["wall"]
    elif porch.get("kind") == "recessed" and porch.get("depth") in ("top", "bottom"):
        front = porch["depth"]
    else:
        gt, gb = glass(walls["top"]), glass(walls["bottom"])
        front = "bottom" if gb >= gt else "top"
    stats[f"front={front}"] += 1
    rear = "top" if front == "bottom" else "bottom"
    if front == "bottom":
        # facing north at the bottom wall: plan left is the viewer's left
        views = {
            "front": conv(walls["bottom"], False, L),
            "rear": conv(walls["top"], True, L),
            # west end seen from the west, facing east: north (plan top) is on the viewer's left -> direct
            "left": conv(walls["left"], False, W),
            # east end seen from the east, facing west: south (plan bottom) is on the viewer's left -> mirrored
            "right": conv(walls["right"], True, W),
        }
        plan_side_to_view = {"left": "left", "right": "right"}
    else:
        views = {
            "front": conv(walls["top"], True, L),
            "rear": conv(walls["bottom"], False, L),
            "left": conv(walls["right"], True, W),   # the viewer's left end is the plan's right end
            "right": conv(walls["left"], False, W),
        }
        plan_side_to_view = {"left": "right", "right": "left"}
    # porch, in viewer terms
    p = None
    if porch.get("kind") == "recessed" and porch.get("lengthFt"):
        depth = porch.get("depth")
        p = {"kind": "end", "side": plan_side_to_view[porch["side"]], "len": porch["lengthFt"],
             "depth": "full" if depth == "full" else ("front" if depth == front else "rear")}
        back = walls.get("porchBack", [])
        # back-wall openings are measured from the plan top. Seen from the east
        # (plan right) the viewer's left is the plan bottom, so mirror; from the
        # west the plan top is already on the viewer's left.
        mirror_back = (porch["side"] == "right")
        p["back"] = conv(back, mirror_back, W)
        stats["porch=end"] += 1
    elif porch.get("kind") == "recessed-mid" and porch.get("at"):
        x = porch["at"] if front == "bottom" else L - porch["at"]
        p = {"kind": "mid", "x": round(x, 2), "w": round(porch["w"], 2), "depth": porch.get("depthFt") or 5.0,
             "depthEstimated": porch.get("depthFt") is None}
        stats["porch=mid"] += 1
    elif porch.get("kind") == "addon" and porch.get("side"):
        p = {"kind": "addon", "side": plan_side_to_view[porch["side"]], "len": porch.get("lengthFt") or 8.0,
             "lenEstimated": porch.get("lengthFt") is None}
        stats["porch=addon"] += 1
    for v in views.values():
        for o in v:
            stats["kind=" + o[0]] += 1
    plans[model] = {"L": L, "W": W, "sqft": r.get("sqft"), "views": views, "porch": p, "src": "sheet"}

json.dump(plans, open(out, "w"), separators=(",", ":"))
print(len(plans), "plans written;", dict(stats))
import os
print("size", os.path.getsize(out), "bytes")
