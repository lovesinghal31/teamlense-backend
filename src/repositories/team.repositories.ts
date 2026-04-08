import { prisma } from "@/lib/prisma.js";

export class TeamRepository {
  async findByInviteCode(inviteCode: string) {
    return await prisma.team.findUnique({
      where: {
        invite_code: inviteCode,
      },
      select: {
        id: true,
        name: true,
        invite_code: true,
        lead_id: true,
      },
    });
  }
  async findById(id: string) {
    return await prisma.team.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        invite_code: true,
        lead_id: true,
      },
    });
  }
  async findByLeadId(leadId: string) {
    return await prisma.team.findMany({
      where: { lead_id: leadId },
      select: {
        id: true,
        name: true,
        invite_code: true,
        lead_id: true,
      },
    });
  }
  async createTeam(name: string, inviteCode: string, leadId: string) {
    return await prisma.team.create({
      data: {
        name,
        invite_code: inviteCode,
        lead_id: leadId,
      },
      select: {
        id: true,
        name: true,
        invite_code: true,
        lead_id: true,
      },
    });
  }
}
