export interface Service {
    _id: string;
    title: string;
    description: string;
    vehicleType: "motorbike" | "bicycle" | "van";
    areas: string[];
    priceRange: { min: number; max: number };
    availability: boolean;
    premium: boolean;
    premiumExpiry?: Date;
    rating: number;
    reviews: Review[];
    courierId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Review {
    _id: string;
    customerId: string;
    rating: number;
    comment: string;
    createdAt: Date;
}