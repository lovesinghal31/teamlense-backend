import {
  sendMessage,
  deleteMessage,
  getMessagesByTeamId,
  getMessageById,
} from "@/controllers/chat.controller.js";
import { verifyJWT } from "@/middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

// Protected routes
router.route("/send").post(verifyJWT, sendMessage);
router.route("/:messageId").delete(verifyJWT, deleteMessage);
router.route("/team/:teamId").get(verifyJWT, getMessagesByTeamId);
router.route("/:messageId").get(verifyJWT, getMessageById);

export default router;
