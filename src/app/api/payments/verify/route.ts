    import { NextRequest, NextResponse } from "next/server";
    import { verifyPayment } from "@/lib/paystack";
    import { MongoClient, ObjectId } from "mongodb";

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
        const client = new MongoClient(process.env.MONGODB_URI!);
        await client.connect();
        const db = client.db();

        // Convert string id to ObjectId
        const objectId = new ObjectId(serviceId);
        
        await db.collection("services").updateOne(
            { _id: objectId, courierId: userId },
            { 
            $set: { 
                premium: true,
                premiumExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
            }
            }
        );

        await client.close();
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