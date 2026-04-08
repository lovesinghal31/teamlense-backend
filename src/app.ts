import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApiError } from "@/lib/utlis.js";
import { Prisma } from "./generated/prisma/client.js";

if (!process.env.CORS_ORIGIN) {
  throw new Error("CORS_ORIGIN is not defined in the environment variables.");
}

// router imports
import userRouter from "@/routes/user.route.js";
import teamRouter from "@/routes/team.route.js";

const app = express();
app.set("trust proxy", 1);
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/team", teamRouter);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
    });
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    let message = "Database error";

    switch (err.code) {
      case "P2002":
        message = `Duplicate value for field: ${
          (err.meta?.target as string[])?.join(", ") || "unknown"
        }`;
        return res.status(409).json({
          success: false,
          message,
        });

      case "P2025":
        message = "Record not found";
        return res.status(404).json({
          success: false,
          message,
        });

      case "P2003":
        message = "Invalid reference (foreign key constraint failed)";
        return res.status(400).json({
          success: false,
          message,
        });

      default:
        return res.status(400).json({
          success: false,
          message: err.message,
        });
    }
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

export { app };
