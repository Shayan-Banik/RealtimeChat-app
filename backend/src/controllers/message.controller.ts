import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandle.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { messageSchema } from "../validators/message.validator";
import { getMessageService } from "../services/message.service";

export const sendMessageController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const body = messageSchema.parse(req.body);
    const messages = await getMessageService(userId, body);

    res.status(HTTPSTATUS.OK).json({
      message: "Messages sent successfully",
      ...messages,
    });
  },
);
