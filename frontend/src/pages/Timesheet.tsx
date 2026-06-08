import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon } from "lucide-react";
import { useTimeEntries } from "@/hooks/queries/useTasks";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getWeekRange(offset: number) {
  const now = new Date();
  const day = (now.getDay() + 6) % 7; // Mon=0
  const monday = new Date(now);
  monday.setDate(now.getDate() - day + offset * 7);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d);
  }
  return { monday, sunday, dates };
}

const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

const toDateStr = (d: Date) => d.toISOString().split("T")[0];

interface TimesheetRow {
  taskId: string;
  taskTitle: string;
  projectName: string;
  hours: Record<number, number>; // dayIndex -> total hours
}

const Timesheet = () => {
  const [weekOffset, setWeekOffset] = useState(0);
  const { data: allEntries = [] } = useTimeEntries();
  const { monday, sunday, dates } = getWeekRange(weekOffset);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayIdx = weekOffset === 0 ? (today.getDay() + 6) % 7 : -1;

  // Filter to current week and build rows
  const weekStart = toDateStr(monday);
  const weekEnd = toDateStr(sunday);
  const weekEntries = allEntries.filter((e) => e.work_date >= weekStart && e.work_date <= weekEnd);

  const rowMap = new Map<string, TimesheetRow>();
  for (const entry of weekEntries) {
    const entryDate = new Date(entry.work_date + "T00:00:00");
    const dayIdx = (entryDate.getDay() + 6) % 7;
    const hours = entry.duration_minutes / 60;

    if (!rowMap.has(entry.task_id)) {
      rowMap.set(entry.task_id, {
        taskId: entry.task_id,
        taskTitle: entry.task_title ?? "Unknown task",
        projectName: entry.project_name ?? "",
        hours: {},
      });
    }
    const row = rowMap.get(entry.task_id)!;
    row.hours[dayIdx] = (row.hours[dayIdx] ?? 0) + hours;
  }
  const rows = Array.from(rowMap.values());

  const rowTotal = (row: TimesheetRow) => Object.values(row.hours).reduce((a, b) => a + b, 0);

  const dayTotal = (dayIdx: number) => rows.reduce((sum, r) => sum + (r.hours[dayIdx] ?? 0), 0);

  const weekTotal = rows.reduce((sum, r) => sum + rowTotal(r), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Timesheet</h1>
          <p className="text-gray-600 mt-1">Log hours per task across the week</p>
        </div>

        {/* Week navigator + stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-5 h-5 text-gray-500" />
              <CardTitle className="text-lg">
                {fmt(monday)} – {fmt(sunday)}, {sunday.getFullYear()}
              </CardTitle>
              {weekOffset === 0 && <Badge variant="secondary">Current week</Badge>}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setWeekOffset((w) => w - 1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setWeekOffset(0)}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={() => setWeekOffset((w) => w + 1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 pb-2">
              <div className="rounded-lg border bg-white p-4">
                <div className="text-sm text-gray-600">Week total</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">{weekTotal.toFixed(1)}h</div>
              </div>
              <div className="rounded-lg border bg-white p-4">
                <div className="text-sm text-gray-600">Daily average</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">
                  {(weekTotal / 7).toFixed(1)}h
                </div>
              </div>
              <div className="rounded-lg border bg-white p-4">
                <div className="text-sm text-gray-600">Tasks logged</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">
                  {rows.filter((r) => rowTotal(r) > 0).length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timesheet table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[260px]">Task</TableHead>
                  {DAYS.map((d, i) => {
                    const isToday = i === todayIdx;
                    return (
                      <TableHead key={d} className="text-center">
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="text-xs font-medium">{d}</span>
                          <span
                            className={
                              isToday
                                ? "inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-900 text-white text-xs"
                                : "text-xs text-gray-500"
                            }
                          >
                            {dates[i].getDate()}
                          </span>
                        </div>
                      </TableHead>
                    );
                  })}
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12 text-gray-400">
                      No time entries this week.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow key={row.taskId}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{row.taskTitle}</span>
                          <span className="text-xs text-gray-500">{row.projectName}</span>
                        </div>
                      </TableCell>
                      {DAYS.map((_, i) => {
                        const h = row.hours[i] ?? 0;
                        return (
                          <TableCell key={i} className="text-center text-sm text-gray-700">
                            {h > 0 ? h.toFixed(1) : <span className="text-gray-300">0</span>}
                          </TableCell>
                        );
                      })}
                      <TableCell className="text-right font-semibold text-gray-900">
                        {rowTotal(row).toFixed(1)}h
                      </TableCell>
                    </TableRow>
                  ))
                )}
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableCell className="font-semibold text-gray-900">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Daily total
                    </div>
                  </TableCell>
                  {DAYS.map((_, i) => (
                    <TableCell key={i} className="text-center font-semibold text-gray-900">
                      {dayTotal(i).toFixed(1)}h
                    </TableCell>
                  ))}
                  <TableCell className="text-right font-bold text-gray-900">
                    {weekTotal.toFixed(1)}h
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Timesheet;
