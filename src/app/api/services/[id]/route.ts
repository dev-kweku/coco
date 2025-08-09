    import { NextRequest, NextResponse } from "next/server";
    import { MongoClient, ObjectId } from "mongodb";

    export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const client = new MongoClient(process.env.MONGODB_URI!);
        await client.connect();
        const db = client.db();

        // Convert string id to ObjectId
        const objectId = new ObjectId(params.id);
        
        const service = await db.collection("services").findOne({ _id: objectId });

        await client.close();

        if (!service) {
        return NextResponse.json(
            { message: "Service not found" },
            { status: 404 }
        );
        }

        return NextResponse.json(service);
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
        const client = new MongoClient(process.env.MONGODB_URI!);
        await client.connect();
        const db = client.db();

        // Convert string id to ObjectId
        const objectId = new ObjectId(params.id);
        
        const result = await db.collection("services").updateOne(
        { _id: objectId },
        { $set: { ...serviceData, updatedAt: new Date() } }
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

        // Convert string id to ObjectId
        const objectId = new ObjectId(params.id);
        
        const result = await db.collection("services").deleteOne({ _id: objectId });

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