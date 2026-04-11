import { ChatRepository } from "@/repositories/chat.repositories.js";
import { TeamRepository } from "@/repositories/team.repositories.js";
import { TeamMemberRepository } from "@/repositories/teammember.repositories.js";
import { createMessageSchema, uuidSchema } from "@/lib/schema/chat-schema.js";
import { ApiError } from "@/lib/utlis.js";
import { MessageType } from "@/generated/prisma/enums.js";

const chatRepository = new ChatRepository();
const teamRepository = new TeamRepository();
const teamMemberRepository = new TeamMemberRepository();

export class ChatService {
  async createMessage(content: string, userId: string, teamId: string) {
    const parsedData = createMessageSchema.safeParse({
      content,
      userId,
      teamId,
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
    const sender = await teamMemberRepository.findByTeamIdAndUserId(
      parsedData.data.teamId,
      parsedData.data.userId,
    );
    if (!sender) {
      throw new ApiError(404, "Sender not found");
    }
    const isContentCommand = parsedData.data.content.startsWith("/");
    const message = await chatRepository.createMessage(
      parsedData.data.content,
      sender.id,
      team.id,
      isContentCommand ? MessageType.COMMAND : MessageType.TEXT,
    );
    return message;
  }
  async deleteMessage(messageId: string) {
    const parsedData = uuidSchema.safeParse({ id: messageId });
    if (!parsedData.success) {
      const errorMessages = parsedData.error.issues.map(
        (issue) => issue.message,
      );
      throw new ApiError(400, errorMessages.join(", "));
    }
    const message = await chatRepository.getMessageById(parsedData.data.id);
    if (!message) {
      throw new ApiError(404, "Message not found");
    }
    await chatRepository.deleteMessage(parsedData.data.id);
  }
  async getMessagesByTeamId(teamId: string) {
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
    const messages = await chatRepository.getMessagesByTeamId(
      parsedData.data.id,
    );
    return messages;
  }
  async getMessageById(messageId: string) {
    const parsedData = uuidSchema.safeParse({ id: messageId });
    if (!parsedData.success) {
      const errorMessages = parsedData.error.issues.map(
        (issue) => issue.message,
      );
      throw new ApiError(400, errorMessages.join(", "));
    }
    const message = await chatRepository.getMessageById(parsedData.data.id);
    if (!message) {
      throw new ApiError(404, "Message not found");
    }
    return message;
  }
}
