import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.config";
import ChatModel from "../models/chat.model";
import MessageModel from "../models/message.model";
import { BadRequestException } from "../utils/app-error";
import { emitLastMessageToParticipants, emitNewMessageToChatRoom } from "../lib/socket";

export const getMessageService = async (
  userId: string,
  body: {
    chatId: string;
    content?: string;
    image?: string;
    replyTo?: string;
  },
) => {
  const { chatId, content, image, replyTo } = body;

  const chat = await ChatModel.findOne({
    _id: chatId,
    participants: { $in: [userId] },
  });

  if (!chat) {
    throw new BadRequestException("Chat not found or access denied");
  }

  if (replyTo) {
    const replyMessage = await MessageModel.findOne({
      _id: replyTo,
      chatId: chatId,
    });

    if (!replyMessage) {
      throw new BadRequestException("Reply message not found in this chat");
    }
  }
  let imageUrl;
  if (image) {
    const uploadRes = await cloudinary.uploader.upload(image);
    imageUrl = uploadRes.secure_url;
  }

  const newMessage = await MessageModel.create({
    chatId,
    sender: userId,
    content,
    image: imageUrl,
    replyTo: replyTo,
  });

  await newMessage.populate([
    { path: "sender", select: "name avatar" },
    {
      path: "replyTo",
      select: "content",
      populate: { path: "sender", select: "name avatar" },
    },
  ]);

  chat.lastMessage = newMessage._id as mongoose.Types.ObjectId;
  await chat.save();

  //webSocket emit the new message to the chat room
  emitNewMessageToChatRoom(userId, newMessage, chatId);

  //Web-socket emits the last message
  const allParticipantIds = chat.participants.map((participant) => {
      return participant.toString();
  });
  emitLastMessageToParticipants(allParticipantIds, newMessage, chatId);

  return { userMessage :newMessage, chat };
};
