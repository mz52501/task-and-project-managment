puts "Seeding database..."

# ── Workspace ──────────────────────────────────────────────────────────────────
workspace = Workspace.create!(
  name: "Decode Agency"
)

# ── Users ──────────────────────────────────────────────────────────────────────
marko = User.create!(
  first_name: "Marko",
  last_name:  "Zura",
  email:      "marko@decode.com",
  password:   "password123",
  role:       "admin",
  current_workspace_id: workspace.id
)

sara = User.create!(
  first_name: "Sara",
  last_name:  "Chen",
  email:      "sara@decode.com",
  password:   "password123",
  role:       "developer",
  current_workspace_id: workspace.id
)

mike = User.create!(
  first_name: "Mike",
  last_name:  "Johnson",
  email:      "mike@decode.com",
  password:   "password123",
  role:       "developer",
  current_workspace_id: workspace.id
)

# ── Workspace members ──────────────────────────────────────────────────────────
WorkspaceMember.create!(workspace: workspace, user: marko, role: "admin")
WorkspaceMember.create!(workspace: workspace, user: sara,  role: "member")
WorkspaceMember.create!(workspace: workspace, user: mike,  role: "member")

# ── Project 1: HyperFlow ───────────────────────────────────────────────────────
hyperflow = Project.create!(
  workspace:   workspace,
  name:        "HyperFlow",
  description: "Internal project management platform built for the master's thesis.",
  status:      "active",
  start_date:  Date.today - 30,
  deadline:    Date.today + 60
)

ProjectMember.create!(project: hyperflow, user: marko, role: "owner")
ProjectMember.create!(project: hyperflow, user: sara,  role: "developer")
ProjectMember.create!(project: hyperflow, user: mike,  role: "developer")

Tag.create!([
  { project: hyperflow, name: "backend" },
  { project: hyperflow, name: "frontend" },
  { project: hyperflow, name: "urgent" },
  { project: hyperflow, name: "bug" },
])

todo        = hyperflow.workflow_stages.find_by(name: "To Do")
in_progress = hyperflow.workflow_stages.find_by(name: "In Progress")
done        = hyperflow.workflow_stages.find_by(name: "Done")

backend_tag  = hyperflow.tags.find_by(name: "backend")
frontend_tag = hyperflow.tags.find_by(name: "frontend")
urgent_tag   = hyperflow.tags.find_by(name: "urgent")
bug_tag      = hyperflow.tags.find_by(name: "bug")

t1 = Task.create!(project: hyperflow, workflow_stage: todo,        created_by: marko, title: "Set up Rails API project",          priority: "high",   description: "Initialize Rails 8 API-only app with PostgreSQL.")
t2 = Task.create!(project: hyperflow, workflow_stage: todo,        created_by: marko, title: "Implement JWT authentication",       priority: "high",   description: "Login and register endpoints with JWT tokens.")
t3 = Task.create!(project: hyperflow, workflow_stage: in_progress, created_by: marko, title: "Build Kanban board with drag-drop",  priority: "high",   description: "Use dnd-kit for drag and drop across stages.", due_date: Date.today + 3)
t4 = Task.create!(project: hyperflow, workflow_stage: in_progress, created_by: sara,  title: "Workspace switcher in sidebar",      priority: "medium", description: "Dropdown showing all workspaces with switch functionality.")
t5 = Task.create!(project: hyperflow, workflow_stage: in_progress, created_by: marko, title: "Invite system with token links",     priority: "medium", description: "Generate invite tokens, accept flow for new and existing users.", due_date: Date.today + 7)
t6 = Task.create!(project: hyperflow, workflow_stage: done,        created_by: marko, title: "Project creation form",             priority: "medium", description: "Form with name, description, status, dates, members, tags.")
t7 = Task.create!(project: hyperflow, workflow_stage: done,        created_by: sara,  title: "Profile page with real stats",      priority: "low",    description: "Show user info and real stats from DB.")
t8 = Task.create!(project: hyperflow, workflow_stage: todo,        created_by: mike,  title: "Fix drag-drop persistence on refresh", priority: "high", description: "Stage changes lost on page refresh.", due_date: Date.today + 1)
t9 = Task.create!(project: hyperflow, workflow_stage: todo,        created_by: marko, title: "My Tasks cross-project view",       priority: "medium", description: "List all tasks assigned to current user across workspace projects.")

