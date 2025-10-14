import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  schedules: defineTable({
    name: v.string(),
    createdBy: v.id("users"),
    people: v.array(v.id("users")),
  }),
  tasks: defineTable({
    title: v.string(),
    duration: v.number(),
    date: v.string(),
    schedule: v.id("schedules"),
    assignedTo: v.id("users"),
  }).index("schedule", ["schedule"]),
});
