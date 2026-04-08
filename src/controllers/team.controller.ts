import type { Request, Response, NextFunction } from "express";
import { ApiResponse, ApiError } from "@/lib/utlis.js";
import { TeamService } from "@/services/team.service.js";
import {
  addMemberSchema,
  createTeamSchema,
  joinTeamSchema,
  teamIdParamSchema,
} from "@/lib/schema/team-schema.js";
import { ITeam, ITeamMember } from "@/types/team.js";
import { IUser } from "@/types/user.js";

const teamService = new TeamService();

const createTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }
    const { name }: { name: string } = req.body;
    const parsedData = createTeamSchema.safeParse({ name });
    if (!parsedData.success) {
      const errorMessages = parsedData.error.issues.map(
        (issue) => issue.message,
      );
      throw new ApiError(400, errorMessages.join(", "));
    }
    const team = await teamService.createTeam(name, userId);
    return res
      .status(201)
      .json(new ApiResponse<ITeam>(true, "Team created successfully", team));
  } catch (error) {
    next(error);
  }
};

const joinTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }
    const { inviteCode }: { inviteCode: string } = req.body;
    const parsedData = joinTeamSchema.safeParse({ invite_code: inviteCode });
    if (!parsedData.success) {
      const errorMessages = parsedData.error.issues.map(
        (issue) => issue.message,
      );
      throw new ApiError(400, errorMessages.join(", "));
    }
    const team = await teamService.joinTeam(inviteCode, userId);
    return res
      .status(200)
      .json(new ApiResponse<ITeam>(true, "Joined team successfully", team));
  } catch (error) {
    next(error);
  }
};

const getMyTeams = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }
    const teams = await teamService.getTeamsByUserId(userId);
    return res
      .status(200)
      .json(
        new ApiResponse<ITeam[]>(true, "Teams retrieved successfully", teams),
      );
  } catch (error) {
    next(error);
  }
};

const getTeamMembers = async (
  req: Request<{ teamId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }
    const teamId = req.params.teamId;
    const parsedData = teamIdParamSchema.safeParse({ teamId });
    if (!parsedData.success) {
      const errorMessages = parsedData.error.issues.map(
        (issue) => issue.message,
      );
      throw new ApiError(400, errorMessages.join(", "));
    }
    const members = await teamService.getTeamMembers(parsedData.data.teamId);
    return res
      .status(200)
      .json(
        new ApiResponse<IUser[]>(
          true,
          "Team members retrieved successfully",
          members,
        ),
      );
  } catch (error) {
    next(error);
  }
};

const addMember = async (
  req: Request<{ teamId: string; memberId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }
    const { teamId, memberId } = req.params;
    const parsedData = addMemberSchema.safeParse({ teamId, memberId });
    if (!parsedData.success) {
      const errorMessages = parsedData.error.issues.map(
        (issue) => issue.message,
      );
      throw new ApiError(400, errorMessages.join(", "));
    }
    const member = await teamService.addMember(
      parsedData.data.teamId,
      userId,
      parsedData.data.memberId,
    );
    return res
      .status(200)
      .json(
        new ApiResponse<ITeamMember>(
          true,
          "Member added to team successfully",
          member,
        ),
      );
  } catch (error) {
    next(error);
  }
};

export { createTeam, joinTeam, getMyTeams, getTeamMembers, addMember };
