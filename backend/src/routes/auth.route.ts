import { Router } from "express";
import { authStatusHandler, loginHandler, logoutHandler, registerHandler } from "../controllers/auth.controller";
import { passportAuthenticateJwt } from "../config/passport.config";

const authRoutes = Router()
.post("/register", registerHandler)
.post("/login", loginHandler)
.post("/logout", logoutHandler)
.get("/status", passportAuthenticateJwt, authStatusHandler)

export default authRoutes;