import { TeamRepository } from "@/repositories/team.repositories.js";
import { TeamMemberRepository } from "@/repositories/teammember.repositories.js";
import { ApiError } from "@/lib/utlis.js";
import { generateInviteCode } from "@/lib/crypto.js";
import { UserRepository } from "@/repositories/user.repositories.js";

const teamRepository = new TeamRepository();
const teamMemberRepository = new TeamMemberRepository();
const userRepository = new UserRepository();

export class TeamService {
  async createTeam(name: string, leadId: string) {
    const inviteCode = generateInviteCode({ teamName: name, leadId });
    const team = await teamRepository.createTeam(name, inviteCode, leadId);
    const teamMember = await teamMemberRepository.addMember(
      team.id,
      leadId,
      "ADMIN",
    );
    return team;
  }
  async joinTeam(inviteCode: string, userId: string) {
    const team = await teamRepository.findByInviteCode(inviteCode);
    if (!team) {
      throw new ApiError(404, "Team not found");
    }
    const member = await teamMemberRepository.addMember(team.id, userId);
    return team;
  }
  async getTeamsByUserId(userId: string) {
    const teams = await teamMemberRepository.findByUserId(userId);
    return teams.map((t) => t.team);
  }
  async getTeamMembers(teamId: string) {
    const members = await teamMemberRepository.findByTeamId(teamId);
    return members.map((m) => m.user);
  }
  async addMember(teamId: string, userId: string, memberId: string) {
    const team = await teamRepository.findById(teamId);
    if (!team) {
      throw new ApiError(404, "Team not found");
    }
    if (team.lead_id !== userId) {
      throw new ApiError(403, "Only team lead can add members");
    }
    const member = await teamMemberRepository.addMember(teamId, memberId);
    return member;
  }
}
