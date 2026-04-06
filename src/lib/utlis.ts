import "dotenv/config";
import jwt from "jsonwebtoken";
import {
  IUser,
  IAccessTokenPayload,
  IRefreshTokenPayload,
} from "@/types/user.js";
import { CookieOptions } from "express";

if (!process.env.ACCESS_TOKEN_SECRET) {
  throw new Error(
    "ACCESS_TOKEN_SECRET is not defined in environment variables",
  );
}

if (!process.env.REFRESH_TOKEN_SECRET) {
  throw new Error(
    "REFRESH_TOKEN_SECRET is not defined in environment variables",
  );
}

class ApiResponse<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
  constructor(success: boolean, message: string, data?: T) {
    this.success = success;
    this.message = message;
    if (data !== undefined) {
      this.data = data;
    }
  }
}

class ApiError extends Error {
  success: boolean;
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.success = false;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

const generateAccessAndRefreshTokens = async (user: IUser) => {
  try {
    const accessToken = jwt.sign(
      user as IAccessTokenPayload,
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: "15m",
      },
    );
    const refreshToken = jwt.sign(
      { id: user.id } as IRefreshTokenPayload,
      process.env.REFRESH_TOKEN_SECRET as string,
      {
        expiresIn: "7d",
      },
    );
    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error("Error generating tokens");
  }
};

const cookieOptions = (maxAge: number): CookieOptions => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "none" as const,
  maxAge,
  path: "/",
});

export { ApiResponse, ApiError, generateAccessAndRefreshTokens, cookieOptions };
