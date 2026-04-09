import { TaskStatus } from "@/generated/prisma/enums.js";
import { prisma } from "@/lib/prisma.js";

export class TaskRepository {
  async getTasksByTeamId(teamId: string) {
    const tasks = await prisma.task.findMany({
      where: {
        team_id: teamId,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    return tasks;
  }
  async getTaskByMemberId(userMemberId: string) {
    const tasks = await prisma.task.findMany({
      where: {
        assigned_to_id: userMemberId,
      },
    });
    return tasks;
  }
  async createTask(
    title: string,
    teamId: string,
    creatorId: string,
    assignedUserId: string,
    description?: string,
    deadline?: Date,
  ) {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        team_id: teamId,
        assigned_to_id: assignedUserId,
        deadline,
        created_by_id: creatorId,
      },
    });
    return task;
  }
  async updateTaskStatus(taskId: string, status: TaskStatus) {
    const task = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        status,
      },
    });
    return task;
  }
  async deleteTask(taskId: string) {
    await prisma.task.delete({
      where: {
        id: taskId,
      },
    });
  }
}
