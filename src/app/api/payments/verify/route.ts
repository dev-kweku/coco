    import { NextRequest, NextResponse } from "next/server";
    import { verifyPayment } from "@/lib/paystack";
    import Service from "@/models/Service";

    export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const reference = searchParams.get('reference');

        if (!reference) {
        return NextResponse.json(
            { message: "Reference is required" },
            { status: 400 }
        );
        }

        const response = await verifyPayment(reference);
        
        if (response.data.status === "success") {
        const { serviceId, userId } = response.data.metadata;
        
        // Update service to premium
        const service = await Service.findByIdAndUpdate(
            serviceId,
            { 
            premium: true,
            premiumExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
            },
            { new: true }
        );

        if (!service) {
            return NextResponse.json(
            { message: "Service not found" },
            { status: 404 }
            );
        }

        // Convert to JSON to trigger the toJSON method
        const serviceJson = service.toJSON();
        }

        return NextResponse.json(response.data);
    } catch (error) {
        console.error("Payment verification error:", error);
        return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
        );
    }
    }