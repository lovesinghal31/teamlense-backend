import { MessageType } from "@/generated/prisma/enums.js";
import { prisma } from "@/lib/prisma.js";

export class ChatRepository {
  async createMessage(
    content: string,
    senderMemberId: string,
    teamId: string,
    type: MessageType,
  ) {
    const message = await prisma.message.create({
      data: {
        content,
        sender_member_id: senderMemberId,
        team_id: teamId,
        type,
      },
    });
    return message;
  }
  async deleteMessage(messageId: string) {
    await prisma.message.delete({
      where: {
        id: messageId,
      },
    });
  }
  async getMessagesByTeamId(teamId: string) {
    const messages = await prisma.message.findMany({
      where: {
        team_id: teamId,
      },
      orderBy: {
        created_at: "asc",
      },
    });
    return messages;
  }
  async getMessageById(messageId: string) {
    const message = await prisma.message.findUnique({
      where: {
        id: messageId,
      },
    });
    return message;
  }
}
