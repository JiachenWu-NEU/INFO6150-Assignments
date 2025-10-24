# Single-Page Stopwatch — README

A single-page stopwatch for timing activities, labeling each session with a **date** and **event name**, and keeping a persistent **localStorage** history.

Note: The **date picker does not control the timer**. It labels when the activity took place (e.g., “Study Session on 2025-10-15”).

---

## Overview
- A simple timer for you to use. When clicking start, the timer runs. And stop until you choose to stop. You can choose to record this session or abandon(reset) it. Also, all history is recorded, easy to check any time.

---

## HTML Tags Used
- Structure: `header`, `section`, `div`, `h1`, `h2`, `p`, `label`
- Inputs and controls: `input type="date"`, `input type="text"`, `button`
- Scripts and styles: `script`, `style`
- Others: `div`

---

## CSS Used
- background color, sizing, padding, margin, font-size, font-family, float, @media

---

## JavaScript Techniques
- **Async/await** and **Promises** (wrapping localStorage writes and modal confirmations).
- **Timer core** with `setInterval` / `clearInterval`.
- **State management** using:
  - `Date.now()` for start time
  - `elapsedBase` to accumulate paused time
  - `HH:MM:SS` formatter with `padStart`
- **localStorage** for persistence (`getItem`, `setItem`, JSON serialize/parse).
- **DOM updates** with `addEventListener`, `classList`, template strings.
- **Array utilities**: `sort` (newest first), `filter` (by date), `reduce` (total seconds).

---

## Data Model (localStorage)
- Key: `stopwatchSessions_v1`
- Value (array of objects):
  ```json
  {
    "date": "2025-10-20",
    "name": "Workout",
    "durationSecs": 1534,
    "savedAt": "2025-10-20T21:13:37.123Z"
  }

## How to Run
Open the session.html in a browser, input title and click 'start', then choosing to save or other actions.