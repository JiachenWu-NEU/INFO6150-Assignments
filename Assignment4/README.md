# Feedback Form — README

# A lightweight, client-side validated feedback form with dynamic fields, a live submission preview table, and a built-in “AI Assistant” help widget.

- Overview

  - This project implements a responsive feedback form that performs real-time validation and formatting using plain JavaScript (no frameworks). It includes:

  - Strict regex validation (names, email domain, phone, zipcode).

  - Auto-formatting phone numbers as (XXX)XXX-XXXX.

  - “How did you hear” multi-select via checkboxes (at least one required).

  - Optional Address field with a live character counter.

  - A Topic select → shows a single checkbox → if checked, shows a required text field (only this text field is validated when visible).

  - Submit Preview Table renders all submitted values under the form (address always shown; topic rows only if a topic was selected).

  - Help button opens a floating chat-style AI Assistant window in the bottom-right; click again (or ✕) to close. Closing clears chat history.