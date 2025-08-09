    import axios from "axios";

    const paystack = axios.create({
    baseURL: "https://api.paystack.co",//will fix the url
    headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
    },
    });

    export const initializePayment = async (email: string, amount: number, metadata: any) => {
    try {
        const response = await paystack.post("/transaction/initialize", {
        email,
        amount: amount * 100, // Convert to pesewas
        metadata,
        callback_url: `${process.env.NEXTAUTH_URL}/payment/verify`,
        });

        return response.data;
    } catch (error) {
        console.error("Paystack initialization error:", error);
        throw error;
    }
    };

    export const verifyPayment = async (reference: string) => {
    try {
        const response = await paystack.get(`/transaction/verify/${reference}`);
        return response.data;
    } catch (error) {
        console.error("Paystack verification error:", error);
        throw error;
    }
    };