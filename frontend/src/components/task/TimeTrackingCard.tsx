import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useTimeEntries } from "@/hooks/useTimeEntries";

export function TimeTrackingCard() {
  const {
    timeEntries,
    newTimeEntry,
    setNewTimeEntry,
    editingEntry,
    setEditingEntry,
    editEntryData,
    setEditEntryData,
    logTime,
    deleteTimeEntry,
    startEditEntry,
    saveEditEntry,
  } = useTimeEntries();

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
              value={newTimeEntry.hours}
              onChange={(e) => setNewTimeEntry({ ...newTimeEntry, hours: e.target.value })}
            />
          </div>
          <Button onClick={logTime} className="cursor-pointer">Log Time</Button>
        </div>
        <div>
          <Label className="text-xs text-gray-500">Description</Label>
          <Input
            placeholder="What did you work on?"
            value={newTimeEntry.description}
            onChange={(e) => setNewTimeEntry({ ...newTimeEntry, description: e.target.value })}
          />
        </div>

        <Separator />

        <div className="space-y-2">
          <h4 className="font-medium text-sm">Recent Entries</h4>
          {timeEntries.map((entry) => (
            <div key={entry.id} className="group text-xs p-2 bg-gray-50 rounded">
              {editingEntry === entry.id ? (
                <div className="space-y-1.5">
                  <Input
                    value={editEntryData.hours}
                    onChange={(e) => setEditEntryData({ ...editEntryData, hours: e.target.value })}
                    className="h-7 text-xs"
                    placeholder="2h 30m"
                  />
                  <Input
                    value={editEntryData.description}
                    onChange={(e) => setEditEntryData({ ...editEntryData, description: e.target.value })}
                    className="h-7 text-xs"
                    placeholder="Description"
                  />
                  <div className="flex gap-1">
                    <Button size="sm" className="h-6 text-xs px-2 cursor-pointer" onClick={() => saveEditEntry(entry.id)}>Save</Button>
                    <Button size="sm" variant="outline" className="h-6 text-xs px-2 cursor-pointer" onClick={() => setEditingEntry(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{entry.hours}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">{entry.date}</span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => startEditEntry(entry)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button onClick={() => deleteTimeEntry(entry.id)} className="text-gray-400 hover:text-red-500 cursor-pointer">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-0.5">{entry.description}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
