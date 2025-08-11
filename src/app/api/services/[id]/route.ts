    import { NextRequest, NextResponse } from "next/server";
    import { MongoClient, ObjectId } from "mongodb";
    import Service from "@/models/Service";

    export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const client = new MongoClient(process.env.MONGODB_URI!);
        await client.connect();
        const db = client.db();

        const service = await db.collection("services").findOne({ _id: new ObjectId(params.id) });

        await client.close();

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
        courierId: service.courierId?.toString(),
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
        
        const client = new MongoClient(process.env.MONGODB_URI!);
        await client.connect();
        const db = client.db();

        const updateData = await request.json();
        
        const result = await db.collection("services").updateOne(
        { _id: new ObjectId(params.id) },
        { $set: { ...updateData, updatedAt: new Date() } }
        );

        await client.close();

        if (result.matchedCount === 0) {
        return NextResponse.json(
            { message: "Service not found" },
            { status: 404 }
        );
        }

        return NextResponse.json(
        { message: "Service updated successfully" }
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
        const client = new MongoClient(process.env.MONGODB_URI!);
        await client.connect();
        const db = client.db();

        const result = await db.collection("services").deleteOne({ _id: new ObjectId(params.id) });

        await client.close();

        if (result.deletedCount === 0) {
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