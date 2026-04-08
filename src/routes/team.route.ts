import {
  createTeam,
  joinTeam,
  getMyTeams,
  getTeamMembers,
  addMember,
} from "@/controllers/team.controller.js";
import { verifyJWT } from "@/middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

// Protected routes
router.route("/create").post(verifyJWT, createTeam);
router.route("/join").post(verifyJWT, joinTeam);
router.route("/my-teams").get(verifyJWT, getMyTeams);
router.route("/:teamId/members").get(verifyJWT, getTeamMembers);
router.route("/:teamId/add-member/:memberId").post(verifyJWT, addMember);

export default router;
