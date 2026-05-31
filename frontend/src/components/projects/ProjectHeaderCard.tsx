import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Pencil, UserPlus } from "lucide-react";
import { ProjectDetail } from "@/api/projects";

const statusStyles: Record<string, string> = {
  active: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  on_hold: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  completed: "bg-green-100 text-green-800 hover:bg-green-100",
  archived: "bg-gray-200 text-gray-800 hover:bg-gray-200",
};

interface Props {
  project: ProjectDetail;
  onEdit: () => void;
  onAddMember: () => void;
}

export function ProjectHeaderCard({ project, onEdit, onAddMember }: Props) {
  return (
    <Card className="rounded-xl">
      <CardContent className="p-5">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
              <Badge className={`capitalize ${statusStyles[project.status] ?? ""}`} variant="secondary">
                {project.status.replace("_", " ")}
              </Badge>
            </div>
            {project.description && (
              <p className="text-gray-500 mt-1 text-sm">{project.description}</p>
            )}
            <div className="flex items-center gap-6 mt-3 flex-wrap">
              {project.deadline && (
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Deadline:{" "}
                  <span className="font-medium text-gray-900 ml-1">
                    {new Date(project.deadline).toLocaleDateString()}
                  </span>
                </div>
              )}
              <div className="flex items-center">
                {project.members.slice(0, 5).map((m, i) => (
                  <Avatar key={m.id} className={`w-7 h-7 border-2 border-white ${i > 0 ? "-ml-2" : ""}`}>
                    <AvatarFallback className="text-xs bg-gray-100">{m.initials}</AvatarFallback>
                  </Avatar>
                ))}
                {project.members.length > 5 && (
                  <div className="w-7 h-7 -ml-2 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-700">
                    +{project.members.length - 5}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-none">
            <Button variant="outline" onClick={onEdit}>
              <Pencil /> Edit Project
            </Button>
            <Button onClick={onAddMember}>
              <UserPlus /> Add Member
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
