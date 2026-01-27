import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandle.middleware";
import { loginSchema, registerSchema } from "../validators/authValidator";
import { loginService, registerService } from "../services/auth.service";
import { clearJWTAuthCookie, setJWTAuthCookie } from "../utils/cookie";
import { HTTPSTATUS } from "../config/http.config";

export const registerHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const body = registerSchema.parse(req.body);
    
    const user = await registerService(body);
    const userId = user._id.toString();

    return setJWTAuthCookie({ res, userId }).status(HTTPSTATUS.CREATED).json({
      message: "User created successfully",
      data: user,
    });
  },
);

export const loginHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const body = loginSchema.parse(req.body);
    const user = await loginService(body);
    const userId = user._id.toString();

    return setJWTAuthCookie({ res, userId }).status(HTTPSTATUS.OK).json({
      message: "User logged in successfully",
      data: user,
    });
  },
);

export const logoutHandler = asyncHandler(
  async (req: Request, res: Response) => {
    return clearJWTAuthCookie(res).status(HTTPSTATUS.OK).json({
      message: "User logged out successfully",
    });
  },
);

export const authStatusHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user;
    return res.status(HTTPSTATUS.OK).json({
      message: "User is authenticated",
      data: user,
    });
  },
);
