import { MessageType } from "@/generated/prisma/enums.js";

export interface IMessage {
  type: MessageType;
  content: string;
  id: string;
  created_at: Date;
  team_id: string;
  sender_member_id: string;
}
