"use client";

import { useSocket } from "@/contexts/SocketContext";
import { User } from "@/types/chat";

interface UserListProps {
	currentUser: User | null;
	onClose?: () => void;
}

export default function UserList({ currentUser, onClose }: UserListProps) {
	const { users } = useSocket();

	return (
		<div className="bg-black/20 backdrop-blur-lg border-r border-white/10 w-72 lg:w-72 flex flex-col h-screen">
			<div className="p-4 lg:p-6 border-b border-white/10 flex items-center justify-between">
				<div>
					<h2 className="text-lg lg:text-xl font-bold text-white mb-1">
						Online Users
					</h2>
					<p className="text-slate-300 text-sm">
						{users.length} online
					</p>
				</div>
				{/* Mobile close button */}
				{onClose && (
					<button
						onClick={onClose}
						className="lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
					>
						<svg
							className="w-5 h-5 text-white"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				)}
			</div>

			<div className="flex-1 overflow-y-auto p-3 lg:p-4">
				<div className="space-y-2">
					{users.map((user) => (
						<div
							key={user.id}
							className={`flex items-center space-x-3 p-2 lg:p-3 rounded-xl transition-all duration-200 ${
								user.id === currentUser?.id
									? "bg-blue-500/20 border border-blue-400/30 shadow-lg"
									: "hover:bg-white/5"
							}`}
						>
							<div className="w-8 lg:w-10 h-8 lg:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs lg:text-sm font-bold shadow-lg">
								{user.username.charAt(0).toUpperCase()}
							</div>
							<div className="flex-1 min-w-0">
								<p
									className={`text-sm font-semibold truncate ${
										user.id === currentUser?.id
											? "text-blue-200"
											: "text-white"
									}`}
								>
									{user.username}
									{user.id === currentUser?.id && " (You)"}
								</p>
							</div>
							<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
