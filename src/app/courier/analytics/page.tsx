    "use client";

    import { useSession } from "next-auth/react";
    import { useRouter } from "next/navigation";
    import { useEffect, useState } from "react";
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
    import { Badge } from "@/components/ui/badge";
    import { Button } from "@/components/ui/button";
    import { 
    TrendingUp, 
    Package, 
    DollarSign, 
    Star, 
    Calendar,
    MapPin
    } from "lucide-react";

    interface CourierAnalytics {
    totalOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    totalEarnings: number;
    averageRating: number;
    popularAreas: { area: string; count: number }[];
    monthlyStats: { month: string; orders: number; earnings: number }[];
    recentOrders: any[];
    }

    export default function CourierAnalytics() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [analytics, setAnalytics] = useState<CourierAnalytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState("30d");

    useEffect(() => {
        if (status === "unauthenticated") {
        router.push("/login");
        } else if (status === "authenticated" && session?.user.role !== "courier") {
        router.push("/");
        } else if (status === "authenticated") {
        fetchAnalytics();
        }
    }, [status, router, session, timeRange]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
        const response = await fetch(`/api/courier/analytics?range=${timeRange}`);
        const data = await response.json();
        setAnalytics(data);
        } catch (error) {
        console.error("Error fetching analytics:", error);
        } finally {
        setLoading(false);
        }
    };

    if (status === "loading" || loading) {
        return <div className="container mx-auto px-4 py-8">Loading...</div>;
    }

    if (!analytics) {
        return <div className="container mx-auto px-4 py-8">Error loading data</div>;
    }

    const completionRate = analytics.totalOrders > 0 
        ? ((analytics.completedOrders / analytics.totalOrders) * 100).toFixed(1)
        : 0;

    return (
        <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
            <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Track your performance and earnings</p>
            </div>
            <div className="flex gap-2">
            {["7d", "30d", "90d", "1y"].map((range) => (
                <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(range)}
                >
                {range}
                </Button>
            ))}
            </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{analytics.totalOrders}</div>
                <p className="text-xs text-muted-foreground">
                {completionRate}% completion rate
                </p>
            </CardContent>
            </Card>
            
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{analytics.completedOrders}</div>
                <p className="text-xs text-muted-foreground">
                {analytics.cancelledOrders} cancelled
                </p>
            </CardContent>
            </Card>
            
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">GHS {analytics.totalEarnings.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                From completed orders
                </p>
            </CardContent>
            </Card>
            
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{analytics.averageRating.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">
                Out of 5 stars
                </p>
            </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Popular Areas */}
            <Card>
            <CardHeader>
                <CardTitle>Popular Service Areas</CardTitle>
                <CardDescription>Where you get the most orders</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                {analytics.popularAreas.map((area, index) => (
                    <div key={area.area} className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium mr-3">
                        {index + 1}
                        </div>
                        <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">{area.area}</span>
                        </div>
                    </div>
                    <Badge variant="secondary">
                        {area.count} orders
                    </Badge>
                    </div>
                ))}
                </div>
            </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
            <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Your latest delivery requests</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                {analytics.recentOrders.map((order) => (
                    <div key={order._id} className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">Order #{order._id.slice(-6)}</p>
                        <p className="text-sm text-muted-foreground">
                        <Calendar className="inline h-3 w-3 mr-1" />
                        {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="font-medium">GHS {order.price}</p>
                        <Badge variant={
                        order.status === "delivered" ? "default" :
                        order.status === "cancelled" ? "destructive" : "secondary"
                        }>
                        {order.status}
                        </Badge>
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