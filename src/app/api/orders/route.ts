    import { NextRequest, NextResponse } from "next/server";
    import Order from "@/models/Order";
    import Service from "@/models/Service";
    import { getServerSession } from "next-auth";
    import { authOptions } from "@/lib/auth.config";
    import { emitNewOrder } from "@/lib/socket-emitter";
    import { ObjectId } from "mongodb";
    import { withSocket } from "@/lib/with-socket";

    const handler = withSocket(async (request: NextRequest) => {
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
        customerId: new ObjectId(session.user.id),
        customerName: session.user.name,
        customerPhone: session.user.phone,
        customerAddress: session.user.location,
        serviceId: new ObjectId(orderData.serviceId),
        price,
        estimatedDelivery,
        });

        await order.save();

        // Convert to JSON to trigger the toJSON method
        const orderJson = order.toJSON();

        // Emit socket event to courier if service has a courier
        if (service.courierId) {
        emitNewOrder(service.courierId.toString(), {
            orderId: orderJson._id,
            customerName: orderJson.customerName,
            price: orderJson.price,
            timestamp: new Date()
        });
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
    });

    export { handler as POST };