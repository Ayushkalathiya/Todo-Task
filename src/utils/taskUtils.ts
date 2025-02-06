import { format, addDays } from "date-fns"

export type Task = {
  id: number
  title: string
  description: string
  priority: "low" | "medium" | "high"
  dueDate: Date
  project: string
  completed: boolean
}

export type Project = {
  id: string
  name: string
  description: string
}

export const priorities = ["low", "medium", "high"]

export const generateDummyTasks = (count: number): Task[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `Task ${i + 1}`,
    description: `This is a description for Task ${i + 1}`,
    priority: priorities[Math.floor(Math.random() * priorities.length)] as "low" | "medium" | "high",
    dueDate: addDays(new Date(), Math.floor(Math.random() * 30)),
    project: `Project ${Math.floor(i / 5) + 1}`,
    completed: Math.random() > 0.7,
  }))
}

export const generateDummyProjects = (count: number): Project[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `project-${i + 1}`,
    name: `Project ${i + 1}`,
    description: `This is a description for Project ${i + 1}`,
  }))
}

export const dummyTasks = generateDummyTasks(20)
export const dummyProjects = generateDummyProjects(4)

export const getTaskStats = (tasks: Task[]) => {
  const total = tasks.length
  const completed = tasks.filter((t) => t.completed).length
  const upcoming = tasks.filter((t) => !t.completed && t.dueDate > new Date()).length
  const overdue = tasks.filter((t) => !t.completed && t.dueDate < new Date()).length

  return { total, completed, upcoming, overdue }
}

export const formatDate = (date: Date) => {
  return format(date, "MMM dd, yyyy")
}

