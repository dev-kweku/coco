    import { NextRequest, NextResponse } from "next/server";
    import { initializeSocketServer } from "./socket-manager";

    export function withSocket(handler: (req: NextRequest, res: NextResponse) => Promise<NextResponse>) {
    return async (req: NextRequest, res: NextResponse) => {
        try {
        // Initialize socket if not already initialized
        if (res.socket?.server && !res.socket.server.io) {
            console.log("Initializing Socket.IO server from middleware...");
            initializeSocketServer(res.socket.server);
        }
        
        return await handler(req, res);
        } catch (error) {
        console.error("Error in socket middleware:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
        }
    };
    }