import { MeetingRepository } from "@/repositories/meeting.repositories.js";
import { TeamRepository } from "@/repositories/team.repositories.js";
import { TeamMemberRepository } from "@/repositories/teammember.repositories.js";
import {
  createMeetingSchema,
  updateMeetingStatusSchema,
  uuidSchema,
} from "@/lib/schema/meeting-schema.js";
import { ApiError } from "@/lib/utlis.js";
import { MeetingStatus } from "@/generated/prisma/enums.js";

const meetingRepository = new MeetingRepository();
const teamRepository = new TeamRepository();
const teamMemberRepository = new TeamMemberRepository();

export class MeetingService {
  async createMeeting(
    title: string,
    agenda: string,
    teamId: string,
    creatorUserId: string,
    startTime: string,
    status: MeetingStatus,
    endTime?: string,
  ) {
    const parsedData = createMeetingSchema.safeParse({
      title,
      agenda,
      teamId,
      creatorUserId,
      startTime,
      endTime,
      status,
    });
    if (!parsedData.success) {
      const errorMessages = parsedData.error.issues.map(
        (issue) => issue.message,
      );
      throw new ApiError(400, errorMessages.join(", "));
    }
    const team = await teamRepository.findById(parsedData.data.teamId);
    if (!team) {
      throw new ApiError(404, "Team not found");
    }
    const creator = await teamMemberRepository.findByTeamIdAndUserId(
      parsedData.data.teamId,
      parsedData.data.creatorUserId,
    );
    if (!creator) {
      throw new ApiError(403, "Only team members can create meetings");
    }
    const meeting = await meetingRepository.createMeeting(
      parsedData.data.title,
      parsedData.data.agenda,
      team.id,
      creator.id,
      new Date(parsedData.data.startTime),
      parsedData.data.endTime
        ? new Date(parsedData.data.endTime)
        : new Date(
            new Date(parsedData.data.startTime).getTime() + 60 * 60 * 1000,
          ), // Default to 1 hour duration
      parsedData.data.status,
    );
    return meeting;
  }
  async updateMeetingStatus(meetingId: string, status: MeetingStatus) {
    const parsedData = updateMeetingStatusSchema.safeParse({
      meetingId,
      status,
    });
    if (!parsedData.success) {
      const errorMessages = parsedData.error.issues.map(
        (issue) => issue.message,
      );
      throw new ApiError(400, errorMessages.join(", "));
    }
    const meeting = await meetingRepository.getMeetingById(
      parsedData.data.meetingId,
    );
    if (!meeting) {
      throw new ApiError(404, "Meeting not found");
    }
    const updatedMeeting = await meetingRepository.updateMeetingStatus(
      meeting.id,
      parsedData.data.status,
    );
    return updatedMeeting;
  }
  async deleteMeeting(meetingId: string) {
    const parsedData = uuidSchema.safeParse({ id: meetingId });
    if (!parsedData.success) {
      const errorMessages = parsedData.error.issues.map(
        (issue) => issue.message,
      );
      throw new ApiError(400, errorMessages.join(", "));
    }
    const meeting = await meetingRepository.getMeetingById(parsedData.data.id);
    if (!meeting) {
      throw new ApiError(404, "Meeting not found");
    }
    await meetingRepository.deleteMeeting(meeting.id);
  }
  async addParticipant(meetingId: string, teamMemberId: string) {
    const parsedMeetingId = uuidSchema.safeParse({ id: meetingId });
    const parsedTeamMemberId = uuidSchema.safeParse({ id: teamMemberId });
    if (!parsedMeetingId.success || !parsedTeamMemberId.success) {
      const errorMessages = [
        ...(parsedMeetingId.error?.issues.map((issue) => issue.message) || []),
        ...(parsedTeamMemberId.error?.issues.map((issue) => issue.message) ||
          []),
      ];
      throw new ApiError(400, errorMessages.join(", "));
    }
    const meeting = await meetingRepository.getMeetingById(
      parsedMeetingId.data.id,
    );
    if (!meeting) {
      throw new ApiError(404, "Meeting not found");
    }
    const teamMember = await teamMemberRepository.findById(
      parsedTeamMemberId.data.id,
    );
    if (!teamMember || teamMember.team_id !== meeting.team_id) {
      throw new ApiError(403, "Only team members can be added as participants");
    }
    const participant = await meetingRepository.addParticipant(
      meeting.id,
      teamMember.id,
    );
    return participant;
  }
  async removeParticipant(meetingId: string, teamMemberId: string) {
    const parsedMeetingId = uuidSchema.safeParse({ id: meetingId });
    const parsedTeamMemberId = uuidSchema.safeParse({ id: teamMemberId });
    if (!parsedMeetingId.success || !parsedTeamMemberId.success) {
      const errorMessages = [
        ...(parsedMeetingId.error?.issues.map((issue) => issue.message) || []),
        ...(parsedTeamMemberId.error?.issues.map((issue) => issue.message) ||
          []),
      ];
      throw new ApiError(400, errorMessages.join(", "));
    }
    const meeting = await meetingRepository.getMeetingById(
      parsedMeetingId.data.id,
    );
    if (!meeting) {
      throw new ApiError(404, "Meeting not found");
    }
    const teamMember = await teamMemberRepository.findById(
      parsedTeamMemberId.data.id,
    );
    if (!teamMember || teamMember.team_id !== meeting.team_id) {
      throw new ApiError(
        403,
        "Only team members can be removed as participants",
      );
    }
    await meetingRepository.removeParticipant(meeting.id, teamMember.id);
  }
  async getMeetingsByTeamId(teamId: string) {
    const parsedData = uuidSchema.safeParse({ id: teamId });
    if (!parsedData.success) {
      const errorMessages = parsedData.error.issues.map(
        (issue) => issue.message,
      );
      throw new ApiError(400, errorMessages.join(", "));
    }
    const team = await teamRepository.findById(parsedData.data.id);
    if (!team) {
      throw new ApiError(404, "Team not found");
    }
    const meetings = await meetingRepository.getMeetingsByTeamId(team.id);
    return meetings;
  }
  async getMeetingById(meetingId: string) {
    const parsedData = uuidSchema.safeParse({ id: meetingId });
    if (!parsedData.success) {
      const errorMessages = parsedData.error.issues.map(
        (issue) => issue.message,
      );
      throw new ApiError(400, errorMessages.join(", "));
    }
    const meeting = await meetingRepository.getMeetingById(parsedData.data.id);
    if (!meeting) {
      throw new ApiError(404, "Meeting not found");
    }
    return meeting;
  }
  async getMeetingsByMemberId(userMemberId: string) {
    const parsedData = uuidSchema.safeParse({ id: userMemberId });
    if (!parsedData.success) {
      const errorMessages = parsedData.error.issues.map(
        (issue) => issue.message,
      );
      throw new ApiError(400, errorMessages.join(", "));
    }
    const meetings = await meetingRepository.getMeetingsByMemberId(
      parsedData.data.id,
    );
    return meetings;
  }
  async getParticipantsByMeetingId(meetingId: string) {
    const parsedData = uuidSchema.safeParse({ id: meetingId });
    if (!parsedData.success) {
      const errorMessages = parsedData.error.issues.map(
        (issue) => issue.message,
      );
      throw new ApiError(400, errorMessages.join(", "));
    }
    const participants = await meetingRepository.getParticipantsByMeetingId(
      parsedData.data.id,
    );
    return participants;
  }
}
