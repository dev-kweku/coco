    import { NextRequest, NextResponse } from "next/server";
    import Service from "@/models/Service";

    export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const service = await Service.findById(params.id).lean();

        if (!service) {
        return NextResponse.json(
            { message: "Service not found" },
            { status: 404 }
        );
        }

        // Convert ObjectId fields to strings
        const serviceWithStringId = {
        ...service,
        _id: service._id.toString(),
        courierId: service.courierId.toString(),
        };

        return NextResponse.json(serviceWithStringId);
    } catch (error) {
        console.error("Error fetching service:", error);
        return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
        );
    }
    }

    export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const serviceData = await request.json();
        const service = await Service.findByIdAndUpdate(
        params.id,
        { ...serviceData, updatedAt: new Date() },
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

        return NextResponse.json(
        { 
            message: "Service updated successfully",
            service: serviceJson
        }
        );
    } catch (error) {
        console.error("Error updating service:", error);
        return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
        );
    }
    }

    export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const service = await Service.findByIdAndDelete(params.id);

        if (!service) {
        return NextResponse.json(
            { message: "Service not found" },
            { status: 404 }
        );
        }

        return NextResponse.json(
        { message: "Service deleted successfully" }
        );
    } catch (error) {
        console.error("Error deleting service:", error);
        return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
        );
    }
    }