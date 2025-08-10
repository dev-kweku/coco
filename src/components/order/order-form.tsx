    "use client";

    import { useState } from "react";
    import { useRouter } from "next/navigation";
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
    import { Textarea } from "@/components/ui/textarea";
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { Service } from "@/types/service";
    import { MapPin, Package, Weight } from "lucide-react";

    interface OrderFormProps {
    services: Service[];
    preSelectedService?: string;
    }

    export function OrderForm({ services, preSelectedService }: OrderFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        serviceId: preSelectedService || "",
        pickupAddress: "",
        deliveryAddress: "",
        packageDescription: "",
        weight: "",
        length: "",
        width: "",
        height: "",
        notes: "",
    });
    const [selectedService, setSelectedService] = useState<Service | null>(
        services.find(s => s._id === preSelectedService) || null
    );
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        if (field === "serviceId") {
        const service = services.find(s => s._id === value);
        setSelectedService(service || null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
        const payload = {
            ...formData,
            weight: parseFloat(formData.weight),
            dimensions: {
            length: parseFloat(formData.length),
            width: parseFloat(formData.width),
            height: parseFloat(formData.height),
            },
        };

        const response = await fetch("/api/orders", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok) {
            router.push(`/orders/${data.order._id}?success=true`);
        } else {
            setError(data.message || "Failed to create order");
        }
        } catch (error) {
        setError("An error occurred. Please try again.");
        } finally {
        setIsLoading(false);
        }
    };

    const estimatedPrice = selectedService 
        ? selectedService.priceRange.min + Math.max(0, (parseFloat(formData.weight) || 0) - 1) * 2
        : 0;

    return (
        <Card>
        <CardHeader>
            <CardTitle>Create New Order</CardTitle>
            <CardDescription>
            Fill in the details to request a delivery service
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="serviceId">Select Service</Label>
                <Select value={formData.serviceId} onValueChange={(value) => handleChange("serviceId", value)}>
                <SelectTrigger>
                    <SelectValue placeholder="Choose a delivery service" />
                </SelectTrigger>
                <SelectContent>
                    {services.map((service) => (
                    <SelectItem key={service._id} value={service._id}>
                        {service.title} - GHS {service.priceRange.min}-{service.priceRange.max}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label htmlFor="pickupAddress">Pickup Address</Label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                    id="pickupAddress"
                    value={formData.pickupAddress}
                    onChange={(e) => handleChange("pickupAddress", e.target.value)}
                    placeholder="Enter pickup location"
                    className="pl-10"
                    required
                    />
                </div>
                </div>
                <div className="space-y-2">
                <Label htmlFor="deliveryAddress">Delivery Address</Label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                    id="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={(e) => handleChange("deliveryAddress", e.target.value)}
                    placeholder="Enter delivery location"
                    className="pl-10"
                    required
                    />
                </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="packageDescription">Package Description</Label>
                <div className="relative">
                <Package className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                    id="packageDescription"
                    value={formData.packageDescription}
                    onChange={(e) => handleChange("packageDescription", e.target.value)}
                    placeholder="Describe what you're sending"
                    className="pl-10 min-h-[80px]"
                    required
                />
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <div className="relative">
                    <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={formData.weight}
                    onChange={(e) => handleChange("weight", e.target.value)}
                    placeholder="0.0"
                    className="pl-10"
                    required
                    />
                </div>
                </div>
                <div className="space-y-2">
                <Label htmlFor="length">Length (cm)</Label>
                <Input
                    id="length"
                    type="number"
                    value={formData.length}
                    onChange={(e) => handleChange("length", e.target.value)}
                    placeholder="0"
                    required
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor="width">Width (cm)</Label>
                <Input
                    id="width"
                    type="number"
                    value={formData.width}
                    onChange={(e) => handleChange("width", e.target.value)}
                    placeholder="0"
                    required
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                    id="height"
                    type="number"
                    value={formData.height}
                    onChange={(e) => handleChange("height", e.target.value)}
                    placeholder="0"
                    required
                />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Any special instructions for the courier"
                className="min-h-[80px]"
                />
            </div>

            {selectedService && (
                <div className="bg-muted p-4 rounded-lg">
                <div className="flex justify-between items-center">
                    <span className="font-medium">Estimated Price:</span>
                    <span className="text-lg font-bold">GHS {estimatedPrice.toFixed(2)}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                    Based on base rate (GHS {selectedService.priceRange.min}) + weight surcharge
                </p>
                </div>
            )}

            {error && (
                <div className="text-destructive text-sm">{error}</div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading || !formData.serviceId}>
                {isLoading ? "Creating Order..." : "Create Order"}
            </Button>
            </form>
        </CardContent>
        </Card>
    );
    }