import { TaskStatus } from "@/generated/prisma/enums.js";

export interface ITask {
  id: string;
  created_at: Date;
  team_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  deadline: Date | null;
  assigned_to_id: string;
  created_by_id: string;
}
