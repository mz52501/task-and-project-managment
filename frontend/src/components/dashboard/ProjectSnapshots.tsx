import React from "react";
import { Link } from "react-router-dom";
import { Folder, Users, Calendar } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ProjectSnapshot } from "@/api/dashboard";

function getStatus(project: ProjectSnapshot): "ahead" | "on-track" | "behind" {
  if (!project.deadline || project.total_tasks === 0) return "on-track";
  const actual = project.completed_tasks / project.total_tasks;
  const start = new Date(project.created_at).getTime();
  const end = new Date(project.deadline).getTime();
  const now = Date.now();
  const expected = end <= start ? 1 : Math.min((now - start) / (end - start), 1);
  if (actual > expected + 0.1) return "ahead";
  if (actual < expected - 0.1) return "behind";
  return "on-track";
}

const statusColors: Record<string, string> = {
  ahead: "text-green-600 bg-green-100",
  "on-track": "text-blue-600 bg-blue-100",
  behind: "text-red-600 bg-red-100",
};

interface Props {
  snapshots: ProjectSnapshot[];
}

const ProjectSnapshots = ({ snapshots }: Props) => {
  return (
    <Card>
      <CardHeader className="border-b pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-base">
            <Folder className="w-5 h-5 text-blue-600 mr-2" />
            Active Projects
          </CardTitle>
          <Link
            to="/projects"
            className="text-sm border rounded px-3 py-1 hover:bg-gray-50 text-gray-700"
          >
            View All
          </Link>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {snapshots.length === 0 ? (
          <p className="text-sm text-gray-500 py-4 text-center">No active projects</p>
        ) : (
          snapshots.map((project) => {
            const status = getStatus(project);
            const progress =
              project.total_tasks > 0
                ? Math.round((project.completed_tasks / project.total_tasks) * 100)
                : 0;
            return (
              <div
                key={project.id}
                className="border rounded-lg p-4 hover:shadow transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{project.name}</h3>
                    <div className="flex gap-4 text-sm text-gray-500 mt-1">
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {project.team_members} members
                      </span>
                      {project.deadline && (
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Due {project.deadline}
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-medium ${statusColors[status]}`}
                  >
                    {status.replace("-", " ")}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>
                      {project.completed_tasks} of {project.total_tasks} tasks completed
                    </span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded h-2 overflow-hidden">
                    <div className="bg-blue-600 h-2" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectSnapshots;
