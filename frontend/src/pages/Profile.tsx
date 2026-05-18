import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Briefcase, CheckCircle2, Clock, Calendar } from "lucide-react";

const Profile = () => {
  const user = {
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.doe@hyperflow.app",
    role: "admin",
    initials: "JD",
    projectsAssigned: 12,
    tasksCompleted: 184,
    hoursLogged: 432,
    memberSince: "March 12, 2024",
  };

  const roleColor =
    user.role === "admin"
      ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
      : user.role === "developer"
        ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
        : "bg-gray-200 text-gray-800 hover:bg-gray-200";

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Info */}
        <Card className="rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-5">
                <Avatar className="w-20 h-20 text-xl">
                  <AvatarFallback className="bg-blue-100 text-blue-800 text-2xl font-semibold">
                    {user.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-gray-500">{user.email}</p>
                  <Badge className={`mt-2 capitalize ${roleColor}`} variant="secondary">
                    {user.role}
                  </Badge>
                </div>
              </div>
              <Button variant="outline">
                <Pencil className="w-4 h-4" /> Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg">Edit Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" defaultValue={user.firstName} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" defaultValue={user.lastName} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={user.email} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current password</Label>
                <Input id="currentPassword" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New password</Label>
                <Input id="newPassword" type="password" placeholder="••••••••" />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button>Save Changes</Button>
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
                  <p className="text-sm text-gray-500">Projects Assigned</p>
                  <p className="text-2xl font-bold">{user.projectsAssigned}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-green-50 text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tasks Completed</p>
                  <p className="text-2xl font-bold">{user.tasksCompleted}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-yellow-50 text-yellow-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hours Logged</p>
                  <p className="text-2xl font-bold">{user.hoursLogged}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="text-base font-semibold">{user.memberSince}</p>
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
