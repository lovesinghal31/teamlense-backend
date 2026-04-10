import { MeetingStatus } from "@/generated/prisma/enums.js";
import { prisma } from "@/lib/prisma.js";

export class MeetingRepository {
  async getMeetingsByTeamId(teamId: string) {
    const meetings = await prisma.meeting.findMany({
      where: {
        team_id: teamId,
      },
      orderBy: {
        start_time: "desc",
      },
    });
    return meetings;
  }
  async getMeetingById(meetingId: string) {
    const meeting = await prisma.meeting.findUnique({
      where: {
        id: meetingId,
      },
    });
    return meeting;
  }
  async getMeetingsByMemberId(userMemberId: string) {
    const meetings = await prisma.meeting.findMany({
      where: {
        participants: {
          some: {
            team_member_id: userMemberId,
          },
        },
      },
    });
    return meetings;
  }
  async createMeeting(
    title: string,
    agenda: string,
    teamId: string,
    creatorMemberId: string,
    startTime: Date,
    endTime: Date,
    status: MeetingStatus,
  ) {
    const meeting = await prisma.meeting.create({
      data: {
        title,
        agenda,
        team_id: teamId,
        created_by_id: creatorMemberId,
        start_time: startTime,
        end_time: endTime,
        status,
      },
    });
    return meeting;
  }
  async updateMeetingStatus(meetingId: string, status: MeetingStatus) {
    const meeting = await prisma.meeting.update({
      where: {
        id: meetingId,
      },
      data: {
        status,
      },
    });
    return meeting;
  }
  async deleteMeeting(meetingId: string) {
    await prisma.meeting.delete({
      where: {
        id: meetingId,
      },
    });
  }
  async addParticipant(meetingId: string, teamMemberId: string) {
    const meetingParticipant = await prisma.meetingParticipant.create({
      data: {
        meeting_id: meetingId,
        team_member_id: teamMemberId,
      },
    });
    return meetingParticipant;
  }
  async removeParticipant(meetingId: string, teamMemberId: string) {
    await prisma.meetingParticipant.delete({
      where: {
        meeting_id_team_member_id: {
          meeting_id: meetingId,
          team_member_id: teamMemberId,
        },
      },
    });
  }
  async getParticipantsByMeetingId(meetingId: string) {
    const participants = await prisma.meetingParticipant.findMany({
      where: {
        meeting_id: meetingId,
      },
      select: {
        id: true,
        meeting_id: true,
        team_member_id: true,
        created_at: true,
        team_member: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
    return participants;
  }
}
