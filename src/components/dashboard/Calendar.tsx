import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTasksStore } from '@/store/taskStore';
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  addWeeks
} from "date-fns";
import { Calendar as CalendarIcon, CheckCircle, ChevronLeft, ChevronRight, Circle } from "lucide-react";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month");
  const tasks = useTasksStore();

  const handlePrevious = () => {
    setCurrentDate(prev => {
      if (viewMode === "month") {
        return startOfMonth(new Date(prev.getFullYear(), prev.getMonth() - 1));
      }
      return addWeeks(prev, -1);
    });
  };

  const handleNext = () => {
    setCurrentDate(prev => {
      if (viewMode === "month") {
        return startOfMonth(new Date(prev.getFullYear(), prev.getMonth() + 1));
      }
      return addWeeks(prev, 1);
    });
  };

  const renderCalendarHeader = () => (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 px-2">
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={handlePrevious}>
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
          <span className="font-bold text-base sm:text-lg">
            {format(currentDate, viewMode === "month" ? "MMMM yyyy" : "'Week of' MMM d, yyyy")}
          </span>
        </div>
        <Button variant="ghost" onClick={handleNext}>
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>
      <div className="flex gap-2">
        <Button 
          variant={viewMode === "month" ? "default" : "outline"}
          onClick={() => setViewMode("month")}
          className="text-xs sm:text-sm"
        >
          Month
        </Button>
        <Button 
          variant={viewMode === "week" ? "default" : "outline"}
          onClick={() => setViewMode("week")}
          className="text-xs sm:text-sm"
        >
          Week
        </Button>
      </div>
    </div>
  );

  const renderCalendarDays = () => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let days;

    if (viewMode === "month") {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const startDate = startOfWeek(monthStart);
      const endDate = endOfWeek(monthEnd);
      days = eachDayOfInterval({ start: startDate, end: endDate });
    } else {
      const weekStart = startOfWeek(currentDate);
      const weekEnd = endOfWeek(currentDate);
      days = eachDayOfInterval({ start: weekStart, end: weekEnd });
    }

    return (
      <div className="space-y-2 sm:space-y-4">
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center font-semibold text-gray-500">
          {weekDays.map(day => (
            <div key={day} className="text-xs sm:text-sm">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {days.map(day => {
            const dayTasks = tasks.tasks.filter(task => 
              task.dueDate && isSameDay(new Date(task.dueDate), day)
            );
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={day.toISOString()}
                className={`
                  min-h-[80px] sm:min-h-[120px] p-1 sm:p-2 rounded-lg border transition-all duration-200
                  ${viewMode === "month" && !isCurrentMonth ? 'bg-gray-50 dark:bg-gray-900 opacity-50' : 'bg-white dark:bg-gray-800'}
                  ${isToday ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}
                  hover:shadow-md dark:border-gray-700
                `}
              >
                <div className={`
                  text-right mb-1 sm:mb-2 font-medium text-sm sm:text-base
                  ${isToday ? 'text-blue-500 dark:text-blue-400' : ''}
                `}>
                  {format(day, 'd')}
                </div>
                {dayTasks.length > 0 ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="space-y-1">
                        {dayTasks.slice(0, 2).map(task => (
                          <Badge
                            key={task.id}
                            variant={task.status ? "outline" : "default"}
                            className={`
                              w-full justify-start cursor-pointer text-xs sm:text-sm
                              ${task.status ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'}
                            `}
                          >
                            {task.status ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <Circle className="h-3 w-3 mr-1" />
                            )}
                            <span className="truncate">{task.title}</span>
                          </Badge>
                        ))}
                        {dayTasks.length > 2 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{dayTasks.length - 2} more
                          </div>
                        )}
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-2 space-y-2">
                      {dayTasks.map(task => (
                        <div
                          key={task.id}
                          className={`
                            p-2 sm:p-3 rounded-lg flex items-center gap-2
                            ${task.status
                              ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' 
                              : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'}
                          `}
                        >
                          {task.status ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <Circle className="h-4 w-4" />
                          )}
                          <span className="font-medium">{task.title}</span>
                        </div>
                      ))}
                    </PopoverContent>
                  </Popover>
                ) : (
                  <div className="text-xs text-gray-400 dark:text-gray-500 text-center mt-2 sm:mt-4">
                    No tasks
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="sm:px-6">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <CalendarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
          Task Calendar
        </CardTitle>
      </CardHeader>
      <CardContent className="sm:px-6">
        {renderCalendarHeader()}
        {renderCalendarDays()}
      </CardContent>
    </Card>
  );
};

export default Calendar;