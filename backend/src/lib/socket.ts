import { Server, type Socket } from "socket.io";
import { Server as HTTPServer } from "http";
import { Env } from "../config/env.config";
import jwt from "jsonwebtoken";
import { validateChatParticipants } from "../services/chat.service";

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

let io: Server | null;

const onlineUsers = new Map<string, string>();
export const initializeScocket = (httpServer: HTTPServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: Env.FRONTEND_ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  //middleware
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      // const token = socket.handshake.auth.token;
      const rawToken = socket.handshake.headers.cookie;
      if (!rawToken) return next(new Error("Unauthorized"));

      const token = rawToken?.split("=")?.[1]?.trim();
      if (!token) return next(new Error("Unauthorized"));

      const decodedToken = jwt.verify(token, Env.JWT_SECRET) as {
        userId: string;
      };
      if (!decodedToken) return next(new Error("Unauthorized"));

      socket.userId = decodedToken.userId;
      next();
    } catch (error) {
      return next(new Error("internal server error"));
    }
  });

  io.on("connection", (socket: AuthenticatedSocket) => {
    if (!socket.userId) {
      return socket.disconnect(true);
    }

    const userId = socket.userId;
    const newSocketId = socket.id;

    console.log("socket connected", userId, newSocketId);

    //register socket for the user
    onlineUsers.set(userId, newSocketId);

    //Broadcast the online users to all sockets
    io?.emit("online:users", Array.from(onlineUsers.keys()));

    //create personla room from user
    socket.join(`user:${userId}`);

    socket.on(
      "chat:join",
      async (chatId: string, callback?: (err?: string) => void) => {
        try {
          await validateChatParticipants(chatId, userId);
          socket.join(`chat:${chatId}`);
          callback?.();
        } catch (error) {}
        callback?.("Error joining chat");
      },
    );

    socket.on("chat:leave", (chatId: string) => {
      if (chatId) {
        socket.leave(`chat:${chatId}`);
        console.log(`User ${userId} left room chat ${chatId}`);
      }
    });

    socket.on("disconnect", () => {
      if (onlineUsers.get(userId) === newSocketId) {
        if (userId) onlineUsers.delete(userId);

        io?.emit("online:users", Array.from(onlineUsers.keys()));

        console.log("socket disconnected", { userId, newSocketId });
      }
    });
  });
};

function getIO() {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}

export const emitNewChatToParticipants = (
  participantIds: string[] = [],
  chat: any,
) => {
  const io = getIO();

  participantIds.forEach((participantId) => {
    io.to(`user:${participantId}`).emit("new:chat", chat);
  });
};

export const emitNewMessageToChatRoom = (
  senderId: string, //userId 
  message: any,
  chatId: string,
) => {
  const io = getIO();
  const senderSocketId = onlineUsers.get(senderId);

  if (senderSocketId) {
    io.to(`chat:${chatId}`).except(senderSocketId).emit("new:message", message);
  } else {
    io.to(`chat:${chatId}`).emit("new:message", message);
  }
};

export const emitLastMessageToParticipants = (
  participantIds: string[] = [],
  lastMessage: any,
  chatId: string,
) => {
  const io = getIO();
  const payload = { lastMessage, chatId };

  participantIds.forEach((participantId) => {
    io.to(`user:${participantId}`).emit("last:message", payload);
  });
};
