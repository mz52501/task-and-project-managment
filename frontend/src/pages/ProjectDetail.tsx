import React from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Calendar,
  Plus,
  Pencil,
  UserPlus,
  X,
  CheckCircle2,
  GitCommit,
  MessageCircle,
  UserPlus2,
} from "lucide-react";
import KanbanBoard from "@/components/KanbanBoard";

const statusStyles: Record<string, string> = {
  active: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  on_hold: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  completed: "bg-green-100 text-green-800 hover:bg-green-100",
  archived: "bg-gray-200 text-gray-800 hover:bg-gray-200",
};

const roleStyles: Record<string, string> = {
  owner: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  developer: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  client: "bg-gray-200 text-gray-800 hover:bg-gray-200",
};

const tagColors = [
  "border-blue-300 text-blue-700 bg-blue-50",
  "border-purple-300 text-purple-700 bg-purple-50",
  "border-green-300 text-green-700 bg-green-50",
  "border-orange-300 text-orange-700 bg-orange-50",
  "border-pink-300 text-pink-700 bg-pink-50",
];

const ProjectDetail = () => {
  useParams();

  const project = {
    name: "E-commerce Platform",
    description:
      "Build a modern, scalable e-commerce platform with checkout, inventory, and analytics.",
    status: "active",
    deadline: "Jun 30, 2026",
    members: [
      { initials: "JD", name: "Jane Doe", role: "owner" },
      { initials: "SM", name: "Sam Miller", role: "developer" },
      { initials: "MJ", name: "Mia Johnson", role: "developer" },
      { initials: "ER", name: "Eli Ramirez", role: "developer" },
      { initials: "AB", name: "Alex Brown", role: "client" },
    ],
    tags: ["Frontend", "Backend", "Design", "Urgent", "Q2"],
  };

  const activity = [
    {
      icon: CheckCircle2,
      color: "text-green-600 bg-green-50",
      text: 'Mia completed "Implement user dashboard"',
      time: "2 min ago",
    },
    {
      icon: MessageCircle,
      color: "text-blue-600 bg-blue-50",
      text: 'Sam commented on "Setup database schema"',
      time: "24 min ago",
    },
    {
      icon: GitCommit,
      color: "text-purple-600 bg-purple-50",
      text: "Eli pushed 3 commits to API integration",
      time: "1 h ago",
    },
    {
      icon: UserPlus2,
      color: "text-orange-600 bg-orange-50",
      text: "Alex was added as a client",
      time: "3 h ago",
    },
    {
      icon: CheckCircle2,
      color: "text-green-600 bg-green-50",
      text: 'Jane completed "Project setup"',
      time: "Yesterday",
    },
    {
      icon: MessageCircle,
      color: "text-blue-600 bg-blue-50",
      text: 'New comment on "Payment gateway integration"',
      time: "2 d ago",
    },
  ];

  return (
    <div className="bg-gray-50 flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      {/* Header card */}
      <div className="px-8 pt-6 pb-0 flex-none max-w-[1800px] mx-auto w-full">
        <Card className="rounded-xl">
          <CardContent className="p-5">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                  <Badge
                    className={`capitalize ${statusStyles[project.status]}`}
                    variant="secondary"
                  >
                    {project.status.replace("_", " ")}
                  </Badge>
                </div>
                <p className="text-gray-500 mt-1 text-sm">{project.description}</p>
                <div className="flex items-center gap-6 mt-3 flex-wrap">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Deadline:{" "}
                    <span className="font-medium text-gray-900 ml-1">{project.deadline}</span>
                  </div>
                  <div className="flex items-center">
                    {project.members.slice(0, 5).map((m, i) => (
                      <Avatar
                        key={i}
                        className={`w-7 h-7 border-2 border-white ${i > 0 ? "-ml-2" : ""}`}
                      >
                        <AvatarFallback className="text-xs bg-gray-100">
                          {m.initials}
                        </AvatarFallback>
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
                <Button variant="outline" size="sm">
                  <Pencil className="w-4 h-4" /> Edit Project
                </Button>
                <Button size="sm">
                  <UserPlus className="w-4 h-4" /> Add Member
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main content */}
      <div className="flex-1 flex gap-4 px-8 py-4 min-h-0 overflow-hidden max-w-[1800px] mx-auto w-full">
        {/* Kanban — takes remaining height */}
        <div className="flex-[3] min-w-0 min-h-0">
          <KanbanBoard height="100%" />
        </div>

        {/* Sidebar */}
        <div className="flex-[1] min-w-0 flex flex-col gap-4 overflow-y-auto">
          {/* Members */}
          <Card className="rounded-xl flex-none">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-semibold">Members</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-1">
              {project.members.map((m, i) => (
                <div
                  key={i}
                  className="group flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs bg-gray-100">{m.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{m.name}</p>
                      <Badge
                        className={`capitalize text-xs ${roleStyles[m.role]}`}
                        variant="secondary"
                      >
                        {m.role}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 h-7 w-7 text-gray-400 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="rounded-xl flex-none">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-semibold">Tags</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="flex flex-wrap gap-2">
                {project.tags.map((t, i) => (
                  <span
                    key={i}
                    className={`text-xs px-2.5 py-1 rounded-full border ${tagColors[i % tagColors.length]}`}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <Button variant="outline" size="sm" className="mt-3">
                <Plus className="w-4 h-4" /> Add Tag
              </Button>
            </CardContent>
          </Card>

          {/* Activity */}
          <Card className="rounded-xl flex-none">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="space-y-3">
                {activity.map((a, i) => {
                  const Icon = a.icon;
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`p-1.5 rounded-full flex-none ${a.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 leading-snug">{a.text}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
