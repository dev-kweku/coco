    export interface Order {
        _id: string;
        customerId: string;
        customerName: string;
        customerPhone: string;
        customerAddress: string;
        serviceId: string;
        courierId?: string;
        courierName?: string;
        courierPhone?: string;
        pickupAddress: string;
        deliveryAddress: string;
        packageDescription: string;
        weight: number;
        dimensions: {
        length: number;
        width: number;
        height: number;
        };
        price: number;
        status: "pending" | "accepted" | "picked_up" | "in_transit" | "delivered" | "cancelled";
        paymentStatus: "pending" | "paid" | "refunded";
        estimatedDelivery: Date;
        actualDelivery?: Date;
        trackingNumber: string;
        notes?: string;
        rating?: number;
        review?: string;
        createdAt: Date;
        updatedAt: Date;
    }
    
    export interface CreateOrderRequest {
        serviceId: string;
        pickupAddress: string;
        deliveryAddress: string;
        packageDescription: string;
        weight: number;
        dimensions: {
        length: number;
        width: number;
        height: number;
        };
        notes?: string;
    }
    
    export interface UpdateOrderStatus {
        status: Order["status"];
        notes?: string;
    }
    
    export interface OrderFilters {
        status?: Order["status"];
        customerId?: string;
        courierId?: string;
        dateRange?: {
        start: Date;
        end: Date;
        };
    }
    
    export interface TrackingUpdate {
        status: Order["status"];
        location?: string;
        notes?: string;
        timestamp: Date;
    }