import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTasksStore } from "@/store/taskStore";
import { isBefore, isFuture, isToday } from "date-fns";

export default function Dashboard() {
  const { tasks } = useTasksStore();

  const stats = {
    total: tasks.length,
    completed: tasks.filter(task => task.completed).length,
    upcoming: tasks.filter(task => task.dueDate && isFuture(new Date(task.dueDate)) && !task.completed).length,
    overdue: tasks.filter(task => task.dueDate && isBefore(new Date(task.dueDate), new Date()) && !task.completed).length,
    today: tasks.filter(task => task.dueDate && isToday(new Date(task.dueDate))).length
  };

  const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">{stats.upcoming}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{stats.overdue}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tasks for Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500">{stats.today}</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 className="text-lg font-semibold dark:text-white">Productivity Insights</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge className="bg-green-600 hover:bg-green-600">{completionRate.toFixed(2)}% Completed</Badge>
          <Badge className="bg-yellow-500 hover:bg-yellow-400">{stats.upcoming} Tasks Upcoming</Badge>
          <Badge variant="destructive">{stats.overdue} Overdue Tasks</Badge>
          <Badge variant="outline">{stats.today} Tasks Today</Badge>
        </div>
      </div>
    </div>
  );
}
