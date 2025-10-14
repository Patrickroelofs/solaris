import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getTasksForWeek = query({
  args: {
    selectedYearNumber: v.number(),
    selectedWeekNumber: v.number(),
    scheduleId: v.id("schedules"),
  },
  handler: async (ctx, args) => {
    function getStartOfWeek(year: number, week: number): Date {
      const simple = new Date(year, 0, 1 + (week - 1) * 7);
      const dow = simple.getDay();
      const ISOweekStart = simple;
      if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
      else ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
      return ISOweekStart;
    }

    const startOfWeek = getStartOfWeek(
      args.selectedYearNumber,
      args.selectedWeekNumber,
    );

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    const tasks = await ctx.db
      .query("tasks")
      .filter((q) =>
        q.and(
          q.eq(q.field("schedule"), args.scheduleId),
          q.gte(q.field("date"), startOfWeek.toISOString()),
          q.lt(q.field("date"), endOfWeek.toISOString()),
        ),
      )
      .collect();

    return tasks;
  },
});

export const addTask = mutation({
  args: {
    title: v.string(),
    duration: v.number(),
    date: v.string(),
    scheduleId: v.id("schedules"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const taskId = await ctx.db.insert("tasks", {
      title: args.title,
      duration: args.duration,
      date: args.date,
      schedule: args.scheduleId,
      assignedTo: userId,
    });

    return taskId;
  },
});

export const deleteTask = mutation({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    await ctx.db.delete(args.taskId);
    return true;
  },
});