TaskAssignment.create!(task: t1, user: marko)
TaskAssignment.create!(task: t2, user: marko)
TaskAssignment.create!(task: t3, user: sara)
TaskAssignment.create!(task: t3, user: mike)
TaskAssignment.create!(task: t4, user: sara)
TaskAssignment.create!(task: t5, user: marko)
TaskAssignment.create!(task: t6, user: sara)
TaskAssignment.create!(task: t7, user: sara)
TaskAssignment.create!(task: t8, user: mike)
TaskAssignment.create!(task: t9, user: marko)

TaskTag.create!(task: t1, tag: backend_tag)
TaskTag.create!(task: t2, tag: backend_tag)
TaskTag.create!(task: t3, tag: frontend_tag)
TaskTag.create!(task: t4, tag: frontend_tag)
TaskTag.create!(task: t5, tag: backend_tag)
TaskTag.create!(task: t8, tag: bug_tag)
TaskTag.create!(task: t8, tag: urgent_tag)

Comment.create!(task: t3, user: sara,  content: "dnd-kit is working great, just need to wire up the backend PATCH call.")
Comment.create!(task: t3, user: mike,  content: "I can take a look at the persistence issue.")
Comment.create!(task: t8, user: mike,  content: "Found the bug -- dragStartColumnRef was not being set correctly.")

TimeEntry.create!(task: t3, user: sara,  duration_minutes: 120, work_date: Date.today - 2, comment: "Initial dnd-kit setup")
TimeEntry.create!(task: t3, user: mike,  duration_minutes:  90, work_date: Date.today - 1, comment: "Fixed column drop zones")
TimeEntry.create!(task: t6, user: sara,  duration_minutes: 180, work_date: Date.today - 5, comment: "Built the full form")
TimeEntry.create!(task: t2, user: marko, duration_minutes:  60, work_date: Date.today - 7, comment: "JWT encode/decode setup")

# ── Project 2: Website Redesign ────────────────────────────────────────────────
website = Project.create!(
  workspace:   workspace,
  name:        "Website Redesign",
  description: "Redesign of the company marketing website.",
  status:      "planning",
  start_date:  Date.today + 7,
  deadline:    Date.today + 90
)

ProjectMember.create!(project: website, user: marko, role: "owner")
ProjectMember.create!(project: website, user: mike,  role: "client")

Tag.create!([
  { project: website, name: "design" },
  { project: website, name: "copywriting" },
  { project: website, name: "seo" },
])

w_todo        = website.workflow_stages.find_by(name: "To Do")
w_in_progress = website.workflow_stages.find_by(name: "In Progress")

design_tag = website.tags.find_by(name: "design")
seo_tag    = website.tags.find_by(name: "seo")

w1 = Task.create!(project: website, workflow_stage: w_todo,        created_by: marko, title: "Define new brand guidelines",   priority: "high",   due_date: Date.today + 14)
w2 = Task.create!(project: website, workflow_stage: w_todo,        created_by: marko, title: "Design homepage mockup",        priority: "high",   due_date: Date.today + 21)
w3 = Task.create!(project: website, workflow_stage: w_in_progress, created_by: mike,  title: "SEO audit of current site",     priority: "medium", due_date: Date.today + 10)
w4 = Task.create!(project: website, workflow_stage: w_todo,        created_by: marko, title: "Write new landing page copy",   priority: "medium")

TaskAssignment.create!(task: w1, user: marko)
TaskAssignment.create!(task: w2, user: mike)
TaskAssignment.create!(task: w3, user: mike)
TaskAssignment.create!(task: w4, user: marko)

TaskTag.create!(task: w1, tag: design_tag)
TaskTag.create!(task: w2, tag: design_tag)
TaskTag.create!(task: w3, tag: seo_tag)

puts "Done! Seeded:"
puts "  1 workspace: Decode Agency"
puts "  3 users: marko@decode.com, sara@decode.com, mike@decode.com (password: password123)"
puts "  2 projects: HyperFlow (#{hyperflow.workflow_stages.count} stages, #{hyperflow.tasks.count} tasks), Website Redesign (#{website.tasks.count} tasks)"
