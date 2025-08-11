    import { NextRequest, NextResponse } from "next/server";
    import { MongoClient, ObjectId } from "mongodb";
    import Order from "@/models/Order";
    import { getServerSession } from "next-auth";
    import { authOptions } from "@/lib/auth.config";
    import { emitOrderUpdate } from "@/lib/socket-emitter";

    export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const client = new MongoClient(process.env.MONGODB_URI!);
        await client.connect();
        const db = client.db();

        const order = await db.collection("orders").findOne({ _id: new ObjectId(params.id) });

        await client.close();

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

        const client = new MongoClient(process.env.MONGODB_URI!);
        await client.connect();
        const db = client.db();

        const order = await db.collection("orders").findOne({ _id: new ObjectId(params.id) });
        
        if (!order) {
        await client.close();
        return NextResponse.json(
            { message: "Order not found" },
            { status: 404 }
        );
        }

        // Check permissions
        if (session.user.role === "courier" && order.courierId?.toString() !== session.user.id) {
        await client.close();
        return NextResponse.json(
            { message: "You can only update your assigned orders" },
            { status: 403 }
        );
        }

        if (session.user.role === "customer" && order.customerId.toString() !== session.user.id) {
        await client.close();
        return NextResponse.json(
            { message: "You can only update your own orders" },
            { status: 403 }
        );
        }

        // Update order
        const result = await db.collection("orders").updateOne(
        { _id: new ObjectId(params.id) },
        { 
            $set: { 
            ...updateData, 
            updatedAt: new Date(),
            // Set actual delivery time if status is delivered
            ...(updateData.status === "delivered" && { actualDelivery: new Date() })
            }
        }
        );

        await client.close();

        if (result.matchedCount === 0) {
        return NextResponse.json(
            { message: "Order not found" },
            { status: 404 }
        );
        }

        // Emit socket event for real-time updates
        // Notify customer
        emitOrderUpdate(`customer-${order.customerId}`, {
        orderId: params.id,
        status: updateData.status,
        timestamp: new Date()
        });

        // Notify courier if assigned
        if (order.courierId) {
        emitOrderUpdate(`courier-${order.courierId}`, {
            orderId: params.id,
            status: updateData.status,
            timestamp: new Date()
        });
        }

        return NextResponse.json(
        { 
            message: "Order updated successfully"
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

        const client = new MongoClient(process.env.MONGODB_URI!);
        await client.connect();
        const db = client.db();

        const order = await db.collection("orders").findOne({ _id: new ObjectId(params.id) });

        if (!order) {
        await client.close();
        return NextResponse.json(
            { message: "Order not found" },
            { status: 404 }
        );
        }

        // Check permissions
        if (session.user.role === "customer" && order.customerId.toString() !== session.user.id) {
        await client.close();
        return NextResponse.json(
            { message: "You can only delete your own orders" },
            { status: 403 }
        );
        }

        const result = await db.collection("orders").deleteOne({ _id: new ObjectId(params.id) });

        await client.close();

        if (result.deletedCount === 0) {
        return NextResponse.json(
            { message: "Order not found" },
            { status: 404 }
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