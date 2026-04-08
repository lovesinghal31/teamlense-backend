import { Role } from "@/generated/prisma/enums.js";

export interface ITeam {
  id: string;
  name: string;
  invite_code: string;
  lead_id: string;
}

export interface ITeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: Role;
}
