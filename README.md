# MERN Practice App (Login + Cars Dashboard)

This project is a simple **MERN-style practice application** split into two folders:

- `Backend` → Express + MongoDB API with JWT authentication.
- `Frontend` → React (Vite) UI for login and car management.

The app flow is:
1. User logs in with email/password.
2. Backend validates credentials and returns a JWT.
3. Frontend stores the JWT in `localStorage`.
4. Frontend uses the token to fetch/add cars from protected backend routes.

---

## Project Structure

```text
MERN-practice/
├── Backend/
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Car.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── cars.js
│   ├── createUser.js
│   ├── server.js
│   └── .env
└── Frontend/
    ├── src/
    │   ├── components/
    │   │   ├── login.jsx
    │   │   └── home.jsx
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

---

## How It Works

## 1) Backend startup (`Backend/server.js`)

- Loads environment variables from `.env`.
- Creates an Express app.
- Adds middleware:
  - `cors()` for cross-origin requests.
  - `express.json()` for JSON request bodies.
- Mounts route groups:
  - `/api/auth` for authentication.
  - `/api/cars` for car data.
- Connects to MongoDB using `MONGO_URI`.
- Starts server on `PORT` (default `5000`).

## 2) Authentication flow (`Backend/routes/auth.js`)

- Endpoint: `POST /api/auth/login`
- Expected body:

```json
{
  "email": "test@example.com",
  "password": "123456"
}
```

- Steps performed:
  1. Finds user by email in MongoDB.
  2. Compares plain password with hashed password using `bcryptjs.compare`.
  3. If valid, signs JWT with `JWT_SECRET` and 1-hour expiry.
  4. Returns `{ token }`.

If email/password are invalid, it returns `400` with `Invalid credentials`.

## 3) Route protection (`Backend/middleware/authMiddleware.js`)

Protected endpoints expect header:

```http
Authorization: Bearer <token>
```

Middleware behavior:
- Reads token from `Authorization` header.
- Verifies token with `JWT_SECRET`.
- On success: attaches decoded payload to `req.user` and calls `next()`.
- On failure/missing token: returns `401`.

## 4) Cars API (`Backend/routes/cars.js`)

All car endpoints are protected by `authMiddleware`.

- `GET /api/cars`
  - Returns all cars from MongoDB.
- `POST /api/cars`
  - Expects `{ make, model, year }`.
  - Creates and stores a new car document.
  - Returns the created car with status `201`.

## 5) Frontend routing (`Frontend/src/App.jsx`)

- `/` renders the Login screen.
- `/home` renders the Cars Dashboard.

## 6) Login page (`Frontend/src/components/login.jsx`)

- Collects email and password.
- Sends request to `POST http://localhost:5000/api/auth/login`.
- If successful:
  - Saves JWT token in `localStorage` under key `token`.
  - Navigates to `/home`.
- If failed: shows error message.

## 7) Home page (`Frontend/src/components/home.jsx`)

- On load:
  - Reads token from `localStorage`.
  - If token exists, fetches cars from `GET /api/cars`.
  - If token is missing/invalid, redirects user to login route.
- Add car form:
  - Submits to `POST /api/cars` with bearer token.
  - Appends created car to local UI state.
- Logout button:
  - Removes token from `localStorage`.
  - Redirects to login route.

---

## Data Models

### User
- `email` (String, required, unique)
- `password` (String, required, hashed)

### Car
- `make` (String, required)
- `model` (String, required)
- `year` (Number, required)

---

## Setup & Run

## Prerequisites

- Node.js installed
- MongoDB running locally (or change `MONGO_URI`)

## 1) Install dependencies

```bash
cd Backend
npm install

cd ../Frontend
npm install
```

## 2) Configure backend environment

Create/update `Backend/.env`:

```env
MONGO_URI=mongodb://localhost:27017/carDB
JWT_SECRET=your_jwt_secret_here
PORT=5000
```

## 3) (Optional) Seed a test user

`Backend/createUser.js` creates:
- Email: `test@example.com`
- Password: `123456` (stored as hash)

Run:

```bash
cd Backend
node createUser.js
```

## 4) Start backend

```bash
cd Backend
npm start
```

Backend runs at `http://localhost:5000`.

## 5) Start frontend

```bash
cd Frontend
npm run dev
```

Frontend runs at Vite local URL (usually `http://localhost:5173`).

---

## API Quick Reference

### Login
- `POST /api/auth/login`
- Body: `{ email, password }`
- Success: `{ token }`

### Get all cars (protected)
- `GET /api/cars`
- Header: `Authorization: Bearer <token>`

### Add car (protected)
- `POST /api/cars`
- Header: `Authorization: Bearer <token>`
- Body: `{ make, model, year }`

---

## Notes

- This is a practice project with minimal validation and error handling.
- JWT is stored in `localStorage` for simplicity.
- In production, consider stronger security practices (HTTP-only cookies, stricter validation, rate limiting, and better secrets management).
