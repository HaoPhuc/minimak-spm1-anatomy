# The user guide

[`../user-guide.pdf`](../user-guide.pdf) is printed from [`guide.html`](guide.html), 16 A4 pages. Its pictures are
screenshots of the app, so after a change to the page they can be taken again and the guide printed again. From the
repository's root:

1. Take the screenshots, about four minutes, with the review panel's driver (it needs Chrome):

   ```bash
   node review-panel/shot.mjs . docs/guide/scenarios.json docs/guide/shots
   ```

2. Crop them into `img/` (Python with Pillow):

   ```bash
   python docs/guide/prep.py
   ```

3. Print the page:

   ```bash
   "C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --no-sandbox --no-pdf-header-footer --virtual-time-budget=8000 --print-to-pdf="$(pwd -W)/docs/user-guide.pdf" "file:///$(pwd -W)/docs/guide/guide.html"
   ```

`shots/` and `img/` are not committed.

## What to check after a change

- [`scenarios.json`](scenarios.json) sets the view (1280 × 800 at 2×, a phone at 390 × 844) and theme for each scenario.
  Each `shot` step names a screenshot. Many scenarios open a part from a link (`__spm1.applyLink('#part=…')`).
- The crop boxes in [`prep.py`](prep.py), the numbered markers on a screenshot and the labels on the inspect bar
  (`data-at` in `guide.html`) are in CSS px of the 1280 × 800 view. If the page's layout moves, look at the markers
  on pages 2, 3, 7, 8 and 12. Check that page 5 shows the selection chip and Details together, and that each label on page 6 points to its control in the Inspecting row.
- Each section starts a page and should fit on it, as the page numbers in the contents are written by hand.
