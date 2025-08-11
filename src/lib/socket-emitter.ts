    import { getSocketServer } from "./socket-manager";

    export const emitOrderUpdate = (roomId: string, data: any) => {
    try {
        const io = getSocketServer();
        io.to(roomId).emit("order-updated", data);
        console.log(`Emitted order-update to room ${roomId}`);
    } catch (error) {
        console.error("Error emitting order update:", error);
    }
    };

    export const emitNewOrder = (courierId: string, data: any) => {
    try {
        const io = getSocketServer();
        io.to(`courier-${courierId}`).emit("new-order-received", data);
        console.log(`Emitted new-order to courier-${courierId}`);
    } catch (error) {
        console.error("Error emitting new order:", error);
    }
    };