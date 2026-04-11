import { MessageType } from "@/generated/prisma/enums.js";
import { z } from "zod";

export const createMessageSchema = z.object({
  content: z.string().min(1, "Message content cannot be empty"),
  userId: z.uuidv4("Invalid user ID format"),
  teamId: z.uuidv4("Invalid team ID format"),
});

export const uuidSchema = z.object({
  id: z.uuidv4("Invalid ID format"),
});
