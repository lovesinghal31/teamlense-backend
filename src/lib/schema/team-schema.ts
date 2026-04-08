import { z } from "zod";

export const createTeamSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Team name is required" })
    .max(50, { message: "Team name is too long" }),
});

export const joinTeamSchema = z.object({
  invite_code: z
    .string()
    .length(8, { message: "Invite code must be 8 characters" }),
});

export const teamIdParamSchema = z.object({
  teamId: z.string().uuidv4({ message: "Invalid team ID format" }),
});

export const addMemberSchema = z.object({
  teamId: z.string().uuidv4({ message: "Invalid team ID format" }),
  memberId: z.string().uuidv4({ message: "Invalid member ID format" }),
});
