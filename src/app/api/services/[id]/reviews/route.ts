    import { NextRequest, NextResponse } from "next/server";
    import Service from "@/models/Service";
    import { getServerSession } from "next-auth";
    import { authOptions } from "@/lib/auth.config";

    export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
        }

        const { rating, comment } = await request.json();

        if (!rating || rating < 1 || rating > 5) {
        return NextResponse.json(
            { message: "Invalid rating" },
            { status: 400 }
        );
        }

        const service = await Service.findById(params.id);

        if (!service) {
        return NextResponse.json(
            { message: "Service not found" },
            { status: 404 }
        );
        }

        // Add the review
        const review = {
        customerId: session.user.id,
        customerName: session.user.name,
        rating,
        comment,
        createdAt: new Date(),
        };

        service.reviews.push(review);

        // Calculate new average rating
        const totalRating = service.reviews.reduce((sum, review) => sum + review.rating, 0);
        service.rating = totalRating / service.reviews.length;

        await service.save();

        return NextResponse.json(
        { 
            message: "Review added successfully",
            rating: service.rating
        },
        { status: 201 }
        );
    } catch (error) {
        console.error("Error adding review:", error);
        return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
        );
    }
    }

    export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const service = await Service.findById(params.id).select('reviews').lean();

        if (!service) {
        return NextResponse.json(
            { message: "Service not found" },
            { status: 404 }
        );
        }

        return NextResponse.json(service.reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
        );
    }
    }