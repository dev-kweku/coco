    "use client";

    import { useState, useEffect } from "react";
    import { useParams, useRouter } from "next/navigation";
    import { useSession } from "next-auth/react";
    import { Button } from "@/components/ui/button";
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
    import { Badge } from "@/components/ui/badge";
    import { OrderCard } from "@/components/order/order-card";
    import { Order } from "@/types/order";
    import { MapPin, Clock, Star, MessageSquare, Phone } from "lucide-react";
    import { Textarea } from "@/components/ui/textarea";
    import { Label } from "@/components/ui/label";
    import { Input } from "@/components/ui/input";
import { useSafeNotifications } from "@/hooks/useSafeNotifications";


    export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewData, setReviewData] = useState({
        rating: 5,
        review: "",
    });

    const {markAsRead}=useSafeNotifications()

    useEffect(() => {
        fetchOrder();
    }, [params.id]);

    const fetchOrder = async () => {
        try {
        const response = await fetch(`/api/orders/${params.id}`);
        const data = await response.json();
        setOrder(data);
        } catch (error) {
        console.error("Error fetching order:", error);
        } finally {
        setLoading(false);
        }
    };

    // Fix the function signature to match OrderCard's expectation
    const updateOrderStatus = async (orderId: string, status: Order["status"]) => {
        setUpdating(true);
        try {
        const response = await fetch(`/api/orders/${orderId}`, {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ status }),
        });

        if (response.ok) {
            fetchOrder(); // Refresh order data
        }
        } catch (error) {
        console.error("Error updating order:", error);
        } finally {
        setUpdating(false);
        }
    };

    const submitReview = async () => {
        try {
        const response = await fetch(`/api/orders/${params.id}`, {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            rating: reviewData.rating,
            review: reviewData.review,
            }),
        });

        if (response.ok) {
            setShowReviewForm(false);
            fetchOrder(); // Refresh order data
        }
        } catch (error) {
        console.error("Error submitting review:", error);
        }
    };

    const handleContact = (type: "call" | "message", order: Order) => {
        const contactNumber = session?.user.role === "courier" 
        ? order.customerPhone 
        : order.courierPhone;

        if (type === "call") {
        window.location.href = `tel:+233${contactNumber}`;
        } else {
        const message = `Hello! I'm contacting you regarding order #${order.trackingNumber}.`;
        window.open(`https://wa.me/233${contactNumber}?text=${encodeURIComponent(message)}`, '_blank');
        }
    };

    if (loading) {
        return <div className="container mx-auto px-4 py-8">Loading order...</div>;
    }

    if (!order) {
        return <div className="container mx-auto px-4 py-8">Order not found</div>;
    }

    const isCustomer = session?.user.id === order.customerId;
    const isCourier = session?.user.id === order.courierId;
    const canUpdateStatus = isCourier && order.status !== "delivered" && order.status !== "cancelled";
    const canReview = isCustomer && order.status === "delivered" && !order.rating;

    return (
        <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
            <button
                onClick={() => router.back()}
                className="text-primary hover:underline mb-4"
            >
                ← Back to Orders
            </button>
            <h1 className="text-3xl font-bold">Order Details</h1>
            <p className="text-muted-foreground">Tracking Number: {order.trackingNumber}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Order Information */}
            <div className="lg:col-span-2 space-y-6">
                <OrderCard
                order={order}
                showActions={canUpdateStatus}
                onUpdateStatus={updateOrderStatus}
                onContact={handleContact}
                />

                {/* Route Details */}
                <Card>
                <CardHeader>
                    <CardTitle>Route Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                    <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                        <div>
                        <p className="font-medium">Pickup Location</p>
                        <p className="text-muted-foreground">{order.pickupAddress}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                        <div>
                        <p className="font-medium">Delivery Location</p>
                        <p className="text-muted-foreground">{order.deliveryAddress}</p>
                        </div>
                    </div>
                    </div>
                </CardContent>
                </Card>

                {/* Package Details */}
                <Card>
                <CardHeader>
                    <CardTitle>Package Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Description</p>
                        <p className="font-medium">{order.packageDescription}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Weight</p>
                        <p className="font-medium">{order.weight} kg</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Dimensions</p>
                        <p className="font-medium">
                        {order.dimensions.length} × {order.dimensions.width} × {order.dimensions.height} cm
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Price</p>
                        <p className="font-medium">GHS {order.price}</p>
                    </div>
                    </div>
                    {order.notes && (
                    <div className="mt-4">
                        <p className="text-sm text-muted-foreground">Additional Notes</p>
                        <p className="font-medium">{order.notes}</p>
                    </div>
                    )}
                </CardContent>
                </Card>

                {/* Review Form */}
                {canReview && (
                <Card>
                    <CardHeader>
                    <CardTitle>Rate Your Experience</CardTitle>
                    <CardDescription>
                        How was your delivery service?
                    </CardDescription>
                    </CardHeader>
                    <CardContent>
                    {!showReviewForm ? (
                        <Button onClick={() => setShowReviewForm(true)}>
                        Leave a Review
                        </Button>
                    ) : (
                        <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="rating">Rating</Label>
                            <Input
                            id="rating"
                            type="number"
                            min="1"
                            max="5"
                            value={reviewData.rating}
                            onChange={(e) => setReviewData(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="review">Review (Optional)</Label>
                            <Textarea
                            id="review"
                            value={reviewData.review}
                            onChange={(e) => setReviewData(prev => ({ ...prev, review: e.target.value }))}
                            placeholder="Share your experience..."
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={submitReview}>Submit Review</Button>
                            <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                            Cancel
                            </Button>
                        </div>
                        </div>
                    )}
                    </CardContent>
                </Card>
                )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                {/* Status Timeline */}
                <Card>
                <CardHeader>
                    <CardTitle>Order Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                        order.status === "pending" ? "bg-yellow-500" : "bg-green-500"
                        }`} />
                        <div>
                        <p className="font-medium">Order Placed</p>
                        <p className="text-xs text-muted-foreground">
                            {new Date(order.createdAt).toLocaleString()}
                        </p>
                        </div>
                    </div>
                    
                    {order.status !== "pending" && (
                        <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                            order.status === "accepted" ? "bg-yellow-500" : "bg-green-500"
                        }`} />
                        <div>
                            <p className="font-medium">Accepted</p>
                            <p className="text-xs text-muted-foreground">
                            Courier assigned
                            </p>
                        </div>
                        </div>
                    )}
                    
                    {order.status === "picked_up" && (
                        <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                            order.status === "picked_up" ? "bg-yellow-500" : "bg-green-500"
                        }`} />
                        <div>
                            <p className="font-medium">Picked Up</p>
                            <p className="text-xs text-muted-foreground">
                            Package collected
                            </p>
                        </div>
                        </div>
                    )}
                    
                    {order.status === "in_transit" && (
                        <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                            order.status === "in_transit" ? "bg-yellow-500" : "bg-green-500"
                        }`} />
                        <div>
                            <p className="font-medium">In Transit</p>
                            <p className="text-xs text-muted-foreground">
                            On the way
                            </p>
                        </div>
                        </div>
                    )}
                    
                    {order.status === "delivered" && (
                        <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <div>
                            <p className="font-medium">Delivered</p>
                            <p className="text-xs text-muted-foreground">
                            {order.actualDelivery ? new Date(order.actualDelivery).toLocaleString() : "Completed"}
                            </p>
                        </div>
                        </div>
                    )}
                    
                    {order.status === "cancelled" && (
                        <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div>
                            <p className="font-medium">Cancelled</p>
                            <p className="text-xs text-muted-foreground">
                            Order was cancelled
                            </p>
                        </div>
                        </div>
                    )}
                    </div>
                </CardContent>
                </Card>

                {/* Delivery Information */}
                <Card>
                <CardHeader>
                    <CardTitle>Delivery Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                        <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                        <p className="font-medium">
                        {new Date(order.estimatedDelivery).toLocaleString()}
                        </p>
                    </div>
                    </div>
                    
                    {order.actualDelivery && (
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                        <p className="text-sm text-muted-foreground">Actual Delivery</p>
                        <p className="font-medium">
                            {new Date(order.actualDelivery).toLocaleString()}
                        </p>
                        </div>
                    </div>
                    )}

                    {order.courierName && (
                    <div className="pt-3 border-t">
                        <p className="text-sm text-muted-foreground mb-2">Assigned Courier</p>
                        <p className="font-medium">{order.courierName}</p>
                        <div className="flex gap-2 mt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleContact("call", order)}
                        >
                            <Phone className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleContact("message", order)}
                        >
                            <MessageSquare className="h-4 w-4" />
                        </Button>
                        </div>
                    </div>
                    )}
                </CardContent>
                </Card>

                {/* Payment Status */}
                <Card>
                <CardHeader>
                    <CardTitle>Payment Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Payment Status</span>
                    <Badge variant={order.paymentStatus === "paid" ? "default" : "secondary"}>
                        {order.paymentStatus === "paid" ? "Paid" : "Pending"}
                    </Badge>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                    <span className="text-muted-foreground">Total Amount</span>
                    <span className="font-bold">GHS {order.price}</span>
                    </div>
                </CardContent>
                </Card>
            </div>
            </div>
        </div>
        </div>
    );
    }