# HyperFlow — Architecture Overview

> Task & Project Management App — Master Thesis  
> Stack: Ruby on Rails 8 (API) + React 18 + TypeScript + PostgreSQL

---

## Monorepo Structure

```
task-and-project-managment/
├── backend/          ← Rails 8 API-only app (port 3001)
├── frontend/         ← React 18 + TypeScript app (port 3000)
├── bin/dev           ← starts both servers with one command
├── Procfile.dev      ← defines what bin/dev runs
└── ARCHITECTURE.md
```

**Start everything:**
```bash
./bin/dev
```

---

## Backend

### Tech
- Ruby 3.3 / Rails 8.1 (API-only mode)
- PostgreSQL
- JWT authentication (`jwt` gem + `bcrypt`)
- CORS configured for `http://localhost:3000`

### Directory Structure

```
backend/
├── app/
│   ├── controllers/        ← HTTP request handlers
│   ├── models/             ← ActiveRecord models (database layer)
│   └── services/           ← Plain Ruby classes (business logic)
├── config/
│   ├── routes.rb           ← All API routes defined here
│   ├── database.yml        ← PostgreSQL connection config
│   └── initializers/
│       └── cors.rb         ← CORS whitelist (allows localhost:3000)
├── db/
│   ├── migrate/            ← One file per table change (version controlled)
│   └── schema.rb           ← Auto-generated, shows current DB state
└── Gemfile                 ← Ruby dependencies
```

---

### Authentication

All endpoints except `POST /auth/login` and `POST /auth/register` require:
```
Authorization: Bearer <jwt_token>
```

**Flow:**
1. Client sends email + password to `POST /auth/login`
2. Rails verifies password with bcrypt
3. Rails encodes a JWT with `{ id, email, first_name, last_name, role, exp }`
4. Client stores token in `localStorage`
5. Every subsequent request sends `Authorization: Bearer <token>`
6. `ApplicationController#authenticate_request!` decodes and validates the token on every request

**Key files:**
- `app/services/json_web_token.rb` — `encode` / `decode` methods
- `app/controllers/application_controller.rb` — `authenticate_request!` before_action
- `app/controllers/auth_controller.rb` — login + register endpoints

---

### Database — 13 Tables

```
users
├── id, first_name, last_name, email (unique)
├── password_digest (bcrypt hash)
├── role (enum: admin=0, developer=1, client=2)
└── avatar

projects
├── id, name, description
├── status (enum: active=0, on_hold=1, completed=2, archived=3)
└── deadline

project_members             ← join table: which user belongs to which project
├── user_id → users
├── project_id → projects
└── role (enum: owner=0, developer=1, client=2)
    unique: (user_id, project_id)

tasks
├── id, title, description
├── status (enum: to_do=0, in_progress=1, done=2)
├── priority (enum: low=0, medium=1, high=2)
├── due_date
├── project_id → projects
├── assigned_to_id → users (optional)
├── created_by_id → users
├── parent_task_id → tasks (self-reference, for nested tasks)
└── workflow_stage_id → workflow_stages (optional)

subtasks                    ← simple checklist items on a task
├── task_id → tasks
├── title
└── status (enum: to_do=0, in_progress=1, done=2)

comments
├── task_id → tasks
├── user_id → users
└── content

time_entries                ← how long a user worked on a task
├── task_id → tasks
├── user_id → users
├── duration_minutes
├── work_date
└── comment

notifications
├── user_id → users
├── message
└── read (boolean, default: false)

activity_logs               ← audit trail of user actions
├── user_id → users
├── project_id → projects (optional)
├── action
└── details

task_workflows              ← custom workflow definition per project
├── project_id → projects
└── name

workflow_stages             ← stages within a workflow (e.g. "Design", "Dev", "QA")
├── task_workflow_id → task_workflows
├── name
└── position (integer, for ordering)

events                      ← calendar events
├── creator_id → users
├── project_id → projects (optional)
├── title, event_date, start_time

event_attendees             ← join table: who is attending which event
├── event_id → events
├── user_id → users
└── status (enum: invited=0, accepted=1, declined=2)
    unique: (event_id, user_id)
```

---

### Models & Relationships

