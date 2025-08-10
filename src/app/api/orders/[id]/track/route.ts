    import { NextRequest, NextResponse } from "next/server";
    import Order from "@/models/Order";

    export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const order = await Order.findOne({ trackingNumber: params.id }).lean();

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