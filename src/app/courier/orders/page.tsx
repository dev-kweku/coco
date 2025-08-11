    "use client";

    import { useState, useEffect } from "react";
    import { useSession } from "next-auth/react";
    import { useRouter } from "next/navigation";
    import { Button } from "@/components/ui/button";
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
    import { OrderCard } from "@/components/order/order-card";
    import { Order } from "@/types/order";
    import { Package } from "lucide-react";

    export default function CourierOrdersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
        router.push("/login");
        } else if (status === "authenticated" && session?.user.role !== "courier") {
        router.push("/");
        } else if (status === "authenticated") {
        fetchOrders();
        }
    }, [status, router, session]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
        const response = await fetch(`/api/orders?courierId=${session?.user.id}`);
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

    const handleContact = (type: "call" | "message") => {
        // This will be implemented based on the specific order
        console.log("Contact:", type);
    };

    if (status === "loading" || loading) {
        return <div className="container mx-auto px-4 py-8">Loading orders...</div>;
    }

    const availableOrders = orders.filter(o => o.status === "pending");
    const activeOrders = orders.filter(o => ["accepted", "picked_up", "in_transit"].includes(o.status));
    const completedOrders = orders.filter(o => o.status === "delivered");

    return (
        <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
            <h1 className="text-3xl font-bold">Manage Orders</h1>
            <p className="text-muted-foreground">View and manage delivery requests</p>
        </div>

        <Tabs defaultValue="available" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="available">
                Available ({availableOrders.length})
            </TabsTrigger>
            <TabsTrigger value="active">
                Active ({activeOrders.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
                Completed ({completedOrders.length})
            </TabsTrigger>
            <TabsTrigger value="all">
                All ({orders.length})
            </TabsTrigger>
            </TabsList>

            <TabsContent value="available">
            {availableOrders.length === 0 ? (
                <Card>
                <CardContent className="pt-6">
                    <div className="text-center">
                    <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No available orders</h3>
                    <p className="text-muted-foreground">
                        Check back later for new delivery requests.
                    </p>
                    </div>
                </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                {availableOrders.map((order) => (
                    <OrderCard
                    key={order._id}
                    order={order}
                    showActions={true}
                    onUpdateStatus={updateOrderStatus}
                    onContact={handleContact}
                    />
                ))}
                </div>
            )}
            </TabsContent>

            <TabsContent value="active">
            <div className="grid grid-cols-1 gap-6">
                {activeOrders.map((order) => (
                <OrderCard
                    key={order._id}
                    order={order}
                    showActions={true}
                    onUpdateStatus={updateOrderStatus}
                    onContact={handleContact}
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

            <TabsContent value="all">
            {orders.length === 0 ? (
                <Card>
                <CardContent className="pt-6">
                    <div className="text-center">
                    <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                    <p className="text-muted-foreground">
                        You haven't received any delivery requests yet.
                    </p>
                    </div>
                </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                {orders.map((order) => (
                    <OrderCard
                    key={order._id}
                    order={order}
                    showActions={order.status !== "delivered" && order.status !== "cancelled"}
                    onUpdateStatus={updateOrderStatus}
                    onContact={handleContact}
                    />
                ))}
                </div>
            )}
            </TabsContent>
        </Tabs>
        </div>
    );
    }