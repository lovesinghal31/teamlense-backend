import {
  createMeeting,
  updateMeetingStatus,
  deleteMeeting,
  addParticipant,
  removeParticipant,
  getMeetingById,
  getMeetingsByMemberId,
  getMeetingsByTeamId,
  getParticipantsByMeetingId,
} from "@/controllers/meeting.controller.js";
import { verifyJWT } from "@/middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

// Protected routes
router.route("/create").post(verifyJWT, createMeeting);
router.route("/:meetingId/status").patch(verifyJWT, updateMeetingStatus);
router.route("/:meetingId").delete(verifyJWT, deleteMeeting);
router.route("/:meetingId/participants").post(verifyJWT, addParticipant);
router.route("/:meetingId/participants").delete(verifyJWT, removeParticipant);
router.route("/:meetingId").get(verifyJWT, getMeetingById);
router.route("/member/:memberId").get(verifyJWT, getMeetingsByMemberId);
router.route("/team/:teamId").get(verifyJWT, getMeetingsByTeamId);
router
  .route("/:meetingId/participants")
  .get(verifyJWT, getParticipantsByMeetingId);

export default router;
