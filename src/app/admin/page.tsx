    "use client";

    import { useSession } from "next-auth/react";
    import { useRouter } from "next/navigation";
    import { useEffect, useState } from "react";
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
    import { Badge } from "@/components/ui/badge";
    import { Button } from "@/components/ui/button";
    import { Users, Package, TrendingUp, DollarSign } from "lucide-react";

    interface AdminStats {
    totalUsers: number;
    totalCouriers: number;
    totalCustomers: number;
    totalServices: number;
    totalOrders: number;
    totalRevenue: number;
    recentOrders: any[];
    topCouriers: any[];
    }

    export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
        router.push("/login");
        } else if (status === "authenticated" && session?.user.role !== "admin") {
        router.push("/");
        } else if (status === "authenticated") {
        fetchStats();
        }
    }, [status, router, session]);

    const fetchStats = async () => {
        setLoading(true);
        try {
        const response = await fetch("/api/admin/stats");
        const data = await response.json();
        setStats(data);
        } catch (error) {
        console.error("Error fetching admin stats:", error);
        } finally {
        setLoading(false);
        }
    };

    if (status === "loading" || loading) {
        return <div className="container mx-auto px-4 py-8">Loading...</div>;
    }

    if (!stats) {
        return <div className="container mx-auto px-4 py-8">Error loading data</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Platform overview and management</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                {stats.totalCouriers} couriers, {stats.totalCustomers} customers
                </p>
            </CardContent>
            </Card>
            
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Services</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stats.totalServices}</div>
                <p className="text-xs text-muted-foreground">
                Active delivery services
                </p>
            </CardContent>
            </Card>
            
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                <p className="text-xs text-muted-foreground">
                All time orders
                </p>
            </CardContent>
            </Card>
            
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">GHS {stats.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                Platform earnings
                </p>
            </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Orders */}
            <Card>
            <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest orders on the platform</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                {stats.recentOrders.map((order) => (
                    <div key={order._id} className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">Order #{order._id.slice(-6)}</p>
                        <p className="text-sm text-muted-foreground">
                        {order.customerName} • GHS {order.price}
                        </p>
                    </div>
                    <Badge variant={
                        order.status === "delivered" ? "default" :
                        order.status === "cancelled" ? "destructive" : "secondary"
                    }>
                        {order.status}
                    </Badge>
                    </div>
                ))}
                </div>
            </CardContent>
            </Card>

            {/* Top Couriers */}
            <Card>
            <CardHeader>
                <CardTitle>Top Couriers</CardTitle>
                <CardDescription>Best performing couriers</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                {stats.topCouriers.map((courier, index) => (
                    <div key={courier._id} className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium mr-3">
                        {index + 1}
                        </div>
                        <div>
                        <p className="font-medium">{courier.name}</p>
                        <p className="text-sm text-muted-foreground">
                            {courier.completedOrders} orders • {courier.rating}★
                        </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-medium">GHS {courier.earnings}</p>
                        <p className="text-sm text-muted-foreground">earned</p>
                    </div>
                    </div>
                ))}
                </div>
            </CardContent>
            </Card>
        </div>
        </div>
    );
    }