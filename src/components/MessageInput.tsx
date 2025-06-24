"use client";

import { useState } from "react";
import { useSocket } from "@/contexts/SocketContext";

export default function MessageInput() {
	const [message, setMessage] = useState("");
	const { sendMessage, isConnected } = useSocket();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!message.trim() || !isConnected) return;

		sendMessage(message);
		setMessage("");
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(e);
		}
	};

	return (
		<div className="border-t border-white/10 bg-black/20 backdrop-blur-lg p-3 lg:p-6">
			<form onSubmit={handleSubmit} className="flex space-x-2 lg:space-x-4">
				<div className="flex-1">
					<textarea
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						onKeyPress={handleKeyPress}
						placeholder="Type your message..."
						className="w-full px-3 lg:px-4 py-2 lg:py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl resize-none text-white placeholder-slate-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all duration-200 text-sm lg:text-base"
						rows={1}
						maxLength={1000}
						disabled={!isConnected}
					/>
				</div>
				<button
					type="submit"
					disabled={!message.trim() || !isConnected}
					className="px-4 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-1 lg:space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
				>
					<svg
						className="w-4 lg:w-5 h-4 lg:h-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
						/>
					</svg>
					<span className="hidden sm:inline">Send</span>
				</button>
			</form>
		</div>
	);
}
