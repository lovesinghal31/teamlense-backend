import { Role } from "@/generated/prisma/enums.js";
import { IUser } from "./user.js";

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

export interface ITeamMemberWithUser extends ITeamMember {
  user: IUser;
}
