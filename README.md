# Task & Project Management App

Master thesis project — a full-stack task and project management application.

## Stack

- **Backend**: Ruby on Rails 8 (API-only) + PostgreSQL
- **Frontend**: React 18 + TypeScript + Tailwind CSS

## Getting started

### Backend (runs on port 3001)

```bash
cd backend
bundle install
rails db:create db:migrate
rails server -p 3001
```

### Frontend (runs on port 3000)

```bash
cd frontend
npm install
npm start
```

## API Auth

All endpoints except `POST /auth/login` and `POST /auth/register` require:

```
Authorization: Bearer <jwt_token>
```
