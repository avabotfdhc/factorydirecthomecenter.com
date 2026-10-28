# Exterior elevations from Champion's sales sheets

`src/lib/plan-elevations.json` — the window, door and porch layout of every
plan the Design Your Home preview can draw — is generated from Champion's own
sheets (`floor_plan_documents` rows of kind `sales-sheet`, page 1 of the PDF in
the `floor-plans` storage bucket). Nothing in it is hand-drawn: if the sheet
changes, rerun this and the picture follows. Three kinds of sheet are read:

| mode | sheet | plans | how the box and openings are found |
|---|---|---|---|
| `l101` | Topeka L-101 (APB/AP) with a text layer | Aspire, Dutch, Redman | printed dimension labels give the scale; window codes (`3061`, `4661E`…) sit in the text layer |
| `l101-ocr` | L-101 whose text is outlined (no text layer) | 10 Aspire plans | box from the dimension line and the wall fill, scale from the catalogue length; each opening's code is OCR'd (`pytesseract`) from a strip beside it; a door is a break whose band is not a hollow window box |
| `lit1` | Decatur LIT-1 colour floor plan | Prime | no codes at all: a window is the striped thin box set into the wall band, a door a clean break with its leaf swung outside, `OPT` labels mark options; the scale comes from the catalogue length |

## What the extractor reads

For each sheet, `extract_elevations.py`:

1. Renders page 1 at 100 dpi and reads the text layer (`pdftotext -bbox`).
2. Finds the box from the sheet's own dimension lines — the arrow line under
   the big length label ("52'") and the one beside the rotated width label
   ("23'-4"") — and checks the two scales agree within 6%.
3. Walks the thick exterior wall on all four sides. A break in the wall with a
   Champion window code just outside it (`3061`, `4661E`, `3036`, `T3008`,
   `3061SG`…) is a window; a 2.3–7.5 ft break with no code is a door; a labelled
   `7280` is a patio slider. `Opt`-prefixed codes are factory options and are
   left out.
4. Reads porches: a `Porch` label inside the box at an end (railing instead of
   wall; one section or the full end, with the house wall behind it scanned
   too), in the middle of a long wall (an entry porch at the foyer), or drawn
   beside the box under "Optional Porch" (Champion's add-on).

`build_elevations_json.py` then turns the plan-drawing coordinates into the
viewer-oriented views the renderer uses (front = the wall with the entry porch,
else the wall with the most glass; x measured from the viewer's left facing
each wall) and writes the compact JSON keyed by model number.

`overlay.py` draws the result back over the sheet so a person can check it.
Always look at a sample after a rerun.

## Rerunning

Needs Python 3 with `numpy`, `pillow`, `scipy`, `pytesseract` (plus the
`tesseract` binary, for the OCR mode only), and poppler's `pdftoppm` /
`pdftotext` on the PATH.

```sh
# 1. the sheets, one per model number, as <MODEL>.pdf:
#      ./pdf        Topeka L-101 sheets (APB first, then 112AP, then anything else)
#      ./prime      Prime LIT-1 sheets
#      ./ocr        the L-101 sheets with no text layer (listed below)
#    sizes.json for the last two: {model: {"L": 76, "W": 16, "sqft": 1152}} from floor_plans
# 2. extract — three runs, three raw files
python3 scripts/elevations/extract_elevations.py pdf all.json
python3 scripts/elevations/extract_elevations.py --lit prime-sizes.json prime prime.json
python3 scripts/elevations/extract_elevations.py --sizes ocr-sizes.json ocr ocr.json
# 3. build the site file (comma-separated; a later file wins on a model)
python3 scripts/elevations/build_elevations_json.py all.json,prime.json,ocr.json src/lib/plan-elevations.json
# 4. eyeball a few
python3 scripts/elevations/overlay.py all.json pdf overlays 2452H32167 2856H32103
python3 scripts/elevations/overlay.py prime.json prime overlays 1676H32P01
npm test   # tests/plan-elevation.test.ts holds the data to the renderer's assumptions
```

Reverse Aisle plans (`BARKLEY-RA`, `CREST-RA`, `PEAK-RA`, `RIDGE-RA`,
`SPIRE-RA`, `VERTEX-RA`, `ZENITH-RA`) have no sheet of their own; `BASED_ON`
in `build_elevations_json.py` copies the base plan's entry under the alias
with `basedOn` set, and the page says the layout is the base plan's. They are
**not mirrored**, because which axis "reverse aisle" flips is not recorded
anywhere we hold; when that is known, mirror the views there.

## Known gaps (October 2026: 231 entries — 191 L-101, 10 OCR, 23 LIT-1, 7 aliases)

- `2856M32173`'s sheet is the one OCR read the extractor still rejects (scale
  error 3%); its HUD twin `2856H32173` reads cleanly and the lookup's H↔M
  fallback serves it, so the page draws the same box.
- Three Prime plans have no drawing in the catalogue at all — `HICKMAN`,
  `MONTE`, `MONTE-RA` — and get the *representative* layout from their size,
  which the page says.
- The front wall of a mid-wall entry porch is read; the porch's depth usually
  is not (the foyer door is in the way), so it is drawn 5 ft deep.
- Add-on porches drawn without their own length label are assumed 8 ft, which
  is Champion's standard.
