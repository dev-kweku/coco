    import { NextRequest, NextResponse } from "next/server";
    import { initializePayment } from "@/lib/paystack";
    import { getServerSession } from "next-auth";
    import { authOptions } from "@/lib/auth.config";

    export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session || session.user.role !== "courier") {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
        }

        const { serviceId } = await request.json();

        const response = await initializePayment(
        session.user.email!,
        10, // GHS 10
        { serviceId, userId: session.user.id }
        );

        return NextResponse.json(response.data);
    } catch (error) {
        console.error("Payment initialization error:", error);
        return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
        );
    }
    }