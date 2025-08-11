    "use client";

    import { useState } from "react";
    import { useRouter } from "next/navigation";
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
    import { OrderCard } from "@/components/order/order-card";
    import { Order } from "@/types/order";
    import { Search } from "lucide-react";

    export default function TrackOrderPage() {
    const [trackingNumber, setTrackingNumber] = useState("");
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
        const response = await fetch(`/api/orders/${trackingNumber}/track`);
        
        if (response.ok) {
            const data = await response.json();
            setOrder(data);
        } else {
            setError("Order not found. Please check the tracking number.");
        }
        } catch (error) {
        setError("An error occurred while tracking your order.");
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Track Your Order</h1>
            <p className="text-muted-foreground">
                Enter your tracking number to check the status of your delivery
            </p>
            </div>

            <Card className="mb-8">
            <CardHeader>
                <CardTitle>Enter Tracking Number</CardTitle>
                <CardDescription>
                You can find the tracking number in your order confirmation email
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleTrack} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="trackingNumber">Tracking Number</Label>
                    <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="trackingNumber"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="e.g., CGH123456789"
                        className="pl-10"
                        required
                    />
                    </div>
                </div>
                {error && (
                    <div className="text-destructive text-sm">{error}</div>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Tracking..." : "Track Order"}
                </Button>
                </form>
            </CardContent>
            </Card>

            {order && (
            <div>
                <h2 className="text-xl font-semibold mb-4">Order Details</h2>
                <OrderCard order={order} />
                <div className="mt-4 text-center">
                <Button
                    variant="outline"
                    onClick={() => router.push(`/orders/${order._id}`)}
                >
                    View Full Details
                </Button>
                </div>
            </div>
            )}
        </div>
        </div>
    );
    }