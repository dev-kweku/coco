    import { NextRequest, NextResponse } from "next/server";
    import { MongoClient } from "mongodb";
    import { getServerSession } from "next-auth";
    import { authOptions } from "@/lib/auth.config";

    export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session || session.user.role !== "admin") {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
        }

        const client = new MongoClient(process.env.MONGODB_URI!);
        await client.connect();
        const db = client.db();

        // Get user stats
        const totalUsers = await db.collection("users").countDocuments();
        const totalCouriers = await db.collection("users").countDocuments({ role: "courier" });
        const totalCustomers = await db.collection("users").countDocuments({ role: "customer" });

        // Get service stats
        const totalServices = await db.collection("services").countDocuments();

        // Get order stats
        const totalOrders = await db.collection("orders").countDocuments();
        const orders = await db.collection("orders").find({}).toArray();
        const totalRevenue = orders.reduce((sum, order) => sum + order.price, 0);

        // Get recent orders
        const recentOrders = await db.collection("orders")
        .find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray();

        // Get top couriers
        const courierStats = await db.collection("orders").aggregate([
        {
            $group: {
            _id: "$courierId",
            completedOrders: { $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] } },
            totalEarnings: { $sum: "$price" },
            averageRating: { $avg: "$rating" }
            }
        },
        { $sort: { completedOrders: -1 } },
        { $limit: 5 }
        ]).toArray();

        const topCouriers = await Promise.all(
        courierStats.map(async (stat) => {
            const courier = await db.collection("users").findOne({ _id: stat._id });
            return {
            _id: stat._id,
            name: courier?.name || "Unknown",
            completedOrders: stat.completedOrders,
            earnings: stat.totalEarnings,
            rating: stat.averageRating?.toFixed(1) || "0.0"
            };
        })
        );

        await client.close();

        return NextResponse.json({
        totalUsers,
        totalCouriers,
        totalCustomers,
        totalServices,
        totalOrders,
        totalRevenue,
        recentOrders: recentOrders.map(order => ({
            ...order,
            _id: order._id.toString(),
            courierId: order.courierId.toString(),
            customerId: order.customerId.toString(),
        })),
        topCouriers: topCouriers.map(courier => ({
            ...courier,
            _id: courier._id.toString(),
        }))
        });
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
        );
    }
    }