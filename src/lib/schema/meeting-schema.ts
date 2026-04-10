import { MeetingStatus } from "@/generated/prisma/enums.js";
import { z } from "zod";

export const createMeetingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  agenda: z.string().min(1, "Agenda is required"),
  teamId: z.uuidv4("Invalid team ID"),
  creatorUserId: z.uuidv4("Invalid creator user ID"),
  startTime: z.string(),
  endTime: z.string().optional(),
  status: z.enum(MeetingStatus, {
    error: () => ({ message: "Invalid meeting status" }),
  }),
});

export const updateMeetingStatusSchema = z.object({
  meetingId: z.uuidv4("Invalid meeting ID"),
  status: z.enum(MeetingStatus, {
    error: () => ({ message: "Invalid meeting status" }),
  }),
});

export const uuidSchema = z.object({
  id: z.uuidv4("Invalid ID"),
});
