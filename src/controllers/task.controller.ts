import type { Request, Response, NextFunction } from "express";
import { ApiResponse, ApiError } from "@/lib/utlis.js";
import { TaskService } from "@/services/task.service.js";
import {
  createTaskSchema,
  getTasksForTeamSchema,
  getTasksForUserAndTeamSchema,
  updateTaskStatusSchema,
  deleteTaskSchema,
} from "@/lib/schema/task-schema.js";
import { ITask } from "@/types/task.js";
import { TaskStatus } from "@/generated/prisma/enums.js";

const taskService = new TaskService();

const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }
    const {
      title,
      teamId,
      assignedToId,
      description,
      deadline,
    }: {
      title: string;
      teamId: string;
      assignedToId: string;
      description?: string;
      deadline?: string;
    } = req.body;
    const parsedData = createTaskSchema.safeParse({
      title,
      teamId,
      userId,
      assignedToId,
      description,
      deadline,
    });
    if (!parsedData.success) {
      const errorMessages = parsedData.error.issues.map(
        (issue) => issue.message,
      );
      throw new ApiError(400, errorMessages.join(", "));
    }
    const task = await taskService.createTask(
      parsedData.data.title,
      parsedData.data.teamId,
      parsedData.data.userId,
      parsedData.data.assignedToId,
      parsedData.data.description,
      parsedData.data.deadline,
    );
    return res
      .status(201)
      .json(new ApiResponse<ITask>(true, "Task created successfully", task));
  } catch (error) {
    next(error);
  }
};

const getTasksForTeam = async (
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
    const parsedData = getTasksForTeamSchema.safeParse({ teamId });
    if (!parsedData.success) {
      const errorMessages = parsedData.error.issues.map(
        (issue) => issue.message,
      );
      throw new ApiError(400, errorMessages.join(", "));
    }
    const tasks = await taskService.getTaskForTeam(parsedData.data.teamId);
    return res
      .status(200)
      .json(
        new ApiResponse<ITask[]>(true, "Tasks retrieved successfully", tasks),
      );
  } catch (error) {
    next(error);
  }
};

const getTasksForUserAndTeam = async (
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
    const parsedData = getTasksForUserAndTeamSchema.safeParse({
      teamId,
      userId,
    });
    if (!parsedData.success) {
      const errorMessages = parsedData.error.issues.map(
        (issue) => issue.message,
      );
      throw new ApiError(400, errorMessages.join(", "));
    }
    const tasks = await taskService.getTaskForUserAndTeam(
      parsedData.data.userId,
      parsedData.data.teamId,
    );
    return res
      .status(200)
      .json(
        new ApiResponse<ITask[]>(true, "Tasks retrieved successfully", tasks),
      );
  } catch (error) {
    next(error);
  }
};

const updateTaskStatus = async (
  req: Request<{ taskId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }
    const { taskId } = req.params;
    const { status }: { status: TaskStatus } = req.body;
    const parsedData = updateTaskStatusSchema.safeParse({ taskId, status });
    if (!parsedData.success) {
      const errorMessages = parsedData.error.issues.map(
        (issue) => issue.message,
      );
      throw new ApiError(400, errorMessages.join(", "));
    }
    const task = await taskService.updateTaskStatus(
      parsedData.data.taskId,
      parsedData.data.status,
    );
    return res
      .status(200)
      .json(
        new ApiResponse<ITask>(true, "Task status updated successfully", task),
      );
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (
  req: Request<{ taskId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }
    const { taskId } = req.params;
    const parsedData = deleteTaskSchema.safeParse({ taskId });
    if (!parsedData.success) {
      const errorMessages = parsedData.error.issues.map(
        (issue) => issue.message,
      );
      throw new ApiError(400, errorMessages.join(", "));
    }
    await taskService.deleteTask(parsedData.data.taskId);
    return res
      .status(200)
      .json(new ApiResponse(true, "Task deleted successfully"));
  } catch (error) {
    next(error);
  }
};

export {
  createTask,
  getTasksForTeam,
  getTasksForUserAndTeam,
  updateTaskStatus,
  deleteTask,
};
