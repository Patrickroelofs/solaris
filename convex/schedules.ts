import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUserSchedule = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    const schedules = await ctx.db.query("schedules").collect();

    return schedules.filter(
      (schedule) =>
        schedule.createdBy === userId ||
        schedule.people.some((personId) => personId === userId),
    );
  },
});

export const createSchedule = mutation({
  args: {
    name: v.string(),
    people: v.array(v.id("users")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Not authenticated");
    }

    const scheduleId = await ctx.db.insert("schedules", {
      name: args.name,
      createdBy: userId,
      people: [
        userId,
        ...args.people.filter((personId) => personId !== userId),
      ],
    });

    return scheduleId;
  },
});

export const deleteSchedule = mutation({
  args: {
    scheduleId: v.id("schedules"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Not authenticated");
    }

    const schedule = await ctx.db.get(args.scheduleId);

    if (!schedule) {
      throw new Error("Schedule not found");
    }

    if (schedule.createdBy !== userId) {
      throw new Error("Not authorized to delete this schedule");
    }

    await ctx.db.delete(args.scheduleId);
  },
});

export const addUserToSchedule = mutation({
  args: {
    scheduleId: v.id("schedules"),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const schedule = await ctx.db.get(args.scheduleId);

    if (!schedule) {
      throw new Error("Schedule not found");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .first();

    console.log(user);

    if (!user) {
      throw new Error("User not found");
    }

    if (schedule.people.includes(user._id)) {
      throw new Error("User already in schedule");
    }

    const updatedPeople = [...schedule.people, user._id];
    await ctx.db.patch(args.scheduleId, { people: updatedPeople });
  },
});

export const getScheduleUsers = query({
  args: {
    scheduleId: v.id("schedules"),
  },
  handler: async (ctx, args) => {
    const schedule = await ctx.db.get(args.scheduleId);

    if (!schedule) {
      throw new Error("Schedule not found");
    }

    const users = await ctx.db
      .query("users")
      .filter((q) =>
        q.or(
          ...schedule.people.map((personId) => q.eq(q.field("_id"), personId)),
        ),
      )
      .collect();

    return users;
  },
});
