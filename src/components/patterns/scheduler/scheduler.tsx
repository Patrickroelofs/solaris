"use client";

import { useMutation, useQuery } from "convex/react";
import { format, getISOWeek, startOfWeek } from "date-fns";
import { DeleteIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Spinner } from "@/components/ui/spinner";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import SchedulerHeader from "./scheduler-header";
import SchedulerSidebar from "./scheduler-sidebar";
import SchedulerAddTaskWindow from "./scheduler-task-window";

const formatDate = (date: Date, formatStr: string) => {
  return format(date, formatStr);
};

const weekNumber = (date: Date) => {
  return getISOWeek(date);
};

const weekDays = (weekNum: number, year: number) => {
  const firstDayOfWeek = startOfWeek(new Date(year, 0, 1 + (weekNum - 1) * 7), {
    weekStartsOn: 1,
  });

  return Array.from(
    { length: 7 },
    (_, i) => new Date(firstDayOfWeek.getTime() + i * 24 * 60 * 60 * 1000),
  );
};

interface SchedulingToolProps {
  scheduleId: Id<"schedules">;
}

export default function SchedulingTool({ scheduleId }: SchedulingToolProps) {
  const [selectedYearNumber, setSelectedYearNumber] = useState(
    new Date().getFullYear(),
  );

  const [selectedWeekNumber, setSelectedWeekNumber] = useState(
    weekNumber(new Date()),
  );

  const getTasksForWeek = useQuery(api.tasks.getTasksForWeek, {
    scheduleId: scheduleId,
    selectedWeekNumber: selectedWeekNumber,
    selectedYearNumber: selectedYearNumber,
  });

  const getUsers = useQuery(api.schedules.getScheduleUsers, {
    scheduleId: scheduleId,
  });

  const deleteTask = useMutation(api.tasks.deleteTask);

  const [currentWeekDays, setCurrentWeekDays] = useState(
    weekDays(selectedWeekNumber, selectedYearNumber),
  );

  useEffect(() => {
    setCurrentWeekDays(weekDays(selectedWeekNumber, selectedYearNumber));
  }, [selectedWeekNumber, selectedYearNumber]);

  const goToToday = () => {
    setSelectedWeekNumber(weekNumber(new Date()));
  };

  return (
    <div>
      <SchedulerHeader
        setSelectedWeekNumber={setSelectedWeekNumber}
        setSelectedYearNumber={setSelectedYearNumber}
        selectedWeekNumber={selectedWeekNumber}
        selectedYearNumber={selectedYearNumber}
        goToToday={goToToday}
        addTaskSlot={<SchedulerAddTaskWindow scheduleId={scheduleId} />}
      />

      <div className="flex">
        <SchedulerSidebar scheduleId={scheduleId} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-x-auto">
            {!getTasksForWeek ? (
              <div className="w-full h-full flex justify-center items-center">
                <Spinner className="size-8" />
              </div>
            ) : (
              <>
                <div className="border-b sticky top-0 z-10 min-h-24 flex">
                  {currentWeekDays.map((day) => (
                    <div
                      key={day.toISOString()}
                      className="w-1/7 p-3 text-center border-r last:border-r-0 flex-shrink-0 transition-colors"
                    >
                      <div className="text-sm font-medium">
                        {formatDate(day, "EEE")} {formatDate(day, "d")}
                      </div>
                      <div className="text-xs mt-1">
                        {formatDate(day, "MMM")}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex">
                  {currentWeekDays.map((day) => (
                    <div
                      key={day.getDay()}
                      className={`w-1/7 border-r last:border-r-0 flex-shrink-0`}
                    >
                      {getTasksForWeek &&
                        getUsers &&
                        getUsers.map((person) => {
                          const userTasks = getTasksForWeek.filter((task) => {
                            return (
                              task.assignedTo === person._id &&
                              format(new Date(task.date), "yyyy-MM-dd") ===
                                format(day, "yyyy-MM-dd")
                            );
                          });

                          return (
                            <div
                              key={person._id}
                              className={`h-32 border-b p-2 relative transition-all duration-200`}
                            >
                              {userTasks.map((task) => {
                                const taskHeight = (task.duration / 8) * 100;

                                return (
                                  <ContextMenu key={task._id}>
                                    <ContextMenuTrigger>
                                      <div
                                        className="bg-blue-500 rounded-lg text-white text-xs p-2"
                                        style={{
                                          height: `${taskHeight}%`,
                                        }}
                                      >
                                        <div className="font-medium leading-tight overflow-hidden">
                                          <div className="truncate text-xs">
                                            {task.title}
                                          </div>
                                          <span>{task.duration}h</span>
                                        </div>
                                      </div>
                                    </ContextMenuTrigger>
                                    <ContextMenuContent>
                                      <ContextMenuItem
                                        variant="destructive"
                                        onClick={() =>
                                          deleteTask({ taskId: task._id })
                                        }
                                      >
                                        <DeleteIcon />
                                        Delete
                                      </ContextMenuItem>
                                    </ContextMenuContent>
                                  </ContextMenu>
                                );
                              })}
                            </div>
                          );
                        })}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
