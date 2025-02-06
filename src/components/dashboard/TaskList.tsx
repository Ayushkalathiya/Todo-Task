"use client"

import { useState } from "react"
import { type Task, priorities } from "@/utils/taskUtils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarIcon, EditIcon, FlagIcon, FolderIcon, SearchIcon, Trash2Icon } from "lucide-react"

type TaskListProps = {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (taskId: number) => void
  onToggleCompletion: (taskId: number) => void
}

export function TaskList({ tasks, onEdit, onDelete, onToggleCompletion }: TaskListProps) {
  const [search, setSearch] = useState("")
  const projects = Array.from(new Set(tasks.map((task) => task.project)))
  const [filterProject, setFilterProject] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(search.toLowerCase()) &&
      (filterProject === "all" || task.project === filterProject) &&
      (filterPriority === "all" || task.priority === filterPriority),
  )

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
        <div className="relative flex-grow">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterProject} onValueChange={setFilterProject}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project} value={project}>
                {project}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            {priorities.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {priority}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="bg-card text-card-foreground rounded-lg shadow-md p-4 transition-all duration-200 hover:shadow-lg"
          >
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => onToggleCompletion(task.id)}
                className="rounded-full"
              />
              <h3 className={`font-semibold ${task.completed ? "line-through text-gray-400" : ""}`}>{task.title}</h3>
            </div>
            <p className="mt-2 text-sm text-gray-500">{task.description}</p>
            <div className="mt-4 flex flex-wrap items-center text-xs text-gray-400 space-x-4">
              <div className="flex items-center">
                <CalendarIcon className="mr-1 h-4 w-4" />
                {task.dueDate.toLocaleDateString()}
              </div>
              <div className={`flex items-center ${getPriorityColor(task.priority)}`}>
                <FlagIcon className="mr-1 h-4 w-4" />
                {task.priority}
              </div>
              <div className="flex items-center">
                <FolderIcon className="mr-1 h-4 w-4" />
                {task.project}
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(task)}>
                <EditIcon className="mr-1 h-4 w-4" /> Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onDelete(task.id)}>
                <Trash2Icon className="mr-1 h-4 w-4" /> Delete
              </Button>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-2.5 rounded-full"
                style={{ width: `${task.completed ? 100 : 0}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

