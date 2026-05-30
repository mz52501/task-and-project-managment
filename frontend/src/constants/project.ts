import { ProjectStatus } from "@/types";

export const TAG_COLORS = [
  "border-blue-300 text-blue-700 bg-blue-50",
  "border-purple-300 text-purple-700 bg-purple-50",
  "border-green-300 text-green-700 bg-green-50",
  "border-orange-300 text-orange-700 bg-orange-50",
  "border-pink-300 text-pink-700 bg-pink-50",
  "border-cyan-300 text-cyan-700 bg-cyan-50",
  "border-red-300 text-red-700 bg-red-50",
  "border-yellow-300 text-yellow-700 bg-yellow-50",
  "border-indigo-300 text-indigo-700 bg-indigo-50",
  "border-teal-300 text-teal-700 bg-teal-50",
];

export function tagColor(name: string): string {
  const index = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % TAG_COLORS.length;
  return TAG_COLORS[index];
}

export const STATUS_OPTIONS: { value: ProjectStatus; label: string; color: string }[] = [
  { value: "planning", label: "Planning", color: "bg-gray-100 text-gray-800" },
  { value: "active", label: "Active", color: "bg-blue-100 text-blue-800" },
  { value: "on_hold", label: "On Hold", color: "bg-yellow-100 text-yellow-800" },
  { value: "completed", label: "Completed", color: "bg-green-100 text-green-800" },
  { value: "archived", label: "Archived", color: "bg-gray-200 text-gray-600" },
];
