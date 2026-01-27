import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandle.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { chatIdSchema, createChatSchema } from "../validators/chatValidator";
import { createChatService, getSingleChatService, getUserChatsService } from "../services/chat.service";

export const createChatController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const body = createChatSchema.parse(req.body);
    const chat = await createChatService(userId, body);

    return res.status(HTTPSTATUS.OK).json({
      message: "chat created successfully",
      data: chat,
    });
  },
);


export const getUserChatsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const chats = await getUserChatsService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Users chats retrieved successfully",
      data: chats,
    });
  },
);


export const getSingleChatController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { chatId } = chatIdSchema.parse(req.params);

    const { chat, messages } = await getSingleChatService( chatId, userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Chat retrieved successfully",
      chat: chat,
      messages: messages,
    });

  }
)