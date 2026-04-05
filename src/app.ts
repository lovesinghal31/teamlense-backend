import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";

if (!process.env.CORS_ORIGIN) {
  throw new Error("CORS_ORIGIN is not defined in the environment variables.");
}

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

export { app };
