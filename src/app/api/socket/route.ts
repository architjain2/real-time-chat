import { NextRequest, NextResponse } from "next/server";
import { Server as NetServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { Socket } from "socket.io";
import {
	User,
	Message,
	ServerToClientEvents,
	ClientToServerEvents,
} from "@/types/chat";
import { v4 as uuidv4 } from "uuid";

interface ExtendedSocket
	extends Socket<ClientToServerEvents, ServerToClientEvents> {
	user?: User;
}

let io: SocketIOServer | undefined;
const users = new Map<string, User>();
const messages: Message[] = [];

function initializeSocketIO(server: NetServer) {
	if (io) return io;

	io = new SocketIOServer(server, {
		path: "/api/socket",
		addTrailingSlash: false,
		cors: {
			origin: "*",
			methods: ["GET", "POST"],
		},
	});

	io.on("connection", (socket: ExtendedSocket) => {
		console.log("User connected:", socket.id);

		socket.on("joinRoom", (username: string) => {
			const user: User = {
				id: socket.id,
				username: username.trim(),
			};

			socket.user = user;
			users.set(socket.id, user);

			// Send chat history to the new user
			socket.emit("usersList", Array.from(users.values()));
			messages.forEach((message) => {
				socket.emit("message", message);
			});

			// Broadcast to other users that someone joined
			socket.broadcast.emit("userJoined", user);
			socket.broadcast.emit("usersList", Array.from(users.values()));

			// Send system message
			const systemMessage: Message = {
				id: uuidv4(),
				content: `${username} joined the chat`,
				userId: "system",
				username: "System",
				timestamp: Date.now(),
				type: "system",
			};
			messages.push(systemMessage);
			io?.emit("message", systemMessage);
		});

		socket.on("sendMessage", (content: string) => {
			if (!socket.user || !content.trim()) return;

			const message: Message = {
				id: uuidv4(),
				content: content.trim(),
				userId: socket.user.id,
				username: socket.user.username,
				timestamp: Date.now(),
				type: "text",
			};

			messages.push(message);
			io?.emit("message", message);
		});

		socket.on("disconnect", () => {
			console.log("User disconnected:", socket.id);

			if (socket.user) {
				const user = socket.user;
				users.delete(socket.id);

				// Broadcast to other users that someone left
				socket.broadcast.emit("userLeft", user);
				socket.broadcast.emit("usersList", Array.from(users.values()));

				// Send system message
				const systemMessage: Message = {
					id: uuidv4(),
					content: `${user.username} left the chat`,
					userId: "system",
					username: "System",
					timestamp: Date.now(),
					type: "system",
				};
				messages.push(systemMessage);
				socket.broadcast.emit("message", systemMessage);
			}
		});
	});

	return io;
}

export async function GET() {
	return NextResponse.json({ message: "Socket.IO server endpoint" });
}

export async function POST(request: NextRequest) {
	const server = (global as any).httpServer;
	if (server && !io) {
		initializeSocketIO(server);
	}

	return NextResponse.json({ message: "Socket.IO initialized" });
}
