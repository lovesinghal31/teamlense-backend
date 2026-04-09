import {
  createTask,
  getTasksForTeam,
  getTasksForUserAndTeam,
  updateTaskStatus,
  deleteTask,
} from "@/controllers/task.controller.js";
import { verifyJWT } from "@/middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

// Protected routes
router.route("/create").post(verifyJWT, createTask);
router.route("/team/:teamId").get(verifyJWT, getTasksForTeam);
router.route("/team/:teamId/user-tasks").get(verifyJWT, getTasksForUserAndTeam);
router.route("/:taskId/status").patch(verifyJWT, updateTaskStatus);
router.route("/:taskId").delete(verifyJWT, deleteTask);

export default router;
