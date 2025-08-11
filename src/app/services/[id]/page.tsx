    "use client";

    import { useState, useEffect } from "react";
    import { useParams } from "next/navigation";
    import { ServiceCard } from "@/components/courier/service-card";
    import { OrderForm } from "@/components/order/order-form";
    import { Button } from "@/components/ui/button";
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
    import { Service } from "@/types/service";
    import { ArrowLeft } from "lucide-react";
    import Link from "next/link";

    export default function ServiceDetailPage() {
    const params = useParams();
    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchService();
    }, [params.id]);

    const fetchService = async () => {
        setLoading(true);
        try {
        const response = await fetch(`/api/services/${params.id}`);
        const data = await response.json();
        setService(data);
        } catch (error) {
        console.error("Error fetching service:", error);
        } finally {
        setLoading(false);
        }
    };

    if (loading) {
        return <div className="container mx-auto px-4 py-8">Loading service...</div>;
    }

    if (!service) {
        return <div className="container mx-auto px-4 py-8">Service not found</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-primary hover:underline mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Services
            </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Service Information */}
            <div>
            <ServiceCard service={service} />
            
            {/* Additional Service Details */}
            <Card className="mt-6">
                <CardHeader>
                <CardTitle>Service Details</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="space-y-4">
                    <div>
                    <h4 className="font-medium mb-2">Service Areas</h4>
                    <div className="flex flex-wrap gap-2">
                        {service.areas.map((area, index) => (
                        <span
                            key={index}
                            className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                        >
                            {area}
                        </span>
                        ))}
                    </div>
                    </div>
                    
                    <div>
                    <h4 className="font-medium mb-2">Pricing</h4>
                    <p className="text-muted-foreground">
                        Base rate: GHS {service.priceRange.min} - {service.priceRange.max}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Additional charges may apply based on weight and distance
                    </p>
                    </div>
                    
                    <div>
                    <h4 className="font-medium mb-2">Availability</h4>
                    <p className="text-muted-foreground">
                        {service.availability ? "Currently accepting orders" : "Not available at the moment"}
                    </p>
                    </div>
                </div>
                </CardContent>
            </Card>
            </div>

            {/* Order Form */}
            <div>
            <OrderForm services={[service]} preSelectedService={service._id} />
            
            {/* Contact Information */}
            <Card className="mt-6">
                <CardHeader>
                <CardTitle>Need Help?</CardTitle>
                <CardDescription>
                    Contact the courier directly for inquiries
                </CardDescription>
                </CardHeader>
                <CardContent>
                <div className="space-y-2">
                    <p className="font-medium">{service.courierName}</p>
                    <p className="text-muted-foreground">Phone: {service.courierPhone}</p>
                    <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                        Call Courier
                    </Button>
                    <Button variant="outline" size="sm">
                        Message on WhatsApp
                    </Button>
                    </div>
                </div>
                </CardContent>
            </Card>
            </div>
        </div>
        </div>
    );
    }