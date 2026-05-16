# Database Schema — HyperFlow

13 tables across 5 domains: users, projects, tasks, events, and audit/support tables.

---

## ERD

```mermaid
erDiagram
    users {
        bigint id PK
        string first_name
        string last_name
        string email
        string password_digest
        integer role
        string avatar
        timestamp created_at
        timestamp updated_at
    }

    projects {
        bigint id PK
        string name
        text description
        integer status
        date deadline
        timestamp created_at
        timestamp updated_at
    }

    project_members {
        bigint id PK
        bigint user_id FK
        bigint project_id FK
        integer role
        timestamp created_at
        timestamp updated_at
    }

    task_workflows {
        bigint id PK
        bigint project_id FK
        string name
        timestamp created_at
        timestamp updated_at
    }

    workflow_stages {
        bigint id PK
        bigint task_workflow_id FK
        string name
        integer position
        timestamp created_at
        timestamp updated_at
    }

    tasks {
        bigint id PK
        string title
        text description
        integer status
        integer priority
        date due_date
        bigint project_id FK
        bigint assigned_to_id FK
        bigint created_by_id FK
        bigint parent_task_id FK
        bigint workflow_stage_id FK
        timestamp created_at
        timestamp updated_at
    }

    subtasks {
        bigint id PK
        bigint task_id FK
        string title
        integer status
        timestamp created_at
        timestamp updated_at
    }

    comments {
        bigint id PK
        bigint task_id FK
        bigint user_id FK
        text content
        timestamp created_at
        timestamp updated_at
    }

    time_entries {
        bigint id PK
        bigint task_id FK
        bigint user_id FK
        integer duration_minutes
        date work_date
        text comment
        timestamp created_at
        timestamp updated_at
    }

    notifications {
        bigint id PK
        bigint user_id FK
        string message
        boolean read
        timestamp created_at
        timestamp updated_at
    }

    activity_logs {
        bigint id PK
        bigint user_id FK
        bigint project_id FK
        string action
        text details
        timestamp created_at
        timestamp updated_at
    }

    events {
        bigint id PK
        bigint creator_id FK
        bigint project_id FK
        string title
        date event_date
        time start_time
        timestamp created_at
        timestamp updated_at
    }

    event_attendees {
        bigint id PK
        bigint event_id FK
        bigint user_id FK
        integer status
        timestamp created_at
        timestamp updated_at
    }

    %% Users & Projects
    users ||--o{ project_members : "belongs to"
    projects ||--o{ project_members : "has many"

    %% Workflows
    projects ||--o{ task_workflows : "has many"
    task_workflows ||--o{ workflow_stages : "has many"

    %% Tasks
    projects ||--o{ tasks : "has many"
    users ||--o{ tasks : "assigned to"
    users ||--o{ tasks : "created by"
    tasks ||--o{ tasks : "parent → subtask (self-ref)"
    workflow_stages ||--o{ tasks : "categorizes"

    %% Task children
    tasks ||--o{ subtasks : "has many"
    tasks ||--o{ comments : "has many"
    tasks ||--o{ time_entries : "has many"

    %% Comments & time
    users ||--o{ comments : "writes"
    users ||--o{ time_entries : "logs"

    %% Events
    users ||--o{ events : "creates"
    projects ||--o{ events : "has many"
    events ||--o{ event_attendees : "has many"
    users ||--o{ event_attendees : "attends"

    %% Audit & notifications
    users ||--o{ notifications : "receives"
    users ||--o{ activity_logs : "generates"
    projects ||--o{ activity_logs : "scoped to"
```

---

## Enum Values

| Table | Column | Values |
|---|---|---|
| `users` | `role` | `0=admin` `1=member` |
| `projects` | `status` | `0=active` `1=on_hold` `2=completed` `3=archived` |
| `tasks` | `status` | `0=to_do` `1=in_progress` `2=done` `3=cancelled` |
| `tasks` | `priority` | `0=low` `1=medium` `2=high` `3=urgent` |
| `subtasks` | `status` | `0=to_do` `1=done` |
| `event_attendees` | `status` | `0=invited` `1=accepted` `2=declined` |

---

## Key Constraints

- `users.email` — unique index
- `project_members(user_id, project_id)` — unique index (no duplicate memberships)
- `event_attendees(event_id, user_id)` — unique index (no duplicate attendance)
- `tasks.parent_task_id` — self-referential FK (task hierarchy, one level)
- `tasks.assigned_to_id` — nullable (unassigned tasks allowed)
- `activity_logs.project_id` — nullable (some actions are not project-scoped)
- `events.project_id` — nullable (events can be standalone, not tied to a project)
