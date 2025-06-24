"use client";

import {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import {
	User,
	Message,
	ServerToClientEvents,
	ClientToServerEvents,
} from "@/types/chat";

interface SocketContextType {
	socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
	isConnected: boolean;
	users: User[];
	messages: Message[];
	joinRoom: (username: string) => void;
	sendMessage: (content: string) => void;
	user: User | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
	const context = useContext(SocketContext);
	if (!context) {
		throw new Error("useSocket must be used within a SocketProvider");
	}
	return context;
};

interface SocketProviderProps {
	children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
	const [socket, setSocket] = useState<Socket<
		ServerToClientEvents,
		ClientToServerEvents
	> | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const [users, setUsers] = useState<User[]>([]);
	const [messages, setMessages] = useState<Message[]>([]);
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const socketInstance = io(
			process.env.NODE_ENV === "production"
				? ""
				: "http://localhost:3000",
			{
				path: "/api/socket",
			}
		);

		socketInstance.on("connect", () => {
			console.log("Connected to server");
			setIsConnected(true);
		});

		socketInstance.on("disconnect", () => {
			console.log("Disconnected from server");
			setIsConnected(false);
			setUser(null);
		});

		socketInstance.on("message", (message: Message) => {
			setMessages((prev) => [...prev, message]);
		});

		socketInstance.on("userJoined", (newUser: User) => {
			setUsers((prev) => [...prev, newUser]);
		});

		socketInstance.on("userLeft", (leftUser: User) => {
			setUsers((prev) => prev.filter((u) => u.id !== leftUser.id));
		});

		socketInstance.on("usersList", (usersList: User[]) => {
			setUsers(usersList);
		});

		setSocket(socketInstance);

		return () => {
			socketInstance.disconnect();
		};
	}, []);

	const joinRoom = (username: string) => {
		if (socket && username.trim()) {
			const newUser: User = {
				id: socket.id || "",
				username: username.trim(),
			};
			setUser(newUser);
			socket.emit("joinRoom", username.trim());
		}
	};

	const sendMessage = (content: string) => {
		if (socket && content.trim()) {
			socket.emit("sendMessage", content.trim());
		}
	};

	return (
		<SocketContext.Provider
			value={{
				socket,
				isConnected,
				users,
				messages,
				joinRoom,
				sendMessage,
				user,
			}}
		>
			{children}
		</SocketContext.Provider>
	);
};
