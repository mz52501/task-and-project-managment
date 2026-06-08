import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Briefcase, CheckCircle2, Clock, Calendar, Loader2 } from "lucide-react";
import { useMe } from "@/hooks/queries/useMe";

const roleStyles: Record<string, string> = {
  owner: "bg-blue-100 text-blue-800",
  admin: "bg-blue-100 text-blue-800",
  developer: "bg-purple-100 text-purple-800",
  client: "bg-gray-200 text-gray-800",
};

const Profile = () => {
  const { data: user, isLoading } = useMe();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) return null;

  const initials = `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Info */}
        <Card className="rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-5">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="bg-blue-100 text-blue-800 text-2xl font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.first_name} {user.last_name}
                </h1>
                <p className="text-gray-500 text-sm">{user.email}</p>
                <Badge
                  className={`mt-1 capitalize ${roleStyles[user.role] ?? "bg-gray-100 text-gray-800"}`}
                  variant="secondary"
                >
                  {user.role}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details */}
        <Card className="rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Details</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                First Name
              </p>
              <p className="text-sm text-gray-800 mt-1">{user.first_name}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Last Name
              </p>
              <p className="text-sm text-gray-800 mt-1">{user.last_name}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Email</p>
              <p className="text-sm text-gray-800 mt-1">{user.email}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Role</p>
              <p className="text-sm text-gray-800 mt-1 capitalize">{user.role}</p>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className="rounded-xl">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Projects</p>
                  <p className="text-2xl font-bold">{user.projects_count}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-green-50 text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tasks Completed</p>
                  <p className="text-2xl font-bold">{user.tasks_completed}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-yellow-50 text-yellow-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hours Logged</p>
                  <p className="text-2xl font-bold">{user.hours_logged}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="text-base font-semibold">{user.member_since}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
