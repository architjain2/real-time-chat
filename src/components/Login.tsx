"use client";

import { useState } from "react";

interface LoginProps {
	onLogin: (username: string) => void;
	isConnected: boolean;
}

export default function Login({ onLogin, isConnected }: LoginProps) {
	const [username, setUsername] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!username.trim() || !isConnected) return;

		setIsLoading(true);
		onLogin(username.trim());
		setIsLoading(false);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
			<div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6 lg:p-8 w-full max-w-md">
				<div className="text-center mb-6 lg:mb-8">
					<div className="inline-flex items-center justify-center w-12 lg:w-16 h-12 lg:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-3 lg:mb-4">
						<svg className="w-6 lg:w-8 h-6 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
						</svg>
					</div>
					<h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2 lg:mb-3">
						Real-Time Chat
					</h1>
					<p className="text-slate-300 text-base lg:text-lg">
						Enter your username to join the conversation
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
					<div>
						<label
							htmlFor="username"
							className="block text-sm font-semibold text-white mb-2 lg:mb-3"
						>
							Username
						</label>
						<input
							id="username"
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							placeholder="Enter your username"
							className="w-full px-3 lg:px-4 py-3 lg:py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-slate-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all duration-200 text-sm lg:text-base"
							maxLength={20}
							required
						/>
					</div>

					<button
						type="submit"
						disabled={!username.trim() || !isConnected || isLoading}
						className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 lg:py-4 px-4 lg:px-6 rounded-xl font-semibold text-base lg:text-lg shadow-lg hover:shadow-xl focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
					>
						{isLoading ? (
							<div className="flex items-center justify-center">
								<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Joining...
							</div>
						) : (
							"Join Chat"
						)}
					</button>
				</form>

				<div className="mt-6 lg:mt-8 text-center">
					<div
						className={`inline-flex items-center px-3 lg:px-4 py-1 lg:py-2 rounded-full text-sm font-medium backdrop-blur-sm ${
							isConnected
								? "bg-green-500/20 text-green-300 border border-green-400/30"
								: "bg-red-500/20 text-red-300 border border-red-400/30"
						}`}
					>
						<div
							className={`w-2 h-2 rounded-full mr-2 ${
								isConnected ? "bg-green-400 animate-pulse" : "bg-red-400 animate-pulse"
							}`}
						></div>
						{isConnected ? "Connected" : "Connecting..."}
					</div>
				</div>
			</div>
		</div>
	);
}
