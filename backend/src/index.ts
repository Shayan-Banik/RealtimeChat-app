import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { Env } from "./config/env.config";
import cookieParser from "cookie-parser";
import { asyncHandler } from "./middlewares/asyncHandle.middleware";
import { HTTPSTATUS } from "./config/http.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import connectDB from "./config/database.config";
import passport from "passport";
import "./config/passport.config";
import routers from "./routes";

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

app.use(passport.initialize());

app.get(
  "/healthy",
  asyncHandler(async (req: Request, res: Response) => {
    res.status(HTTPSTATUS.OK).json({
      status: "OK",
      message: "Server is Healthy",
    });
  }),
);

app.use("/api", routers);

app.use(errorHandler);

app.listen(Env.PORT, async () => {
  await connectDB();
  console.log(`Serer running on port ${Env.PORT} in ${Env.NODE_ENV} mode`);
});