```
User
  has_many :project_members
  has_many :projects (through project_members)
  has_many :assigned_tasks (Task, fk: assigned_to_id)
  has_many :created_tasks  (Task, fk: created_by_id)
  has_many :comments
  has_many :time_entries
  has_many :notifications
  has_many :activity_logs

Project
  has_many :project_members
  has_many :users (through project_members)
  has_many :tasks
  has_many :task_workflows
  has_many :activity_logs

Task
  belongs_to :project
  belongs_to :assigned_to (User, optional)
  belongs_to :created_by  (User)
  belongs_to :parent_task (Task, optional)
  belongs_to :workflow_stage (optional)
  has_many :child_tasks   (Task, fk: parent_task_id)
  has_many :subtasks
  has_many :comments
  has_many :time_entries

TaskWorkflow
  belongs_to :project
  has_many :workflow_stages

WorkflowStage
  belongs_to :task_workflow
  has_many :tasks

Event
  belongs_to :creator (User)
  belongs_to :project (optional)
  has_many :event_attendees
  has_many :attendees (User, through event_attendees)
```

---

### API Endpoints

All endpoints except auth require `Authorization: Bearer <token>`.

#### Auth
```
POST   /auth/login          { email, password }           → { token, user }
POST   /auth/register       { first_name, last_name,      → { token, user }
                              email, password, role }
```

#### Users
```
GET    /users               list all users
GET    /users/:id           get single user
```

#### Projects
```
GET    /projects            → { owned: [...], member: [...] }
POST   /projects            { name, description, status, deadline }
GET    /projects/:id
PATCH  /projects/:id
DELETE /projects/:id
POST   /projects/:id/members        { user_id, role }
DELETE /projects/:id/members/:id
GET    /projects/:id/workflows
POST   /projects/:id/workflows      { name }
```

#### Tasks
```
GET    /tasks               → { assigned: [...], created: [...] }
POST   /tasks               { title, description, status, priority,
                              due_date, project_id, assigned_to_id,
                              parent_task_id, workflow_stage_id }
GET    /tasks/:id
PATCH  /tasks/:id
DELETE /tasks/:id
GET    /tasks/:id/comments
POST   /tasks/:id/comments  { content }
GET    /tasks/:id/subtasks
POST   /tasks/:id/subtasks  { title, status }
```

#### Time Entries
```
GET    /time_entries
POST   /time_entries        { task_id, duration_minutes, work_date, comment }
DELETE /time_entries/:id
```

#### Comments
```
DELETE /comments/:id
```

#### Notifications
```
GET    /notifications
PATCH  /notifications/:id/mark_read
```

#### Events
```
GET    /events
POST   /events              { title, event_date, start_time, project_id }
DELETE /events/:id
```

---

## Frontend

### Tech
- React 18 + TypeScript (strict: false, allowJs: false)
- React Router v6
- Tailwind CSS 3
- Axios (API calls)
- Framer Motion (animations)
- @dnd-kit (drag and drop)
- Recharts (charts)
- Craco (CRA override for `@` path alias)

### Directory Structure

```
frontend/src/
├── api/                    ← all backend communication
│   ├── client.ts           ← Axios instance + JWT interceptor
│   ├── auth.ts             ← login, register
│   ├── projects.ts         ← project CRUD
│   ├── tasks.ts            ← tasks, comments, subtasks, time entries
│   └── notifications.ts    ← notifications
│
├── components/             ← reusable UI pieces
│   ├── dashboard/
│   │   ├── QuickStats.tsx        ← 4 stat cards (projects, tasks...)
│   │   ├── TodaysFocus.tsx       ← daily task list
│   │   ├── ProjectSnapshots.tsx  ← active projects with progress bars
│   │   ├── RecentActivity.tsx    ← activity feed
│   │   └── TimeTrackingWidget.tsx← timer + daily/weekly totals
│   ├── KanbanBoard.tsx     ← full drag-and-drop kanban
│   ├── KanbanColumn.tsx    ← single kanban column (droppable)
│   ├── ColumnContainer.tsx ← column with sortable context
│   ├── TaskCard.tsx        ← draggable task card
│   └── TaskTimer.tsx       ← start/stop timer UI
│
├── hooks/
│   └── useAuth.ts          ← reads token + user from localStorage
│
├── icons/
│   ├── PlusIcon.tsx
│   └── TrashIcon.tsx
│
├── pages/                  ← one file per route
│   ├── Login.tsx           ← login form (UI done, needs API wiring)
│   ├── Registration.tsx    ← register form (UI done, needs API wiring)
│   ├── Dashboard.tsx       ← main dashboard (mock data)
│   ├── Home.tsx            ← alternative dashboard view (mock data)
│   ├── Projects.tsx        ← project list (mock data)
│   ├── Projects2.tsx       ← alternative project view (mock data)
│   ├── Task.tsx            ← task detail (mock data)
│   ├── Landing.tsx         ← marketing landing page
│   ├── LandingPage.tsx     ← alternative landing page
│   ├── MyNavbar.tsx        ← layout wrapper with sidebar
│   └── NotFound.tsx        ← 404 page
│
├── router/
│   └── index.tsx           ← all routes + ProtectedRoute + GuestRoute
│
├── types/                  ← TypeScript interfaces
│   ├── index.ts            ← re-exports everything
│   ├── auth.ts             ← User, LoginRequest, RegisterRequest, AuthResponse
│   ├── project.ts          ← Project, ProjectMember, CreateProjectRequest
│   ├── task.ts             ← Task, Subtask, Comment, TimeEntry, CreateTaskRequest
│   ├── notification.ts     ← Notification
│   ├── kanban.ts           ← KanbanTask, Column, Id (kanban-specific)
│   └── api.ts              ← ApiError
│
├── App.tsx                 ← entry point, just renders <AppRouter />
└── index.tsx               ← React DOM root
```

