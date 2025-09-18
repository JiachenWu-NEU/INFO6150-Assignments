# Professional Portfolio

A responsive **professional portfolio website** built with **HTML5** and **CSS3**, showcasing personal profile, skills, projects, testimonials, and contact form.  
It demonstrates semantic structure, Flexbox layout, responsive design, and various UI components.

---

## 📋 Features

- **Semantic HTML5 Structure**  
  - `header`, `nav`, `main`, `section`, `article`, `aside`, and `footer`  
  - Clear layout with a left column (`section` + `article`) and a right column (`aside`)

- **Responsive Flexbox Layout**  
  - `flex-grow`, `flex-shrink`, and `flex-basis` for column sizing  
  - Media queries for **iPad (≤768px)** and **iPhone (≤375px)** screen sizes  
  - Re-stacks layout on smaller screens

- **Navigation Menu**  
  - Sticky top `header` and `nav`  
  - Mobile-friendly toggle button for showing/hiding the nav on small screens

- **Interactive Components**
  - **Projects table** styled with multiple CSS selectors (`nth-child`, `[attribute]`, `:hover`)
  - **Contact form** with an alert-based submission handler (shows entered data and resets form)
  - **Testimonials** section using Flexbox and hover elevation
  - **Image gallery** using CSS Grid with hover effects

- **Styling**  
  - External `styles.css` file  
  - Dark themed design with gradients and custom color variables  
  - Buttons with gradient backgrounds, transitions, and `:hover` effects

- **JavaScript Enhancements**  
  - Mobile nav toggle (`.menu-toggle`)  
  - Dynamic current year in footer  
  - Form submission handler with `alert`

---

## ⚙️ How to Use

1. Clone or download this repository.
2. Open `index.html` in your browser.
3. Edit the content:
   - Change your **name, tagline, avatar** in the header
   - Fill in your **projects** table and **skills**
   - Replace **testimonials** and **gallery images**
4. (Optional) Connect the contact form to a backend or form service if you want real submissions.

---

## 📱 Responsive Layout

- **Desktop:** Two-column layout — left (`section`+`article`) and right (`aside`)
- **Tablet (≤768px):** Columns stack vertically, `aside` moves below left column
- **Mobile (≤375px):** Simplified layout, gallery switches to single column

---

## 📄 License

MIT — Feel free to use and modify this template for your personal portfolio.
