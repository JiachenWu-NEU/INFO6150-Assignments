# PartA

A two-page mini app that demonstrates login and a calculator.  
Built with **HTML**, **responsive CSS**, and **jQuery**.

---

## Pages & Flow

1. **`login.html`**
   - Validates email (`@northeastern.edu` only) and password (min 8 chars) using **jQuery** on `keyup`/`blur`.
   - Disables **Login** button until both fields pass validation.
   - Verifies credentials against **hardcoded users** (no popups; inline error only).
   - On success:
     - Creates session object `{ username, email, loginTimestamp, isLoggedIn }` in **`sessionStorage`** (or **`localStorage`** if “Remember Me” is checked).
     - Shows a **success banner** with jQuery animation.
     - **Redirects** to `calculator.html` after ~2s.

2. **`calculator.html`**
   - On load, checks session in **localStorage → sessionStorage**; **redirects** to `login.html` if missing.
   - Header shows **“Welcome, [username]!”** and a **Logout** button.
   - Calculator validates two numeric inputs (supports **decimals and negatives**).
   - Single arrow function `calculate(num1, num2, operation)` handles **add/subtract/multiply/divide** (no separate functions).
   - Division-by-zero and unknown-op **edge cases** handled with inline errors.
   - **Logout** clears session, **fades out** the page via jQuery, then redirects to `login.html`.

---

##  Hardcoded Users (demo)

- `alice@northeastern.edu` / `Password123`  
- `husky@northeastern.edu` / `GoHuskies2025`  
- `student@northeastern.edu` / `Welcome2024`

> You can edit the `USERS` array in `login.html`.

---

## HTML Tags Used

- Structural: `<header>`, `<main>`, `<section>`, `<form>`, `<label>`, `<input>`, `<button>`, `<div>`, `<h1>`, `<h2>`
- Accessibility/UI: `aria-live="polite"`, `role="status"`, `readonly`, `autocomplete`, `inputmode="decimal"`
- Meta: `<meta viewport>`, `<script src="...jquery...">`, `<link rel="stylesheet" href="styles.css">`

---

## JavaScript / jQuery Techniques

- **jQuery selectors & events**: `keyup`, `blur`, `focus`, `click`, `on('submit')`
- **Inline error UX**: write to error containers via `text()`; clear on `focus`
- **Real-time validation** using **regex**:
- **Button enable/disable**: `prop('disabled', ...)` + class toggle (`.enabled`)
- **Single arrow function**:
  const calculate = (num1, num2, operation) => {
  };

## Responsive CSS

- Breakpoints at 900px, 720px, 420px, 340px
- Card padding/width scales; remember row stacks on narrow screens
- Inputs use font-size:16px on phones to avoid iOS zoom
- @media (prefers-reduced-motion: reduce) removes transitions for accessibility

## How to Run
Open login.html in a browser, and use the hardcoded users mentioned above to login