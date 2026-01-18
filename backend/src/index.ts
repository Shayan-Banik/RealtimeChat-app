import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { Env } from "./config/env.config";
import cookieParser from "cookie-parser";
import { asyncHandler } from "./middlewares/asyncHandle.middleware";
import { HTTPSTATUS } from "./config/http.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import connectDB from "./config/database.config";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: Env.FRONTEND_ORIGIN,
    credentials: true,
  }),
);

app.get(
  "/healthy",
  asyncHandler(async (req: Request, res: Response) => {
    res.status(HTTPSTATUS.OK).json({
      status: "OK",
      message: "Server is Healthy",
    });
  }),
);

app.use(errorHandler)

app.listen(Env.PORT, async () => {
  await connectDB();
  console.log(`Serer running on port ${Env.PORT} in ${Env.NODE_ENV} mode`);
});
