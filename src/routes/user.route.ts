import {
  register,
  login,
  logout,
  refreshTokens,
  getUser,
} from "@/controllers/user.controller.js";
import { verifyJWT } from "@/middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/refresh-tokens").post(refreshTokens);

// Protected routes
router.route("/logout").post(verifyJWT, logout);
router.route("/me").get(verifyJWT, getUser);

export default router;
