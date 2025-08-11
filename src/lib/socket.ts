    import { Server as ServerIO } from "socket.io";
    import { Server as NetServer } from "http";
    import { NextApiRequest } from "next";
    import { NextApiResponse } from "next";

    export type NextApiResponseWithSocket = NextApiResponse & {
    socket: {
        server: NetServer & {
        io?: ServerIO;
        };
    };
    };

    export const SocketHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
    if (res.socket.server.io) {
        console.log("Socket is already running");
    } else {
        console.log("Socket is initializing");
        const httpServer: NetServer = res.socket.server as any;
        const io = new ServerIO(httpServer, {
        path: "/api/socket",
        addTrailingSlash: false,
        });
        
        // Attach Socket.IO server to the Next.js server
        res.socket.server.io = io;
        
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
    res.end();
    };