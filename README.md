# HyperFlow

> A full-stack task and project management application built as a Master's thesis project.

---

## Overview

HyperFlow is a web application for managing projects, tasks, and team collaboration. It supports kanban boards, time tracking, comments, notifications, and calendar events.

Built as a monorepo with a decoupled backend API and frontend SPA.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Ruby on Rails 8.1 (API-only) |
| Database | PostgreSQL |
| Authentication | JWT + bcrypt |
| Frontend | React 18 + TypeScript |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| HTTP client | Axios |
| Drag & drop | @dnd-kit |
| Animations | Framer Motion |
| Charts | Recharts |

---

## Project Structure

```
task-and-project-managment/
├── backend/        Rails API (port 3001)
├── frontend/       React + TypeScript SPA (port 3000)
├── bin/dev         starts both servers
├── Procfile.dev    process definitions for bin/dev
├── ARCHITECTURE.md detailed technical documentation
└── README.md
```

---

## Getting Started

### Prerequisites

- Ruby 3.3+
- Rails 8.1+
- Node 20+
- PostgreSQL running locally

### 1. Clone the repo

```bash
git clone https://github.com/mz52501/task-and-project-managment.git
cd task-and-project-managment
```

### 2. Install dependencies

```bash
# Backend
cd backend && bundle install

# Frontend
cd ../frontend && npm install
```

### 3. Set up the database

```bash
cd backend
rails db:create db:migrate
```

### 4. Start both servers

From the repo root:

```bash
./bin/dev
```

This starts:
- Rails API on **http://localhost:3001**
- React app on **http://localhost:3000**

---

## Frontend Scripts

Run from the `frontend/` directory:

```bash
npm start          # start dev server
npm run build      # production build
npm run lint       # check for ESLint errors
npm run lint:fix   # auto-fix ESLint errors
npm run format     # check Prettier formatting
npm run format:fix # auto-format all files
```

---

## Authentication

All API endpoints except login and register require a Bearer token:

```
Authorization: Bearer <jwt_token>
```

Tokens are returned from:

```
POST /auth/login     { email, password }
POST /auth/register  { first_name, last_name, email, password }
```

Tokens expire after **60 minutes**. The frontend automatically attaches the token to every request and redirects to `/login` on a `401` response.

---

## Database

13 tables — full schema in [`ARCHITECTURE.md`](./ARCHITECTURE.md).

| Table | Description |
|---|---|
| `users` | User accounts with roles (admin, developer, client) |
| `projects` | Projects with status and deadline |
| `project_members` | User ↔ Project membership with roles |
| `tasks` | Tasks with status, priority, assignee, parent task |
| `subtasks` | Simple checklist items on a task |
| `comments` | Comments on tasks |
| `time_entries` | Time logs per task per user |
| `notifications` | User notifications with read/unread state |
| `activity_logs` | Audit trail of user actions |
| `task_workflows` | Custom workflow definitions per project |
| `workflow_stages` | Ordered stages within a workflow |
| `events` | Calendar events |
| `event_attendees` | User ↔ Event attendance with status |

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/auth/login` | Login, returns JWT |
| POST | `/auth/register` | Register, returns JWT |
| GET | `/users` | List all users |
| GET | `/projects` | Owned + member projects |
| POST | `/projects` | Create project |
| PATCH | `/projects/:id` | Update project |
| DELETE | `/projects/:id` | Delete project |
| POST | `/projects/:id/members` | Add member to project |
| DELETE | `/projects/:id/members/:id` | Remove member |
| GET | `/tasks` | Assigned + created tasks |
| POST | `/tasks` | Create task |
| PATCH | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |
| GET | `/tasks/:id/comments` | List comments |
| POST | `/tasks/:id/comments` | Add comment |
| GET | `/tasks/:id/subtasks` | List subtasks |
| POST | `/tasks/:id/subtasks` | Add subtask |
| GET | `/time_entries` | List time entries |
| POST | `/time_entries` | Log time |
| DELETE | `/time_entries/:id` | Delete time entry |
| GET | `/notifications` | List notifications |
| PATCH | `/notifications/:id/mark_read` | Mark as read |
| GET | `/events` | List events |
| POST | `/events` | Create event |
| DELETE | `/events/:id` | Delete event |

---

## Frontend Structure

```
frontend/src/
├── api/          Axios calls (client, auth, projects, tasks, notifications)
├── components/   Reusable UI (KanbanBoard, TaskCard, dashboard widgets)
├── hooks/        Custom hooks (useAuth)
├── pages/        Route-level components (Login, Dashboard, Projects, Task...)
├── router/       Route definitions + ProtectedRoute + GuestRoute
└── types/        TypeScript interfaces (auth, project, task, notification...)
```

Full details in [`ARCHITECTURE.md`](./ARCHITECTURE.md).

---

## Git Workflow

```bash
# Start a new feature
git checkout -b feature/your-feature

# Commit your work
git add .
git commit -m "description of change"

# Merge back to main
git checkout main
git merge feature/your-feature
git push
```
