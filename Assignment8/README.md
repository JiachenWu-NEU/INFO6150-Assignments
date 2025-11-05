# User API Assignment (Express + MongoDB)

This project implements the assignment requirements:

- Node.js + Express REST API
- MongoDB (Mongoose) persistence
- Secure password storage with **bcrypt**
- Image upload with validation (JPEG/PNG/GIF) and **one image per user**
- Endpoints:
  - `POST /user/create`
  - `PUT /user/edit`
  - `DELETE /user/delete`
  - `GET /user/getAll`
  - `POST /user/uploadImage`
- Swagger docs at `/api-docs`
- Postman collection included in `postman/User-API.postman_collection.json`

## Quick Start

```bash
git clone <your-repo>
cd user-api-assignment
cp .env.example .env
# update .env if needed
npm install
npm run dev
```

Server runs on `http://localhost:3000` and MongoDB URI defaults to `mongodb://localhost:27017/user_api_assignment`.

## Validation Rules
- **email**: valid email format (required where applicable)
- **fullName**: alphabetic characters and spaces only, min length 2
- **password**: min 8 chars, at least 1 uppercase, 1 lowercase, 1 digit, 1 special char

## Notes
- `GET /user/getAll` returns hashed passwords under `password` as required.
- Images are saved to local `images/` and served at `/images/<filename>`.
- Upload rejects second image for the same user with: `Image already exists for this user.`
