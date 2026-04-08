import "dotenv/config";
import bcrypt from "bcrypt";
import { ApiError } from "@/lib/utlis.js";

export class PasswordUtil {
  private saltRounds: number;

  constructor() {
    if (!process.env.SALT_ROUNDS) {
      throw new ApiError(500, "SALT_ROUNDS environment variable is not set");
    }

    this.saltRounds = parseInt(process.env.SALT_ROUNDS);
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async comparePassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}