# Assignment10

## Project Setup

### How to run
- unzip the file
- modify all .env files in the folder(one in the root and another under backend)
- open a terminal in assginment10 folder and run "npm run dev"
- open a terminal in backend folder under assignment10 folder and run dev

## Folder Structure
- node_modules
- src
  - api
    - axios.js
  - components
    - navbar.jsx
    - protectedlayout.jsx
    - roleRouter.jsx
  - context
    - authcontext.jsx
  - pages
    - admin, about, company gallery, contact, home, job listing: each folder has one .jsx to show its page
    - login.jsx: the login page which users will see at the first time
  - store
    - using Redux to store user info and easy to use later when fetching data
  - app.jsx
  - main.jsx
- index.html
- others
  - all other files just under the folder is the config of the project

## Key Functions

- **Auth-gated app**: users must log in first, then access the main site (Home, About, Jobs, Contact, Company Showcase).
- **Job Listings**: rendered on the front-end via a local `jobPosts` array.
- **Company Showcase**: displays company cards; images are pulled from the Assignment-8 backend’s `/user/getAll`.
- **Using Redux**: use redux for storing user info
- **Following desing**: front-end (this repo) with a redesigned backend (Assignment8) with mongodb, nodejs, express.

---

## Tech Stack
- **Frontend:** React + Vite, React Router v6, Axios  
- **UI:** Material UI (pages), Bootstrap (optional for Navbar)  
- **Backend (external):** Node.js + Express + MongoDB (Assignment8) + Redux

---

