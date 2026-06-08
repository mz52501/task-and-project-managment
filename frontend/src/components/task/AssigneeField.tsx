import React, { useState, useRef, useEffect } from "react";
import { X, Search, UserPlus } from "lucide-react";
import { useProject } from "@/hooks/queries/useProjects";
import { addTaskAssignee, removeTaskAssignee } from "@/api/tasks";
import { useWorkspace } from "@/context/WorkspaceContext";
import { toast } from "sonner";

interface Assignee {
  id: string;
  name: string;
  initials: string;
}

interface Props {
  taskId: string;
  projectId: string;
  assignees: Assignee[];
  onChange: (assignees: Assignee[]) => void;
}

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-teal-500",
];

function avatarColor(id: string) {
  let n = 0;
  for (let i = 0; i < id.length; i++) n += id.charCodeAt(i);
  return AVATAR_COLORS[n % AVATAR_COLORS.length];
}

export function AssigneeField({ taskId, projectId, assignees, onChange }: Props) {
  const { currentWorkspace } = useWorkspace();
  const { data: project } = useProject(projectId);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const projectMembers = project?.members ?? [];
  const unassigned = projectMembers.filter((m) => !assignees.some((a) => a.id === m.user_id));
  const filtered = search.trim()
    ? unassigned.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()))
    : unassigned;

  async function handleAdd(member: { user_id: string; name: string; initials: string }) {
    if (!currentWorkspace) return;
    try {
      await addTaskAssignee(currentWorkspace.id, taskId, member.user_id);
      onChange([
        ...assignees,
        { id: member.user_id, name: member.name, initials: member.initials },
      ]);
    } catch {
      toast.error("Failed to add assignee");
    }
  }

  async function handleRemove(e: React.MouseEvent, userId: string) {
    e.stopPropagation();
    if (!currentWorkspace) return;
    try {
      await removeTaskAssignee(currentWorkspace.id, taskId, userId);
      onChange(assignees.filter((a) => a.id !== userId));
    } catch {
      toast.error("Failed to remove assignee");
    }
  }

  return (
    <div ref={containerRef} className="relative">
      {/* trigger pill */}
      <div
        onClick={() => setOpen((o) => !o)}
        className="group flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors cursor-pointer w-48"
      >
        {assignees.length === 0 ? (
          <span className="flex items-center gap-1.5 text-sm text-gray-400">
            <UserPlus className="w-3.5 h-3.5" />
            Assign
          </span>
        ) : assignees.length === 1 ? (
          <>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-none ${avatarColor(assignees[0].id)}`}
            >
              {assignees[0].initials}
            </div>
            <span className="text-sm text-gray-800 font-medium">{assignees[0].name}</span>
            <button
              onClick={(e) => handleRemove(e, assignees[0].id)}
              className="ml-auto p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <div className="flex items-center py-0.5">
            {assignees.map((a, i) => (
              <div
                key={a.id}
                className="relative"
                style={{ marginLeft: i > 0 ? "-8px" : "0", zIndex: assignees.length - i }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className={`group/avatar w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-white ${avatarColor(a.id)}`}
                  title={a.name}
                >
                  {a.initials}
                  <button
                    onClick={(e) => handleRemove(e, a.id)}
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gray-500 hover:bg-red-500 text-white items-center justify-center transition-colors cursor-pointer z-10 hidden group-hover/avatar:flex"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* dropdown */}
      {open && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-2 border-b border-gray-100">
            <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-gray-50">
              <Search className="w-3.5 h-3.5 text-gray-400 flex-none" />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search members..."
                className="text-sm bg-transparent outline-none w-full text-gray-800 placeholder:text-gray-400"
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">
                {unassigned.length === 0 ? "All members assigned" : "No members found"}
              </p>
            ) : (
              filtered.map((m) => (
                <button
                  key={m.user_id}
                  onClick={() => {
                    handleAdd(m);
                    setOpen(false);
                    setSearch("");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 transition-colors cursor-pointer text-left"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-none ${avatarColor(m.user_id)}`}
                  >
                    {m.initials}
                  </div>
                  <span className="text-sm text-gray-800">{m.name}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
