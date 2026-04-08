import { Role } from "@/generated/prisma/enums.js";
import { prisma } from "@/lib/prisma.js";

export class TeamMemberRepository {
  async findByTeamId(teamId: string) {
    return await prisma.teamMember.findMany({
      where: { team_id: teamId },
      select: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            skills: true,
          },
        },
      },
    });
  }
  async findByUserId(userId: string) {
    return await prisma.teamMember.findMany({
      where: { user_id: userId },
      select: {
        team: {
          select: {
            id: true,
            name: true,
            invite_code: true,
            lead_id: true,
          },
        },
      },
    });
  }

  async addMember(teamId: string, userId: string, role?: Role) {
    return await prisma.teamMember.create({
      data: {
        team_id: teamId,
        user_id: userId,
        role,
      },
      select: {
        id: true,
        team_id: true,
        user_id: true,
        role: true,
      },
    });
  }
}
