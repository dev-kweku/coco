    import { NextApiRequest, NextApiResponse } from "next";
    import { Server as NetServer } from "http";
    import { initializeSocketServer } from "@/lib/socket-manager";

    export const dynamic = "force-dynamic";

    export default function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Check if socket exists and has server property
        if (!res.socket || !res.socket.server) {
        console.log("Socket or server not available");
        res.status(500).json({ message: "Socket server not available" });
        return;
        }

        if (!res.socket.server.io) {
        console.log("Initializing Socket.IO server...");
        const httpServer: NetServer = res.socket.server as any;
        initializeSocketServer(httpServer);
        
        // Store the io instance back to the socket server
        if (httpServer) {
            (res.socket.server as any).io = (httpServer as any).io;
        }
        } else {
        console.log("Socket.IO server already initialized");
        }
        
        res.status(200).json({ message: "Socket.IO server initialized" });
    } catch (error) {
        console.error("Error in socket initialization:", error);
        res.status(500).json({ message: "Internal server error" });
    }
    }