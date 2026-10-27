# Exterior elevations from Champion's sales sheets

`src/lib/plan-elevations.json` — the window, door and porch layout of every
plan the Design Your Home preview can draw — is generated from Champion's own
L-101 literature sheets (`floor_plan_documents` rows of kind `sales-sheet`,
page 1 of the APB/AP PDF in the `floor-plans` storage bucket). Nothing in it is
hand-drawn: if the sheet changes, rerun this and the picture follows.

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

Needs Python 3 with `numpy`, `pillow`, `scipy`, and poppler's `pdftoppm` /
`pdftotext` on the PATH.

```sh
# 1. the sheets: one per model number, APB first, then 112AP, then anything else
#    (the SQL in the first commit's PR description lists them; download into ./pdf as <MODEL>.pdf)
# 2. extract
python3 scripts/elevations/extract_elevations.py pdf all.json
# 3. build the site file
python3 scripts/elevations/build_elevations_json.py all.json src/lib/plan-elevations.json
# 4. eyeball a few
python3 scripts/elevations/overlay.py all.json pdf overlays 2452H32167 2856H32103
npm test   # tests/plan-elevation.test.ts holds the data to the renderer's assumptions
```

## Known gaps (October 2026 run: 191 of 202 sheets read)

- 11 sheets have no text layer (outlined text), so nothing can be read from
  them: 1432H11214, 1660H22P02, 2432H21166, 2436H21166, 2452H32160,
  2456H32160, 2852H32173, 2852H32393, 2852H42096, 2856H32173, 2856M32173.
  Those plans get a *representative* layout from their size, and the page says
  so. OCR would close this.
- Plans whose model number has no sales sheet at all (the Prime "-RA" reverse
  aisles, for instance) also get the representative layout.
- The front wall of a mid-wall entry porch is read; the porch's depth usually
  is not (the foyer door is in the way), so it is drawn 5 ft deep.
- Add-on porches drawn without their own length label are assumed 8 ft, which
  is Champion's standard.
