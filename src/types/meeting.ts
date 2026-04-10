import { MeetingStatus } from "@/generated/prisma/enums.js";
import { JsonValue } from "@prisma/client/runtime/client";

export interface IMeeting {
  id: string;
  title: string;
  status: MeetingStatus;
  created_at: Date;
  team_id: string;
  created_by_id: string;
  agenda: string;
  start_time: Date;
  end_time: Date;
  transcript: string | null;
  summary: JsonValue | null;
}

export interface IMeetingParticipantWithoutDetails {
  id: string;
  created_at: Date;
  meeting_id: string;
  team_member_id: string;
}

export interface IMeetingParticipantWithDetails extends IMeetingParticipantWithoutDetails {
  team_member: {
    id: string;
    user: {
      name: string;
      email: string;
    };
  };
}
