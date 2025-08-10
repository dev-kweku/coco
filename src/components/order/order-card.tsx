    "use client";

    import { useState } from "react";
    import { Button } from "@/components/ui/button";
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
    import { Badge } from "@/components/ui/badge";
    import { 
    Package, 
    MapPin, 
    Clock, 
    DollarSign, 
    Phone,
    MessageSquare,
    Star,
    MoreVertical
    } from "lucide-react";
    import { Order } from "@/types/order";
    import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    } from "@/components/ui/dropdown-menu";
    import Link from "next/link";

    interface OrderCardProps {
    order: Order;
    showActions?: boolean;
    onUpdateStatus?: (orderId: string, status: Order["status"]) => void;
    onContact?: (type: "call" | "message") => void;
    }

    export function OrderCard({ order, showActions = false, onUpdateStatus, onContact }: OrderCardProps) {
    const [loading, setLoading] = useState(false);

    const statusColors = {
        pending: "secondary",
        accepted: "default",
        picked_up: "default",
        in_transit: "default",
        delivered: "default",
        cancelled: "destructive",
    } as const;

    const statusLabels = {
        pending: "Pending",
        accepted: "Accepted",
        picked_up: "Picked Up",
        in_transit: "In Transit",
        delivered: "Delivered",
        cancelled: "Cancelled",
    };

    const handleUpdateStatus = async (status: Order["status"]) => {
        if (!onUpdateStatus) return;
        
        setLoading(true);
        try {
        await onUpdateStatus(order._id, status);
        } finally {
        setLoading(false);
        }
    };

    const formatAddress = (address: string) => {
        return address.length > 40 ? address.substring(0, 40) + "..." : address;
    };

    return (
        <Card className="overflow-hidden">
        <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
            <div>
                <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order #{order.trackingNumber}
                </CardTitle>
                <CardDescription>
                {new Date(order.createdAt).toLocaleDateString()} • {new Date(order.createdAt).toLocaleTimeString()}
                </CardDescription>
            </div>
            <Badge variant={statusColors[order.status]}>
                {statusLabels[order.status]}
            </Badge>
            </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
            {/* Route Information */}
            <div className="space-y-2">
            <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Pickup</p>
                <p className="text-sm text-muted-foreground truncate">
                    {formatAddress(order.pickupAddress)}
                </p>
                </div>
            </div>
            <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Delivery</p>
                <p className="text-sm text-muted-foreground truncate">
                    {formatAddress(order.deliveryAddress)}
                </p>
                </div>
            </div>
            </div>

            {/* Package Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
                <p className="text-muted-foreground">Package</p>
                <p className="font-medium truncate">{order.packageDescription}</p>
            </div>
            <div>
                <p className="text-muted-foreground">Weight</p>
                <p className="font-medium">{order.weight} kg</p>
            </div>
            </div>

            {/* Price and Delivery Time */}
            <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">GHS {order.price}</span>
                </div>
                <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                    {new Date(order.estimatedDelivery).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                </div>
            </div>

            {showActions && (
                <div className="flex gap-2">
                {onContact && (
                    <>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onContact("call")}
                    >
                        <Phone className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onContact("message")}
                    >
                        <MessageSquare className="h-4 w-4" />
                    </Button>
                    </>
                )}
                
                {onUpdateStatus && (
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                        <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {order.status === "pending" && (
                        <DropdownMenuItem onClick={() => handleUpdateStatus("accepted")}>
                            Accept Order
                        </DropdownMenuItem>
                        )}
                        {order.status === "accepted" && (
                        <DropdownMenuItem onClick={() => handleUpdateStatus("picked_up")}>
                            Mark as Picked Up
                        </DropdownMenuItem>
                        )}
                        {order.status === "picked_up" && (
                        <DropdownMenuItem onClick={() => handleUpdateStatus("in_transit")}>
                            Mark as In Transit
                        </DropdownMenuItem>
                        )}
                        {order.status === "in_transit" && (
                        <DropdownMenuItem onClick={() => handleUpdateStatus("delivered")}>
                            Mark as Delivered
                        </DropdownMenuItem>
                        )}
                        {(order.status === "pending" || order.status === "accepted") && (
                        <DropdownMenuItem onClick={() => handleUpdateStatus("cancelled")}>
                            Cancel Order
                        </DropdownMenuItem>
                        )}
                        <DropdownMenuItem asChild>
                        <Link href={`/orders/${order._id}`}>View Details</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                )}
                </div>
            )}
            </div>

            {/* Rating and Review (for delivered orders) */}
            {order.status === "delivered" && order.rating && (
            <div className="pt-2 border-t">
                <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{order.rating}/5</span>
                {order.review && (
                    <p className="text-sm text-muted-foreground truncate">"{order.review}"</p>
                )}
                </div>
            </div>
            )}
        </CardContent>
        </Card>
    );
    }