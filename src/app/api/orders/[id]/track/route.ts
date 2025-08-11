    import { NextRequest, NextResponse } from "next/server";
    import { MongoClient, ObjectId } from "mongodb";

    export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const client = new MongoClient(process.env.MONGODB_URI!);
        await client.connect();
        const db = client.db();

        const order = await db.collection("orders").findOne({ trackingNumber: params.id });

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
        console.error("Error tracking order:", error);
        return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
        );
    }
    }