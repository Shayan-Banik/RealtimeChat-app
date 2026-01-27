import ChatModel from "../models/chat.model";
import MessageModel from "../models/message.model";
import UserModel from "../models/user.models";
import { BadRequestException, NotFoundException } from "../utils/app-error";

export const createChatService = async (
  userId: string,
  body: {
    participantId?: string;
    participants?: string[];
    isGroup?: boolean;
    groupName?: string;
  },
) => {
  const { participantId, participants, isGroup, groupName } = body;

  let chat;
  let allParticipantIds: string[] = [];

  if (isGroup && participants?.length && groupName) {
    allParticipantIds = [userId, ...participants];
    const newChat = await ChatModel.create({
      isGroup: true,
      groupName,
      participants: allParticipantIds,
      createdBy: userId,
    });

    return newChat.save();
  } else if (participantId) {
    const otherUser = await UserModel.findById( participantId );

    if (!otherUser) {
      throw new NotFoundException("User not found");
    }

    allParticipantIds = [userId, participantId];

    const existingChat = await ChatModel.findOne({
      participants: { $all: allParticipantIds, $size: 2 },
    }).populate("participants", "name avater");

    if (existingChat) return existingChat;

    chat = await ChatModel.create({
      participants: allParticipantIds,
      createdBy: userId,
      isGroup: false,
    });
  }
  return chat;
};

export const getUserChatsService = async (userId: string) => {
  const chats = await ChatModel.find({
    participants: { $in: [userId] },
  })
    .populate("participants", "name avater")
    .populate({
      path: "lastMessage",
      populate: {
        path: "sender",
        select: "name avater",
      },
    })
    .sort({ updatedAt: -1 });
  return chats;
};

export const getSingleChatService = async (chatId: string, userId: string) => {
  const chat = await ChatModel.findOne({
    _id: chatId,
    participants: { $in: [userId] },
  });

  if (!chat) {
    throw new BadRequestException("Chat not found you are not authorized");
  }
  
  const messages = await MessageModel.find({ chatId })
    .populate("sender", "name avater")
    .populate({
      path: "replyTo",
      select: "content image sender",
      populate: {
        path: "sender",
        select: "name avater",
      },
    })
    .sort({ createdAt: -1 });

  return { chat, messages };
    
};
