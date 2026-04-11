import type { Request, Response, NextFunction } from "express";
import { ApiResponse, ApiError } from "@/lib/utlis.js";
import { ChatService } from "@/services/chat.service.js";
import { IMessage } from "@/types/chat.js";
import { MessageType } from "@/generated/prisma/enums.js";

const chatService = new ChatService();

const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }
    const { content, teamId }: { content: string; teamId: string } = req.body;
    const message = await chatService.createMessage(
      content.trim(),
      userId,
      teamId,
    );
    return res
      .status(201)
      .json(
        new ApiResponse<IMessage>(true, "Message sent successfully", message),
      );
  } catch (error) {
    next(error);
  }
};

const deleteMessage = async (
  req: Request<{ messageId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }
    const { messageId } = req.params;
    await chatService.deleteMessage(messageId);
    return res
      .status(200)
      .json(new ApiResponse(true, "Message deleted successfully"));
  } catch (error) {
    next(error);
  }
};

const getMessagesByTeamId = async (
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
    const messages = await chatService.getMessagesByTeamId(teamId);
    return res
      .status(200)
      .json(
        new ApiResponse<IMessage[]>(
          true,
          "Messages retrieved successfully",
          messages,
        ),
      );
  } catch (error) {
    next(error);
  }
};

const getMessageById = async (
  req: Request<{ messageId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }
    const { messageId } = req.params;
    const message = await chatService.getMessageById(messageId);
    return res
      .status(200)
      .json(
        new ApiResponse<IMessage>(
          true,
          "Message retrieved successfully",
          message,
        ),
      );
  } catch (error) {
    next(error);
  }
};

export { sendMessage, deleteMessage, getMessagesByTeamId, getMessageById };
