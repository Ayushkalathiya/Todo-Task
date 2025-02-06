import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useTasksStore } from "@/store/taskStore"
import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns"
import { CheckCircle, Circle } from "lucide-react"; // Import icons
import { useState } from "react"

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, ] = useState("month") // Declare viewMode
  const { tasks } = useTasksStore()

  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      if (viewMode === "month") {
        return startOfMonth(new Date(prev.getFullYear(), prev.getMonth() - 1))
      } else {
        return addDays(prev, -7)
      }
    })
  }

  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      if (viewMode === "month") {
        return startOfMonth(new Date(prev.getFullYear(), prev.getMonth() + 1))
      } else {
        return addDays(prev, 7)
      }
    })
  }

  const renderCalendarHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" onClick={handlePrevMonth}>
          Previous
        </Button>
        <div>{viewMode === "month" ? format(currentDate, "MMMM yyyy") : format(currentDate, "dd/MM/yyyy")}</div>
        <Button variant="ghost" onClick={handleNextMonth}>
          Next
        </Button>
      </div>
    )
  }

  const renderCalendarDays = () => {
    const days =
      viewMode === "week"
        ? Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(currentDate), i))
        : eachDayOfInterval({
            start: startOfMonth(currentDate),
            end: endOfMonth(currentDate),
          })

    return (
      <div className={`grid grid-cols-7 gap-2 sm:gap-3 p-2 sm:p-4`}>
        {days.map((day) => {
          const dayTasks = tasks.filter((task) => task.dueDate && isSameDay(new Date(task.dueDate), day))

          return (
            <div
              key={day.toISOString()}
              className={`text-center border rounded p-2 dark:border-gray-700 min-h-[80px]
                ${
                  !isSameMonth(day, currentDate) && viewMode === "month"
                    ? "bg-gray-100 dark:bg-gray-800 opacity-50"
                    : "bg-white dark:bg-gray-900"
                }
                flex flex-col items-center justify-between`}
            >
              <div className="font-semibold text-sm sm:text-base dark:text-white">{format(day, "d")}</div>
              {dayTasks.length > 0 ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="flex flex-col space-y-1 mt-1 w-full items-center">
                      {dayTasks.map((task) => (
                        <Badge
                          key={task.id}
                          variant={task.completed ? "outline" : "default"}
                          className={`truncate max-w-full flex items-center gap-1 ${
                            task.completed ? "text-green-500 dark:text-green-400" : ""
                          }`}
                        >
                          {task.completed ? <CheckCircle size={12} /> : <Circle size={12} />}
                          {task.title}
                        </Badge>
                      ))}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-[250px] dark:bg-gray-800 dark:text-white">
                    {dayTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`p-2 mb-2 rounded text-sm flex justify-between items-center 
                          ${
                            task.completed
                              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                              : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                          }`}
                      >
                        <span className="flex items-center gap-2">
                          {task.completed ? <CheckCircle size={16} /> : <Circle size={16} />}
                          {task.title}
                        </span>
                      </div>
                    ))}
                  </PopoverContent>
                </Popover>
              ) : (
                <span className="text-xs text-gray-400">No Tasks</span>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        {renderCalendarHeader()}
        {renderCalendarDays()}
      </CardContent>
    </Card>
  )
}

