import { z } from "zod";

export const createChatSchema = z.object({
    participants : z.array(z.string().trim().min(3)).optional(),
    participantId : z.string().trim().min(3).optional(),
    isGroup : z.boolean().optional(),
    groupName : z.string().trim().min(3).optional(),
});

export const chatIdSchema = z.object({
    chatId : z.string().trim().min(3),
});