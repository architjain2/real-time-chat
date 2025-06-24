export interface User {
	id: string;
	username: string;
	avatar?: string;
}

export interface Message {
	id: string;
	content: string;
	userId: string;
	username: string;
	timestamp: number;
	type: "text" | "system";
}

export interface ChatRoom {
	id: string;
	name: string;
	users: User[];
	messages: Message[];
}

export interface ServerToClientEvents {
	message: (message: Message) => void;
	userJoined: (user: User) => void;
	userLeft: (user: User) => void;
	usersList: (users: User[]) => void;
	systemMessage: (message: string) => void;
}

export interface ClientToServerEvents {
	sendMessage: (content: string) => void;
	joinRoom: (username: string) => void;
	leaveRoom: () => void;
}
