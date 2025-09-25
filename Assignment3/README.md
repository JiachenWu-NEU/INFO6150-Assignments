# Assignment3 - Dynamic Student Table

## Overview
**Header shows your name & NUID (edit the line at the top of index.html).**

**Initial state**
All detail rows are collapsed.
Submit button is disabled and gray.

**Selecting rows**
Checking a row highlights it yellow and reveals Edit / Delete buttons for that row.
If any row is checked, Submit becomes enabled and orange; otherwise it’s disabled again.

**Expanding details**
The green arrow on the left toggles per-row details.
Uses aria-expanded as the single source of truth to ensure the arrow rotates correctly on the first click.

**Adding records**
Add New Student inserts a new row with the smallest missing positive number (no gaps in numbering).
Shows an alert on successful addition.

**Deleting / Editing**
Delete removes the row (and its details) with a success alert.
Edit opens a native <dialog>; confirming non-empty input shows a success alert.