    import { NextRequest, NextResponse } from "next/server";
    import Order from "@/models/Order";
    import { getServerSession } from "next-auth";
    import { authOptions } from "@/lib/auth.config";

    export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const order = await Order.findById(params.id).lean();

        if (!order) {
        return NextResponse.json(
            { message: "Order not found" },
            { status: 404 }
        );
        }

        // Convert ObjectId fields to strings
        const orderWithStringId = {
        ...order,
        _id: order._id.toString(),
        customerId: order.customerId.toString(),
        serviceId: order.serviceId.toString(),
        courierId: order.courierId?.toString(),
        };

        return NextResponse.json(orderWithStringId);
    } catch (error) {
        console.error("Error fetching order:", error);
        return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
        );
    }
    }

    export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        const updateData = await request.json();

        if (!session) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
        }

        const order = await Order.findById(params.id);
        if (!order) {
        return NextResponse.json(
            { message: "Order not found" },
            { status: 404 }
        );
        }

        // Check permissions
        if (session.user.role === "courier" && order.courierId?.toString() !== session.user.id) {
        return NextResponse.json(
            { message: "You can only update your assigned orders" },
            { status: 403 }
        );
        }

        if (session.user.role === "customer" && order.customerId.toString() !== session.user.id) {
        return NextResponse.json(
            { message: "You can only update your own orders" },
            { status: 403 }
        );
        }

        // Update order
        const updatedOrder = await Order.findByIdAndUpdate(
        params.id,
        { 
            ...updateData, 
            updatedAt: new Date(),
            // Set actual delivery time if status is delivered
            ...(updateData.status === "delivered" && { actualDelivery: new Date() })
        },
        { new: true }
        );

        // Convert to JSON to trigger the toJSON method
        const orderJson = updatedOrder.toJSON();

        // Emit socket event for real-time updates
        if (request.socket?.server?.io) {
        request.socket.server.io.to(`customer-${order.customerId}`).emit("order-updated", {
            orderId: params.id,
            status: updateData.status,
            timestamp: new Date()
        });

        if (order.courierId) {
            request.socket.server.io.to(`courier-${order.courierId}`).emit("order-updated", {
            orderId: params.id,
            status: updateData.status,
            timestamp: new Date()
            });
        }
        }

        return NextResponse.json(
        { 
            message: "Order updated successfully",
            order: orderJson
        }
        );
    } catch (error) {
        console.error("Error updating order:", error);
        return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
        );
    }
    }

    export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
        }

        const order = await Order.findByIdAndDelete(params.id);

        if (!order) {
        return NextResponse.json(
            { message: "Order not found" },
            { status: 404 }
        );
        }

        // Check permissions
        if (session.user.role === "customer" && order.customerId.toString() !== session.user.id) {
        return NextResponse.json(
            { message: "You can only delete your own orders" },
            { status: 403 }
        );
        }

        return NextResponse.json(
        { message: "Order deleted successfully" }
        );
    } catch (error) {
        console.error("Error deleting order:", error);
        return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
        );
    }
    }