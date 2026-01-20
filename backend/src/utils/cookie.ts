import jwt from "jsonwebtoken";
import { Response } from "express";
import { Env } from "../config/env.config";

type Time = `${number}${"s" | "m" | "h" | "d" | "w" | "M" | "y"}`;
type Cookie = {
  res: Response;
  userId: string;
};

export const setJWTAuthCookie = ({ res, userId }: Cookie) => {
  const payload = { userId };
  const expireIn = Env.JWT_EXPIRES_IN as Time;
  const token = jwt.sign(payload, Env.JWT_SECRET, {
    audience: ["user"],
    expiresIn: expireIn || "7d",
  });
  return res.cookie("accesstoken", token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      secure: Env.NODE_ENV === "production" ? true : false,
      sameSite: Env.NODE_ENV === "production" ? "strict" : "lax",
  })
};

export const clearJWTAuthCookie = (res: Response) => {
  return res.clearCookie("accesstoken", { path: "/" });
};