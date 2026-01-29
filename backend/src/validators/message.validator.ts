import { isValidObjectId } from "mongoose";
import { z } from "zod";

export const messageSchema = z.object({
  chatId: z.string().trim().min(1, "Chat ID is required"),
  content: z.string().trim().max(1000, "Content too long").optional(),
  image: z.string().trim().optional(),
  replyTo: z.string().trim().optional().transform((val) => (val === "" ? undefined : val))
})
.refine((data) => data.content || data.image, {
  message: "Either content or image must be provided",
  path: ["content"],
});

