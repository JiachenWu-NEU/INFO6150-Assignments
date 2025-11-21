# Assignment10

## Project Setup

### Prerequisites
- Node.js ≥ 18
- Assignment-8 backend running locally (default `http://localhost:3000`)
  - Must expose: `POST /auth/login`, `GET /user/getAll`

### How to run
- unzip the file
- open a terminal in assginment9 folder and run "npm run dev"

## Folder Structure
- node_modules
- src
  - api
    - axios.js
  - components
    - navbar.jsx
    - protectedlayout.jsx
  - context
    - authcontext.jsx
  - pages
    - about, company gallery, contact, home, job listing: each folder has one .jsx to show its page
    - login.jsx: the login page which users will see at the first time
  - app.jsx
  - main.jsx
- index.html
- others
  - all other files just under the folder is the config of the project

## Key Functions

- **Auth-gated app**: users must log in first, then access the main site (Home, About, Jobs, Contact, Company Showcase).
- **Job Listings**: rendered on the front-end via a local `jobPosts` array.
- **Company Showcase**: displays company cards; images are pulled from the Assignment-8 backend’s `/user/getAll`.
- **Clean separation**: front-end (this repo) with a previously built **Node/Express/Mongo** backend (Assignment-8).

---

## Tech Stack
- **Frontend:** React + Vite, React Router v6, Axios  
- **UI:** Material UI (pages), Bootstrap (optional for Navbar)  
- **Backend (external):** Node.js + Express + MongoDB (Assignment-8)

---

