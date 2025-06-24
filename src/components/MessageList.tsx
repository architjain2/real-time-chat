"use client";

import { useEffect, useRef } from "react";
import { useSocket } from "@/contexts/SocketContext";
import { Message } from "@/types/chat";
import { formatDistanceToNow } from "date-fns";

interface MessageListProps {
	currentUserId: string | null;
}

export default function MessageList({ currentUserId }: MessageListProps) {
	const { messages } = useSocket();
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const formatTime = (timestamp: number) => {
		try {
			return formatDistanceToNow(new Date(timestamp), {
				addSuffix: true,
			});
		} catch {
			return "just now";
		}
	};

	const renderMessage = (message: Message) => {
		const isOwnMessage = message.userId === currentUserId;
		const isSystemMessage = message.type === "system";

		if (isSystemMessage) {
			return (
				<div key={message.id} className="flex justify-center my-3">
					<div className="bg-white/10 backdrop-blur-sm text-slate-300 text-sm px-4 py-2 rounded-full border border-white/20">
						{message.content}
					</div>
				</div>
			);
		}

		return (
			<div
				key={message.id}
				className={`flex ${
					isOwnMessage ? "justify-end" : "justify-start"
				} mb-4 lg:mb-6`}
			>
				<div
					className={`max-w-[85%] sm:max-w-xs lg:max-w-md ${
						isOwnMessage ? "order-2" : "order-1"
					}`}
				>
					{!isOwnMessage && (
						<div className="flex items-center mb-1 lg:mb-2">
							<div className="w-6 lg:w-8 h-6 lg:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs lg:text-sm font-bold mr-2 lg:mr-3 shadow-lg">
								{message.username.charAt(0).toUpperCase()}
							</div>
							<span className="text-xs lg:text-sm font-semibold text-white">
								{message.username}
							</span>
						</div>
					)}
					<div
						className={`px-3 lg:px-4 py-2 lg:py-3 rounded-2xl shadow-lg ${
							isOwnMessage
								? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-md"
								: "bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-bl-md"
						}`}
					>
						<p className="text-sm leading-relaxed">
							{message.content}
						</p>
					</div>
					<div
						className={`text-xs text-slate-400 mt-1 lg:mt-2 ${
							isOwnMessage ? "text-right" : "text-left"
						}`}
					>
						{formatTime(message.timestamp)}
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="flex-1 overflow-y-auto p-3 lg:p-6 bg-gradient-to-b from-transparent to-black/5">
			{messages.length === 0 ? (
				<div className="flex items-center justify-center h-full px-4">
					<div className="text-center">
						<div className="w-16 lg:w-20 h-16 lg:h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6 border border-white/20">
							<svg
								className="w-8 lg:w-10 h-8 lg:h-10 text-slate-300"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
								/>
							</svg>
						</div>
						<h3 className="text-lg lg:text-xl font-semibold text-white mb-2 lg:mb-3">
							No messages yet
						</h3>
						<p className="text-slate-300 text-base lg:text-lg">
							Start the conversation by sending a message!
						</p>
					</div>
				</div>
			) : (
				<>
					{messages.map(renderMessage)}
					<div ref={messagesEndRef} />
				</>
			)}
		</div>
	);
}
