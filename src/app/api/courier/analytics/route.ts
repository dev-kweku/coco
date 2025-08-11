    import { NextRequest, NextResponse } from "next/server";
    import { MongoClient, ObjectId } from "mongodb";
    import { getServerSession } from "next-auth";
    import { authOptions } from "@/lib/auth.config";

    export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session || session.user.role !== "courier") {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
        }

        const { searchParams } = new URL(request.url);
        const range = searchParams.get("range") || "30d";
        
        const client = new MongoClient(process.env.MONGODB_URI!);
        await client.connect();
        const db = client.db();

        // Calculate date range
        const now = new Date();
        const days = parseInt(range.replace("d", "")) || 30;
        const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

        // Get courier's services
        const services = await db.collection("services")
        .find({ courierId: new ObjectId(session.user.id) })
        .toArray();

        const serviceIds = services.map(s => s._id);

        // Get orders for these services
        const orders = await db.collection("orders")
        .find({ 
            serviceId: { $in: serviceIds },
            createdAt: { $gte: startDate }
        })
        .toArray();

        // Calculate stats
        const totalOrders = orders.length;
        const completedOrders = orders.filter(o => o.status === "delivered").length;
        const cancelledOrders = orders.filter(o => o.status === "cancelled").length;
        const totalEarnings = orders
        .filter(o => o.status === "delivered")
        .reduce((sum, order) => sum + order.price, 0);

        // Get average rating from services
        const totalRating = services.reduce((sum, service) => sum + service.rating, 0);
        const averageRating = services.length > 0 ? totalRating / services.length : 0;

        // Get popular areas
        const areaCounts: { [key: string]: number } = {};
        services.forEach(service => {
        service.areas.forEach((area: string) => {
            areaCounts[area] = (areaCounts[area] || 0) + 1;
        });
        });

        const popularAreas = Object.entries(areaCounts)
        .map(([area, count]) => ({ area, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

        // Get monthly stats
        const monthlyStats = [];
        for (let i = 0; i < Math.min(days / 30, 12); i++) {
        const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
        
        const monthOrders = orders.filter(o => 
            o.createdAt >= monthStart && o.createdAt <= monthEnd
        );
        
        monthlyStats.unshift({
            month: monthStart.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
            orders: monthOrders.length,
            earnings: monthOrders
            .filter(o => o.status === "delivered")
            .reduce((sum, order) => sum + order.price, 0)
        });
        }

        // Get recent orders
        const recentOrders = await db.collection("orders")
        .find({ serviceId: { $in: serviceIds } })
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray();

        await client.close();

        return NextResponse.json({
        totalOrders,
        completedOrders,
        cancelledOrders,
        totalEarnings,
        averageRating,
        popularAreas,
        monthlyStats,
        recentOrders: recentOrders.map(order => ({
            ...order,
            _id: order._id.toString(),
            serviceId: order.serviceId.toString(),
            customerId: order.customerId.toString(),
        }))
        });
    } catch (error) {
        console.error("Error fetching courier analytics:", error);
        return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
        );
    }
    }