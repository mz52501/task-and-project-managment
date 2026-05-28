import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useTaskTimeEntries } from "@/hooks/useTimeEntries";

interface Props {
  hook: ReturnType<typeof useTaskTimeEntries>;
}

export function TimeTrackingCard({ hook }: Props) {
  const {
    timeEntries,
    newEntry,
    setNewEntry,
    logTime,
    editingId,
    setEditingId,
    editDraft,
    setEditDraft,
    startEdit,
    saveEdit,
    removeEntry,
    minutesToDisplay,
  } = hook;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Time Tracking</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Label className="text-xs text-gray-500">Hours</Label>
            <Input
              placeholder="2h 30m"
              value={newEntry.hours}
              onChange={(e) => setNewEntry({ ...newEntry, hours: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && logTime()}
            />
          </div>
          <Button onClick={logTime}>Log Time</Button>
        </div>
        <div>
          <Label className="text-xs text-gray-500">Description</Label>
          <Input
            placeholder="What did you work on?"
            value={newEntry.description}
            onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && logTime()}
          />
        </div>

        <Separator />

        <div className="space-y-2">
          <h4 className="font-medium text-sm">Recent Entries</h4>
          {timeEntries.length === 0 && <p className="text-xs text-gray-400">No time logged yet.</p>}
          {timeEntries.map((entry) => (
            <div key={entry.id} className="group text-xs p-2 bg-gray-50 rounded">
              {editingId === entry.id ? (
                <div className="space-y-1.5">
                  <Input
                    value={editDraft.hours}
                    onChange={(e) => setEditDraft({ ...editDraft, hours: e.target.value })}
                    className="h-7 text-xs"
                    placeholder="2h 30m"
                    onKeyDown={(e) => e.key === "Enter" && saveEdit(entry.id)}
                    autoFocus
                  />
                  <Input
                    value={editDraft.description}
                    onChange={(e) => setEditDraft({ ...editDraft, description: e.target.value })}
                    className="h-7 text-xs"
                    placeholder="Description"
                    onKeyDown={(e) => e.key === "Enter" && saveEdit(entry.id)}
                  />
                  <div className="flex gap-1">
                    <Button size="xs" onClick={() => saveEdit(entry.id)}>
                      Save
                    </Button>
                    <Button size="xs" variant="outline" onClick={() => setEditingId(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{minutesToDisplay(entry.duration_minutes)}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">{entry.work_date}</span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEdit(entry)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeEntry(entry.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {entry.comment && <p className="text-gray-600 mt-0.5">{entry.comment}</p>}
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
