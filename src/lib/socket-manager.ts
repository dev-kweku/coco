    import { Server as ServerIO } from "socket.io";

    let io: ServerIO | null = null;

    export const getSocketServer = () => {
    if (!io) {
        throw new Error("Socket.IO server not initialized");
    }
    return io;
    };

    export const initializeSocketServer = (server: any) => {
    if (!io) {
        io = new ServerIO(server, {
        path: "/api/socket",
        addTrailingSlash: false,
        cors: {
            origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:3000"],
            methods: ["GET", "POST"]
        }
        });

        io.on("connection", (socket) => {
        console.log(`Client connected: ${socket.id}`);
        
        // Join room based on user role
        socket.on("join-room", (room) => {
            socket.join(room);
            console.log(`${socket.id} joined room: ${room}`);
        });
        
        // Handle order updates
        socket.on("order-update", (data) => {
            io.to(data.room).emit("order-updated", data);
        });
        
        // Handle new orders
        socket.on("new-order", (data) => {
            io.to(data.courierId).emit("new-order-received", data);
        });
        
        socket.on("disconnect", () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
        });
    }
    return io;
    };

    export const isSocketInitialized = () => {
    return io !== null;
    };