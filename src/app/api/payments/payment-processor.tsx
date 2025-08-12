    "use client";

    import { useState } from "react";
    import { Button } from "@/components/ui/button";
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { Badge } from "@/components/ui/badge";
    import { CreditCard, Shield, Clock } from "lucide-react";
    import { useSession } from "next-auth/react";
    import { useRouter } from "next/navigation";

    interface PaymentProcessorProps {
    orderId: string;
    amount: number;
    onPaymentSuccess: () => void;
    }

    export function PaymentProcessor({ orderId, amount, onPaymentSuccess }: PaymentProcessorProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [cardNumber, setCardNumber] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");
    const [cardName, setCardName] = useState("");
    const [error, setError] = useState("");
    const { data: session } = useSession();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setError("");

        try {
        // Validate card details
        if (!cardNumber || !expiryDate || !cvv || !cardName) {
            setError("Please fill in all card details");
            setIsProcessing(false);
            return;
        }

        // Initialize Paystack payment
        const response = await fetch("/api/payments/initialize", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            email: session?.user.email,
            amount: amount * 100, // Convert to pesewas
            metadata: {
                orderId,
                userId: session?.user.id,
                type: "order_payment"
            }
            }),
        });

        const data = await response.json();

        if (data.status) {
            // Redirect to Paystack payment page
            window.location.href = data.data.authorization_url;
        } else {
            setError("Failed to initialize payment");
        }
        } catch (error) {
        console.error("Payment error:", error);
        setError("Failed to process payment");
        } finally {
        setIsProcessing(false);
        }
    };

    const formatCardNumber = (value: string) => {
        return value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim();
    };

    const formatExpiryDate = (value: string) => {
        return value
        .replace(/\D/g, "")
        .replace(/(.{2})/, "$1/")
        .trim();
    };

    return (
        <Card className="w-full max-w-md mx-auto">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Complete Payment
            </CardTitle>
            <CardDescription>
            Pay securely for your delivery service
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="text-2xl font-bold">GHS {amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-muted-foreground">Order ID</span>
                <span className="text-sm font-mono">#{orderId.slice(-6)}</span>
            </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input
                id="cardName"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="John Doe"
                required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                id="cardNumber"
                value={formatCardNumber(cardNumber)}
                onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, ""))}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                    id="expiryDate"
                    value={formatExpiryDate(expiryDate)}
                    onChange={(e) => setExpiryDate(e.target.value.replace(/\D/g, ""))}
                    placeholder="MM/YY"
                    maxLength={5}
                    required
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                    id="cvv"
                    type="password"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="123"
                    maxLength={3}
                    required
                />
                </div>
            </div>

            {error && (
                <div className="text-destructive text-sm">{error}</div>
            )}

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Your payment information is encrypted and secure</span>
            </div>

            <Button 
                type="submit" 
                className="w-full" 
                disabled={isProcessing}
            >
                {isProcessing ? (
                <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                </>
                ) : (
                `Pay GHS ${amount.toFixed(2)}`
                )}
            </Button>
            </form>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary">Powered by Paystack</Badge>
            </div>
        </CardContent>
        </Card>
    );
    }