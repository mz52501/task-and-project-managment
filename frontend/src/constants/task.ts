export const STATUS_OPTIONS = ["To Do", "In Progress", "Review", "Done"];
export const PRIORITY_OPTIONS = ["Low", "Medium", "High"];

export const statusColors: Record<string, string> = {
  "To Do": "bg-gray-100 text-gray-700",
  "In Progress": "bg-blue-100 text-blue-800",
  Review: "bg-yellow-100 text-yellow-800",
  Done: "bg-green-100 text-green-800",
};

export const priorityColors: Record<string, string> = {
  Low: "bg-green-100 text-green-800",
  Medium: "bg-yellow-100 text-yellow-800",
  High: "bg-red-100 text-red-800",
};

export const statusStroke: Record<string, string> = {
  "To Do": "#9ca3af",
  "In Progress": "#93c5fd",
  Review: "#fde047",
  Done: "#86efac",
};
