    import { NextRequest, NextResponse } from "next/server";
    import Order from "@/models/Order";
    import Service from "@/models/Service";
    import { getServerSession } from "next-auth";
    import { authOptions } from "@/lib/auth.config";

    export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const customerId = searchParams.get("customerId");
        const courierId = searchParams.get("courierId");

        const query: any = {};
        if (status) query.status = status;
        if (customerId) query.customerId = customerId;
        if (courierId) query.courierId = courierId;

        const orders = await Order.find(query)
        .sort({ createdAt: -1 })
        .lean();

        // Convert ObjectId fields to strings
        const ordersWithStringIds = orders.map(order => ({
        ...order,
        _id: order._id.toString(),
        customerId: order.customerId.toString(),
        serviceId: order.serviceId.toString(),
        courierId: order.courierId?.toString(),
        }));

        return NextResponse.json(ordersWithStringIds);
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
        );
    }
    }

    export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
        }

        const orderData = await request.json();
        
        // Get service details
        const service = await Service.findById(orderData.serviceId);
        if (!service) {
        return NextResponse.json(
            { message: "Service not found" },
            { status: 404 }
        );
        }

        // Calculate price based on distance and weight (simplified)
        const basePrice = service.priceRange.min;
        const weightSurcharge = Math.max(0, orderData.weight - 1) * 2; // GHS 2 per extra kg
        const price = basePrice + weightSurcharge;

        // Calculate estimated delivery (2 hours from now for demonstration)
        const estimatedDelivery = new Date(Date.now() + 2 * 60 * 60 * 1000);

        const order = new Order({
        ...orderData,
        customerId: session.user.id,
        customerName: session.user.name,
        customerPhone: session.user.phone,
        customerAddress: session.user.location,
        price,
        estimatedDelivery,
        });

        await order.save();

        // Convert to JSON to trigger the toJSON method
        const orderJson = order.toJSON();

        // Emit socket event to courier if service has a courier
        if (service.courierId) {
        // We'll implement socket emission later
        }

        return NextResponse.json(
        { 
            message: "Order created successfully",
            order: orderJson
        },
        { status: 201 }
        );
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
        );
    }
    }