import { z } from "zod";
import { TaskStatus } from "@/generated/prisma/enums.js";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  teamId: z.string().uuidv4("Invalid team ID format"),
  userId: z.string().uuidv4("Invalid user ID format"),
  assignedToId: z.string().uuidv4("Invalid assigned user ID format"),
  description: z.string().optional(),
  deadline: z.string().optional(),
});

export const getTasksForTeamSchema = z.object({
  teamId: z.string().uuidv4("Invalid team ID format"),
});

export const getTasksForUserAndTeamSchema = z.object({
  teamId: z.string().uuidv4("Invalid team ID format"),
  userId: z.string().uuidv4("Invalid user ID format"),
});

export const updateTaskStatusSchema = z.object({
  taskId: z.string().uuidv4("Invalid task ID format"),
  status: z.nativeEnum(TaskStatus, {
    error: () => ({ message: "Invalid task status" }),
  }),
});

export const deleteTaskSchema = z.object({
  taskId: z.string().uuidv4("Invalid task ID format"),
});
