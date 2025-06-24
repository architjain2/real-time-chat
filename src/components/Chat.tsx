"use client";

import { useState } from "react";
import { useSocket } from "@/contexts/SocketContext";
import UserList from "./UserList";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function Chat() {
	const { user, users, isConnected } = useSocket();
	const [showUserList, setShowUserList] = useState(false);

	return (
		<div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex relative">
			{/* Mobile overlay */}
			{showUserList && (
				<div 
					className="fixed inset-0 bg-black/50 z-40 lg:hidden"
					onClick={() => setShowUserList(false)}
				/>
			)}

			{/* Sidebar with user list */}
			<div className={`${showUserList ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 fixed lg:relative z-50 lg:z-0`}>
				<UserList currentUser={user} onClose={() => setShowUserList(false)} />
			</div>

			{/* Main chat area */}
			<div className="flex-1 flex flex-col w-full lg:w-auto">
				{/* Header */}
				<div className="bg-black/20 backdrop-blur-lg border-b border-white/10 p-4 lg:p-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							{/* Mobile menu button */}
							<button
								onClick={() => setShowUserList(true)}
								className="lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
							>
								<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
								</svg>
							</button>
							<div>
								<h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
									Real-Time Chat
								</h1>
								<p className="text-slate-300 mt-1 text-sm lg:text-base">
									{users.length}{" "}
									{users.length === 1 ? "user" : "users"} online
								</p>
							</div>
						</div>
						<div className="flex items-center space-x-2 lg:space-x-4">
							<div
								className={`flex items-center px-2 lg:px-4 py-1 lg:py-2 rounded-full text-xs lg:text-sm font-medium backdrop-blur-sm ${
									isConnected
										? "bg-green-500/20 text-green-300 border border-green-400/30"
										: "bg-red-500/20 text-red-300 border border-red-400/30"
								}`}
							>
								<div
									className={`w-2 h-2 rounded-full mr-1 lg:mr-2 ${
										isConnected
											? "bg-green-400 animate-pulse"
											: "bg-red-400 animate-pulse"
									}`}
								></div>
								<span className="hidden sm:inline">{isConnected ? "Connected" : "Disconnected"}</span>
							</div>
							{user && (
								<div className="flex items-center space-x-2 lg:space-x-3">
									<div className="w-8 lg:w-10 h-8 lg:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm lg:text-lg font-bold shadow-lg">
										{user.username.charAt(0).toUpperCase()}
									</div>
									<span className="text-sm font-medium text-white hidden sm:inline">
										{user.username}
									</span>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Messages */}
				<MessageList currentUserId={user?.id || null} />

				{/* Message input */}
				<MessageInput />
			</div>
		</div>
	);
}
