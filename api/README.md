# Local API (Minimal)

Minimal Express API for local development of `liminality-admin`.

## Endpoints

- `POST /auth/login`
- `POST /auth/logout`
- `GET /posts`
- `GET /posts/:id`
- `POST /posts`
- `PUT /posts/:id`
- `DELETE /posts/:id`
- `GET /health`

## Setup

```bash
cd api
npm install
cp .env.example .env
npm start
```

Default login credentials:

- email: `admin@example.com`
- password: `admin123`

## Connect admin frontend

In `liminality-admin/.env`:

```env
REACT_APP_API_BASE_URL=http://localhost:4000
REACT_APP_TEMP_ADMIN_ENABLED=false
```
