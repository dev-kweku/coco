    import mongoose, { Schema, model, Document, ObjectId } from "mongoose";

    export interface IOrder extends Document {
    _id: ObjectId;
    customerId: ObjectId;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    serviceId: ObjectId;
    courierId?: ObjectId;
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

    const orderSchema = new Schema<IOrder>({
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerAddress: { type: String, required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    courierId: { type: Schema.Types.ObjectId, ref: "User" },
    courierName: { type: String },
    courierPhone: { type: String },
    pickupAddress: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    packageDescription: { type: String, required: true },
    weight: { type: Number, required: true },
    dimensions: {
        length: { type: Number, required: true },
        width: { type: Number, required: true },
        height: { type: Number, required: true }
    },
    price: { type: Number, required: true },
    status: { 
        type: String, 
        required: true, 
        enum: ["pending", "accepted", "picked_up", "in_transit", "delivered", "cancelled"],
        default: "pending"
    },
    paymentStatus: { 
        type: String, 
        required: true, 
        enum: ["pending", "paid", "refunded"],
        default: "pending"
    },
    estimatedDelivery: { type: Date, required: true },
    actualDelivery: { type: Date },
    trackingNumber: { type: String, required: true, unique: true },
    notes: { type: String },
    rating: { type: Number, min: 1, max: 5 },
    review: { type: String },
    }, {
    timestamps: true
    });

    // Method to convert document to JSON with string IDs
    orderSchema.methods.toJSON = function() {
    const obj = this.toObject();
    obj._id = obj._id.toString();
    obj.customerId = obj.customerId.toString();
    obj.serviceId = obj.serviceId.toString();
    if (obj.courierId) obj.courierId = obj.courierId.toString();
    return obj;
    };

    // Generate tracking number before saving
    orderSchema.pre("save", function(next) {
    if (this.isNew) {
        const timestamp = Date.now().toString();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
        this.trackingNumber = `CGH${timestamp.slice(-6)}${random}`;
    }
    next();
    });

    const Order = model<IOrder>("Order", orderSchema);

    export default Order;