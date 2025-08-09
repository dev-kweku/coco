    "use client";

    import { useState } from "react";
    import { useRouter } from "next/navigation";
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { Textarea } from "@/components/ui/textarea";
    import { useSession } from "next-auth/react";

    interface ServiceFormProps {
    service?: any;
    }

    export function ServiceForm({ service }: ServiceFormProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: service?.title || "",
        description: service?.description || "",
        vehicleType: service?.vehicleType || "motorbike",
        areas: service?.areas?.join(", ") || "",
        priceMin: service?.priceRange?.min || "",
        priceMax: service?.priceRange?.max || "",
        availability: service?.availability ?? true,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
        const payload = {
            ...formData,
            areas: formData.areas.split(",").map((area: string) => area.trim()).filter(Boolean),
            priceRange: {
            min: parseInt(formData.priceMin),
            max: parseInt(formData.priceMax),
            },
            courierId: session?.user.id,
            courierName: session?.user.name,
            courierPhone: session?.user.phone,
        };

        const url = service ? `/api/services/${service._id}` : "/api/services";
        const method = service ? "PUT" : "POST";

        const response = await fetch(url, {
            method,
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok) {
            router.push("/courier/dashboard");
        } else {
            setError(data.message || "Failed to save service");
        }
        } catch (error) {
        setError("An error occurred. Please try again.");
        } finally {
        setIsLoading(false);
        }
    };

    return (
        <Card>
        <CardHeader>
            <CardTitle>{service ? "Edit Service" : "Create New Service"}</CardTitle>
            <CardDescription>
            {service 
                ? "Update your service information" 
                : "Add a new delivery service to your profile"
            }
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Service Title</Label>
                <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
                />
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                id="description"
                value={formData.description}
                onChange={(e: { target: { value: string | boolean; }; }) => handleChange("description", e.target.value)}
                required
                />
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                <Select value={formData.vehicleType} onValueChange={(value) => handleChange("vehicleType", value)}>
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="motorbike">Motorbike</SelectItem>
                    <SelectItem value="bicycle">Bicycle</SelectItem>
                    <SelectItem value="van">Van</SelectItem>
                </SelectContent>
                </Select>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="areas">Service Areas (comma separated)</Label>
                <Input
                id="areas"
                value={formData.areas}
                onChange={(e) => handleChange("areas", e.target.value)}
                placeholder="e.g., Accra Central, Osu, Labone"
                required
                />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label htmlFor="priceMin">Minimum Price (GHS)</Label>
                <Input
                    id="priceMin"
                    type="number"
                    value={formData.priceMin}
                    onChange={(e) => handleChange("priceMin", e.target.value)}
                    required
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor="priceMax">Maximum Price (GHS)</Label>
                <Input
                    id="priceMax"
                    type="number"
                    value={formData.priceMax}
                    onChange={(e) => handleChange("priceMax", e.target.value)}
                    required
                />
                </div>
            </div>
            
            <div className="flex items-center space-x-2">
                <input
                type="checkbox"
                id="availability"
                checked={formData.availability}
                onChange={(e) => handleChange("availability", e.target.checked)}
                className="rounded"
                />
                <Label htmlFor="availability">Available for new orders</Label>
            </div>
            
            {error && (
                <div className="text-destructive text-sm">{error}</div>
            )}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Saving..." : service ? "Update Service" : "Create Service"}
            </Button>
            </form>
        </CardContent>
        </Card>
    );
    }