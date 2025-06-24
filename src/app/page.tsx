"use client";

import { SocketProvider, useSocket } from "@/contexts/SocketContext";
import Login from "@/components/Login";
import Chat from "@/components/Chat";

function ChatApp() {
	const { user, joinRoom, isConnected } = useSocket();

	const handleLogin = (username: string) => {
		joinRoom(username);
	};

	if (!user) {
		return <Login onLogin={handleLogin} isConnected={isConnected} />;
	}

	return <Chat />;
}

export default function Home() {
	return (
		<SocketProvider>
			<ChatApp />
		</SocketProvider>
	);
}
