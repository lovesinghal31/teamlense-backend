import "dotenv/config";
import bcrypt from "bcrypt";
import { ApiError } from "@/lib/utlis.js";

if (!process.env.SALT_ROUNDS) {
  throw new ApiError(500, "SALT_ROUNDS environment variable is not set");
}

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}
