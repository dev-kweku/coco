    export interface Service {
        _id: string;
        title: string;
        description: string;
        vehicleType: "motorbike" | "bicycle" | "van";
        areas: string[];
        priceRange: {
        min: number;
        max: number;
        };
        availability: boolean;
        premium: boolean;
        premiumExpiry?: Date;
        rating: number;
        reviews: Review[];
        courierId: string;
        courierName: string;
        courierPhone: string;
        createdAt: Date;
        updatedAt: Date;
    }
    
    export interface Review {
        _id: string;
        customerId: string;
        customerName: string;
        rating: number;
        comment: string;
        createdAt: Date;
    }
    
    export interface CreateServiceRequest {
        title: string;
        description: string;
        vehicleType: "motorbike" | "bicycle" | "van";
        areas: string[];
        priceRange: {
        min: number;
        max: number;
        };
        availability: boolean;
        courierId: string;
        courierName: string;
        courierPhone: string;
    }
    
    export interface UpdateServiceRequest {
        title?: string;
        description?: string;
        vehicleType?: "motorbike" | "bicycle" | "van";
        areas?: string[];
        priceRange?: {
        min: number;
        max: number;
        };
        availability?: boolean;
    }
    
    export interface ServiceFilters {
        location?: string;
        vehicleType?: string;
        premiumOnly?: boolean;
        searchTerm?: string;
        courierId?: string;
    }
    
    export interface ServiceStats {
        totalServices: number;
        averageRating: number;
        premiumCount: number;
        totalReviews: number;
    }
    
    export interface ServiceCardProps {
        service: Service;
        isOwner?: boolean;
        onUpgrade?: (serviceId: string) => void;
        onEdit?: (serviceId: string) => void;
        onDelete?: (serviceId: string) => void;
    }
    
    export interface ServiceFormData {
        title: string;
        description: string;
        vehicleType: "motorbike" | "bicycle" | "van";
        areas: string;
        priceMin: string;
        priceMax: string;
        availability: boolean;
    }
    
    export interface PaymentMetadata {
        serviceId: string;
        userId: string;
        type: "premium_upgrade";
    }
    
    export interface PaymentResponse {
        status: boolean;
        message: string;
        data?: {
        authorization_url: string;
        access_code: string;
        reference: string;
        };
    }
    
    export interface PaymentVerificationResponse {
        status: boolean;
        message: string;
        data: {
        id: number;
        domain: string;
        status: string;
        reference: string;
        amount: number;
        message: string;
        gateway_response: string;
        paid_at: string;
        created_at: string;
        channel: string;
        currency: string;
        ip_address: string;
        metadata: PaymentMetadata;
        };
    }