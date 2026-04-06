import type { Request, Response, NextFunction } from "express";
import { ApiError } from "@/lib/utlis.js";
import jwt from "jsonwebtoken";
import { IAccessTokenPayload } from "@/types/user.js";
import { UserService } from "@/services/user.service.js";

const userService = new UserService();

if (!process.env.ACCESS_TOKEN_SECRET) {
  throw new Error(
    "ACCESS_TOKEN_SECRET is not defined in environment variables",
  );
}

export const verifyJWT = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token: string | undefined =
      req.cookies?.accessToken ??
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(401, "Unauthorized");
    }

    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
    ) as IAccessTokenPayload;

    const user = await userService.getUserById(decodedToken.id);
    req.user = user;
    return next();
  } catch (error) {
    next(error);
  }
};
