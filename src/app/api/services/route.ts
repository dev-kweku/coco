    import { NextRequest, NextResponse } from "next/server";
    import Service from "@/models/Service";

    export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const location = searchParams.get('location');
        const vehicleType = searchParams.get('vehicleType');
        const premiumOnly = searchParams.get('premiumOnly') === 'true';

        const query: any = {};
        if (location) query.areas = { $in: [location] };
        if (vehicleType) query.vehicleType = vehicleType;
        if (premiumOnly) query.premium = true;

        const services = await Service.find(query)
        .sort({ premium: -1, rating: -1 })
        .lean();

        // Always return an array
        return NextResponse.json(services || []);
    } catch (error) {
        console.error("Error fetching services:", error);
        // Return empty array on error
        return NextResponse.json([]);
    }
    }

    export async function POST(request: NextRequest) {
    try {
        const serviceData = await request.json();
        const service = new Service(serviceData);
        await service.save();

        return NextResponse.json(
        { 
            message: "Service created successfully",
            serviceId: service._id 
        },
        { status: 201 }
        );
    } catch (error) {
        console.error("Error creating service:", error);
        return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
        );
    }
    }