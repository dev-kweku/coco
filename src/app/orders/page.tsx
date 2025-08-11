    "use client";

    import { useState, useEffect } from "react";
    import { useSession } from "next-auth/react";
    import { useRouter } from "next/navigation";
    import { Button } from "@/components/ui/button";
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
    import { OrderCard } from "@/components/order/order-card";
    import { Order } from "@/types/order";
    import { Plus, Package } from "lucide-react";
    import Link from "next/link";

    export default function OrdersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
        router.push("/login");
        } else if (status === "authenticated") {
        fetchOrders();
        }
    }, [status, router]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
        const response = await fetch(`/api/orders?customerId=${session?.user.id}`);
        const data = await response.json();
        setOrders(data);
        } catch (error) {
        console.error("Error fetching orders:", error);
        } finally {
        setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId: string, status: Order["status"]) => {
        try {
        const response = await fetch(`/api/orders/${orderId}`, {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ status }),
        });

        if (response.ok) {
            fetchOrders(); // Refresh orders
        }
        } catch (error) {
        console.error("Error updating order:", error);
        }
    };

    if (status === "loading" || loading) {
        return <div className="container mx-auto px-4 py-8">Loading orders...</div>;
    }

    const pendingOrders = orders.filter(o => o.status === "pending");
    const activeOrders = orders.filter(o => ["accepted", "picked_up", "in_transit"].includes(o.status));
    const completedOrders = orders.filter(o => o.status === "delivered");
    const cancelledOrders = orders.filter(o => o.status === "cancelled");

    return (
        <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
            <div>
            <h1 className="text-3xl font-bold">My Orders</h1>
            <p className="text-muted-foreground">Manage your delivery requests</p>
            </div>
            <Button asChild>
            <Link href="/services">
                <Plus className="mr-2 h-4 w-4" />
                New Order
            </Link>
            </Button>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">
                All ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
                Pending ({pendingOrders.length})
            </TabsTrigger>
            <TabsTrigger value="active">
                Active ({activeOrders.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
                Completed ({completedOrders.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
                Cancelled ({cancelledOrders.length})
            </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
            {orders.length === 0 ? (
                <Card>
                <CardContent className="pt-6">
                    <div className="text-center">
                    <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                    <p className="text-muted-foreground mb-4">
                        You haven't placed any delivery orders yet.
                    </p>
                    <Button asChild>
                        <Link href="/services">Place Your First Order</Link>
                    </Button>
                    </div>
                </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                {orders.map((order) => (
                    <OrderCard
                    key={order._id}
                    order={order}
                    onUpdateStatus={updateOrderStatus}
                    />
                ))}
                </div>
            )}
            </TabsContent>

            <TabsContent value="pending">
            <div className="grid grid-cols-1 gap-6">
                {pendingOrders.map((order) => (
                <OrderCard
                    key={order._id}
                    order={order}
                    onUpdateStatus={updateOrderStatus}
                />
                ))}
                {pendingOrders.length === 0 && (
                <Card>
                    <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">No pending orders</p>
                    </CardContent>
                </Card>
                )}
            </div>
            </TabsContent>

            <TabsContent value="active">
            <div className="grid grid-cols-1 gap-6">
                {activeOrders.map((order) => (
                <OrderCard
                    key={order._id}
                    order={order}
                    onUpdateStatus={updateOrderStatus}
                />
                ))}
                {activeOrders.length === 0 && (
                <Card>
                    <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">No active orders</p>
                    </CardContent>
                </Card>
                )}
            </div>
            </TabsContent>

            <TabsContent value="completed">
            <div className="grid grid-cols-1 gap-6">
                {completedOrders.map((order) => (
                <OrderCard
                    key={order._id}
                    order={order}
                />
                ))}
                {completedOrders.length === 0 && (
                <Card>
                    <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">No completed orders</p>
                    </CardContent>
                </Card>
                )}
            </div>
            </TabsContent>

            <TabsContent value="cancelled">
            <div className="grid grid-cols-1 gap-6">
                {cancelledOrders.map((order) => (
                <OrderCard
                    key={order._id}
                    order={order}
                />
                ))}
                {cancelledOrders.length === 0 && (
                <Card>
                    <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">No cancelled orders</p>
                    </CardContent>
                </Card>
                )}
            </div>
            </TabsContent>
        </Tabs>
        </div>
    );
    }