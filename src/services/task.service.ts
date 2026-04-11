import { TaskRepository } from "@/repositories/task.repositories.js";
import { TeamRepository } from "@/repositories/team.repositories.js";
import { TeamMemberRepository } from "@/repositories/teammember.repositories.js";
import { ApiError } from "@/lib/utlis.js";
import { TaskStatus } from "@/generated/prisma/enums.js";

const taskRepository = new TaskRepository();
const teamRepository = new TeamRepository();
const teamMemberRepository = new TeamMemberRepository();

export class TaskService {
  async createTask(
    title: string,
    teamId: string,
    userId: string,
    assignedToId: string,
    description?: string,
    deadline?: string,
  ) {
    const team = await teamRepository.findById(teamId);
    if (!team) {
      throw new ApiError(404, "Team not found");
    }
    const creator = await teamMemberRepository.findByTeamIdAndUserId(
      teamId,
      userId,
    );
    if (!creator) {
      throw new ApiError(403, "Only team members can create tasks");
    }
    const assignedUser = await teamMemberRepository.findByTeamIdAndUserId(
      teamId,
      assignedToId,
    );
    if (!assignedUser) {
      throw new ApiError(
        400,
        "Assigned user not found or not a member of the team",
      );
    }
    const task = await taskRepository.createTask(
      title,
      teamId,
      creator.id,
      assignedUser.id,
      description,
      deadline ? new Date(deadline) : undefined,
    );
    return task;
  }
  async getTaskForTeam(teamId: string) {
    const team = await teamRepository.findById(teamId);
    if (!team) {
      throw new ApiError(404, "Team not found");
    }
    const tasks = await taskRepository.getTasksByTeamId(teamId);
    return tasks;
  }
  async getTaskForUserAndTeam(userId: string, teamId: string) {
    const member = await teamMemberRepository.findByTeamIdAndUserId(
      teamId,
      userId,
    );
    if (!member) {
      throw new ApiError(403, "Only team members can view tasks");
    }
    const tasks = await taskRepository.getTaskByMemberId(member.id);
    return tasks;
  }
  async updateTaskStatus(taskId: string, status: TaskStatus) {
    const task = await taskRepository.updateTaskStatus(taskId, status);
    return task;
  }
  async deleteTask(taskId: string) {
    await taskRepository.deleteTask(taskId);
  }
}
