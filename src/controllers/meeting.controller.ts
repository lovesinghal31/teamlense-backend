import type { Request, Response, NextFunction } from "express";
import { ApiResponse, ApiError } from "@/lib/utlis.js";
import { MeetingService } from "@/services/meeting.service.js";

import {
  IMeeting,
  IMeetingParticipantWithoutDetails,
  IMeetingParticipantWithDetails,
} from "@/types/meeting.js";
import { MeetingStatus } from "@/generated/prisma/enums.js";

const meetingService = new MeetingService();

const createMeeting = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }
    const {
      title,
      agenda,
      teamId,
      startTime,
      endTime,
      status,
    }: {
      title: string;
      agenda: string;
      teamId: string;
      startTime: string;
      endTime?: string;
      status: MeetingStatus;
    } = req.body;
    console.log("Creating meeting with data:", {
      title,
      agenda,
      teamId,
      startTime,
      endTime,
      status,
    });
    const meeting = await meetingService.createMeeting(
      title,
      agenda,
      teamId,
      userId,
      startTime,
      status,
      endTime,
    );
    return res
      .status(201)
      .json(
        new ApiResponse<IMeeting>(
          true,
          "Meeting created successfully",
          meeting,
        ),
      );
  } catch (error) {
    next(error);
  }
};

const updateMeetingStatus = async (
  req: Request<{ meetingId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }
    const { meetingId } = req.params;
    const { status }: { status: MeetingStatus } = req.body;
    const updatedMeeting = await meetingService.updateMeetingStatus(
      meetingId,
      status,
    );
    return res
      .status(200)
      .json(
        new ApiResponse<IMeeting>(
          true,
          "Meeting status updated successfully",
          updatedMeeting,
        ),
      );
  } catch (error) {
    next(error);
  }
};

const deleteMeeting = async (
  req: Request<{ meetingId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }
    const { meetingId } = req.params;
    await meetingService.deleteMeeting(meetingId);
    return res
      .status(200)
      .json(new ApiResponse(true, "Meeting deleted successfully"));
  } catch (error) {
    next(error);
  }
};

const addParticipant = async (
  req: Request<{ meetingId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }
    const { meetingId } = req.params;
    const { teamMemberId }: { teamMemberId: string } = req.body;
    const participant = await meetingService.addParticipant(
      meetingId,
      teamMemberId,
    );
    return res
      .status(200)
      .json(
        new ApiResponse<IMeetingParticipantWithoutDetails>(
          true,
          "Participant added successfully",
          participant,
        ),
      );
  } catch (error) {
    next(error);
  }
};

const removeParticipant = async (
  req: Request<{ meetingId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }
    const { meetingId } = req.params;
    const { teamMemberId }: { teamMemberId: string } = req.body;
    await meetingService.removeParticipant(meetingId, teamMemberId);
    return res
      .status(200)
      .json(new ApiResponse(true, "Participant removed successfully"));
  } catch (error) {
    next(error);
  }
};

const getMeetingsByTeamId = async (
  req: Request<{ teamId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }
    const { teamId } = req.params;
    const meetings = await meetingService.getMeetingsByTeamId(teamId);
    return res
      .status(200)
      .json(
        new ApiResponse<IMeeting[]>(
          true,
          "Meetings retrieved successfully",
          meetings,
        ),
      );
  } catch (error) {
    next(error);
  }
};

const getMeetingById = async (
  req: Request<{ meetingId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }
    const { meetingId } = req.params;
    const meeting = await meetingService.getMeetingById(meetingId);
    return res
      .status(200)
      .json(
        new ApiResponse<IMeeting>(
          true,
          "Meeting retrieved successfully",
          meeting,
        ),
      );
  } catch (error) {
    next(error);
  }
};

const getMeetingsByMemberId = async (
  req: Request<{ memberId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }
    const { memberId } = req.params;
    const meetings = await meetingService.getMeetingsByMemberId(memberId);
    return res
      .status(200)
      .json(
        new ApiResponse<IMeeting[]>(
          true,
          "Meetings retrieved successfully",
          meetings,
        ),
      );
  } catch (error) {
    next(error);
  }
};

const getParticipantsByMeetingId = async (
  req: Request<{ meetingId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }
    const { meetingId } = req.params;
    const participants =
      await meetingService.getParticipantsByMeetingId(meetingId);
    return res
      .status(200)
      .json(
        new ApiResponse<IMeetingParticipantWithDetails[]>(
          true,
          "Participants retrieved successfully",
          participants,
        ),
      );
  } catch (error) {
    next(error);
  }
};

export {
  createMeeting,
  updateMeetingStatus,
  deleteMeeting,
  addParticipant,
  removeParticipant,
  getMeetingsByTeamId,
  getMeetingById,
  getMeetingsByMemberId,
  getParticipantsByMeetingId,
};