---

### Routing

```
/landing          → Landing.tsx         (public)
/landing2         → LandingPage.tsx     (public)
/login            → Login.tsx           (guest only — redirects to / if logged in)
/registration     → Registration.tsx    (guest only — redirects to / if logged in)

/ (protected — redirects to /login if no token)
  /               → Dashboard.tsx
  /projects       → Projects.tsx
  /projects2      → Projects2.tsx
  /demo           → KanbanBoard.tsx
  /task/:id       → Task.tsx

*                 → NotFound.tsx
```

**ProtectedRoute** — checks `localStorage` for a JWT token. If missing, redirects to `/login`.  
**GuestRoute** — if already logged in, redirects away from `/login` and `/registration` to `/`.

---

### API Layer

`src/api/client.ts` is the Axios instance used by all API files.

- Sets `baseURL: http://localhost:3001`
- **Request interceptor:** reads token from `localStorage`, adds `Authorization: Bearer <token>` to every request automatically
- **Response interceptor:** if any request returns `401 Unauthorized`, clears `localStorage` and redirects to `/login`

Usage pattern in any component:
```ts
import { getProjects } from "@/api/projects";

const data = await getProjects();  // token is added automatically
```

---

### Types

All types live in `src/types/` and are imported via the `@/types` alias.

| File | What's in it |
|---|---|
| `auth.ts` | `User`, `UserRole`, `LoginRequest`, `RegisterRequest`, `AuthResponse` |
| `project.ts` | `Project`, `ProjectStatus`, `ProjectMember`, `MemberRole`, `CreateProjectRequest` |
| `task.ts` | `Task`, `TaskStatus`, `TaskPriority`, `Subtask`, `Comment`, `TimeEntry`, `CreateTaskRequest` |
| `notification.ts` | `Notification` |
| `kanban.ts` | `KanbanTask`, `Column`, `Id` (used only by kanban drag-drop components) |
| `api.ts` | `ApiError` |

Import anything from anywhere:
```ts
import { Task, User, Project } from "@/types";
```

---

### What's Done vs What Needs Wiring

| Page / Feature | UI | Backend | Connected |
|---|---|---|---|
| Login | ✅ | ✅ | ❌ |
| Registration | ✅ | ✅ | ❌ |
| Dashboard | ✅ (mock data) | ✅ | ❌ |
| Projects list | ✅ (mock data) | ✅ | ❌ |
| Kanban board | ✅ (mock data) | ✅ | ❌ |
| Task detail | ✅ (mock data) | ✅ | ❌ |
| Notifications | ✅ (mock data) | ✅ | ❌ |
| Time tracking | ✅ (mock data) | ✅ | ❌ |
| Comments | ✅ (mock data) | ✅ | ❌ |

---

## Git

- Repo: `github.com/mz52501/task-and-project-managment`
- Default branch: `main`
- Workflow: feature branches → merge to `main`

```bash
git checkout -b feature/login-api
# work...
git add .
git commit -m "wire login form to POST /auth/login"
git checkout main
git merge feature/login-api
git push
```
