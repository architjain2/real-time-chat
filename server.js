const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid");

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const users = new Map();
const messages = [];

app.prepare().then(() => {
	const server = createServer((req, res) => {
		handle(req, res);
	});

	const io = new Server(server, {
		path: "/api/socket",
		addTrailingSlash: false,
		cors: {
			origin: "*",
			methods: ["GET", "POST"],
		},
	});

	io.on("connection", (socket) => {
		console.log("User connected:", socket.id);

		socket.on("joinRoom", (username) => {
			const user = {
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
			const systemMessage = {
				id: uuidv4(),
				content: `${username} joined the chat`,
				userId: "system",
				username: "System",
				timestamp: Date.now(),
				type: "system",
			};
			messages.push(systemMessage);
			io.emit("message", systemMessage);
		});

		socket.on("sendMessage", (content) => {
			if (!socket.user || !content.trim()) return;

			const message = {
				id: uuidv4(),
				content: content.trim(),
				userId: socket.user.id,
				username: socket.user.username,
				timestamp: Date.now(),
				type: "text",
			};

			messages.push(message);
			io.emit("message", message);
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
				const systemMessage = {
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

	server.listen(port, () => {
		console.log(`> Ready on http://localhost:${port}`);
	});
});
