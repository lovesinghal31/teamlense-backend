import "dotenv/config";
import jwt from "jsonwebtoken";
import { UserRepository } from "@/repositories/user.repositories.js";
import { PasswordUtil } from "@/lib/bcrypt.js";
import { generateAccessAndRefreshTokens } from "@/lib/utlis.js";
import { ApiError } from "@/lib/utlis.js";
import { IRefreshTokenPayload } from "@/types/user.js";

if (!process.env.REFRESH_TOKEN_SECRET) {
  throw new Error("REFRESH_TOKEN_SECRET is not defined");
}

const userRepository = new UserRepository();
const passwordUtil = new PasswordUtil();

export class UserService {
  async register(
    name: string,
    email: string,
    password: string,
    skills: string,
  ) {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new ApiError(400, "Email already in use");
    }
    const hashedPassword = await passwordUtil.hashPassword(password);
    const user = await userRepository.createUser(
      name,
      email,
      hashedPassword,
      skills,
    );
    return user;
  }

  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(400, "Invalid email or password");
    }
    const isPasswordValid = await passwordUtil.comparePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new ApiError(400, "Invalid email or password");
    }
    const { accessToken, refreshToken } =
      await generateAccessAndRefreshTokens(user);
    return { id: user.id, accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string) {
    const decodedToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
    ) as IRefreshTokenPayload;
    const user = await userRepository.findById(decodedToken.id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }
    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshTokens(user);
    return { id: user.id, accessToken, refreshToken: newRefreshToken };
  }

  async getUserById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return user;
  }
}
