import type { Request, Response, NextFunction } from "express";
import { ApiResponse, ApiError, cookieOptions } from "@/lib/utlis.js";
import { userSignupSchema, userLoginSchema } from "@/lib/schema/user-schema.js";
import { UserService } from "@/services/user.service.js";
import { ILoginResponse, IUser } from "@/types/user.js";

const userService = new UserService();

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      skills,
    }: {
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
      skills: string;
    } = req.body;

    const parsedData = userSignupSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
      skills,
    });

    if (!parsedData.success) {
      const errorMessages = parsedData.error.issues.map(
        (issue) => issue.message,
      );

      throw new ApiError(400, errorMessages.join(", "));
    }

    const user = await userService.register(name, email, password, skills);

    return res
      .status(201)
      .json(new ApiResponse<IUser>(true, "User registered successfully", user));
  } catch (error) {
    next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password }: { email: string; password: string } = req.body;
    const parsedData = userLoginSchema.safeParse({
      email,
      password,
    });
    if (!parsedData.success) {
      const errorMessages = parsedData.error.issues.map(
        (issue) => issue.message,
      );

      throw new ApiError(400, errorMessages.join(", "));
    }
    const loginResult = await userService.login(email, password);
    return res
      .cookie(
        "accessToken",
        loginResult.accessToken,
        cookieOptions(15 * 60 * 1000),
      )
      .cookie(
        "refreshToken",
        loginResult.refreshToken,
        cookieOptions(7 * 24 * 60 * 60 * 1000),
      )
      .status(200)
      .json(
        new ApiResponse<ILoginResponse>(true, "Login successful", {
          id: loginResult.id,
          accessToken: loginResult.accessToken,
        }),
      );
  } catch (error) {
    next(error);
  }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }
    return res
      .clearCookie("accessToken", cookieOptions(15 * 60 * 1000))
      .clearCookie("refreshToken", cookieOptions(7 * 24 * 60 * 60 * 1000))
      .status(200)
      .json(new ApiResponse(true, "Logout successful"));
  } catch (error) {
    next(error);
  }
};

const refreshTokens = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken: string | undefined =
      req.cookies.refreshToken || req.body.refreshToken;
    if (!refreshToken) {
      throw new ApiError(401, "Refresh token is required");
    }
    const refreshResult = await userService.refreshTokens(refreshToken);
    return res
      .cookie(
        "accessToken",
        refreshResult.accessToken,
        cookieOptions(15 * 60 * 1000),
      )
      .cookie(
        "refreshToken",
        refreshResult.refreshToken,
        cookieOptions(7 * 24 * 60 * 60 * 1000),
      )
      .status(200)
      .json(
        new ApiResponse<ILoginResponse>(true, "Tokens refreshed successfully", {
          id: refreshResult.id,
          accessToken: refreshResult.accessToken,
        }),
      );
  } catch (error) {
    next(error);
  }
};

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }
    const user = await userService.getUserById(userId);
    return res
      .status(200)
      .json(new ApiResponse<IUser>(true, "User retrieved successfully", user));
  } catch (error) {
    next(error);
  }
};

export { register, login, logout, refreshTokens, getUser };
