    "use client";

    import { useSession } from "next-auth/react";
    import { Button } from "@/components/ui/button";
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
    import { Badge } from "@/components/ui/badge";
    import { Star, MapPin, Phone, MessageCircle } from "lucide-react";
    import { Service } from "@/types/service";

    interface ServiceCardProps {
    service: Service;
    }

    export function ServiceCard({ service }: ServiceCardProps) {
    const { data: session } = useSession();
    const isOwner = session?.user.id === service.courierId.toString();

    const handleWhatsAppClick = () => {
        const message = `Hello! I found your courier service "${service.title}" on CourierGH. I'm interested in your services.`;
        const url = `https://wa.me/233${service.courierPhone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const handleCallClick = () => {
        window.location.href = `tel:+233${service.courierPhone}`;
    };

    const handleUpgrade = async () => {
        try {
        const response = await fetch("/api/payments/initialize", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ serviceId: service._id.toString() }),
        });

        const data = await response.json();
        
        if (data.status) {
            window.location.href = data.data.authorization_url;
        } else {
            alert("Failed to initialize payment");
        }
        } catch (error) {
        console.error("Upgrade error:", error);
        alert("An error occurred. Please try again.");
        }
    };

    
    return (
        <Card className={`overflow-hidden ${service.premium ? 'border-primary shadow-lg' : ''}`}>
        {service.premium && (
            <div className="bg-primary text-primary-foreground py-1 px-3 text-sm font-medium">
            PREMIUM LISTING
            </div>
        )}
        <CardHeader>
            <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-lg">{service.title}</CardTitle>
                <CardDescription>by {service.courierName}</CardDescription>
            </div>
            <div className="flex items-center bg-secondary px-2 py-1 rounded">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="text-sm font-medium">{service.rating.toFixed(1)}</span>
            </div>
            </div>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
            <div className="space-y-2">
            <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{service.areas.join(", ")}</span>
            </div>
            <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="capitalize">{service.vehicleType}</span>
            </div>
            <div className="flex items-center text-sm">
                <span className="font-medium">GHS {service.priceRange.min} - {service.priceRange.max}</span>
            </div>
            <div className="flex items-center text-sm">
                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${service.availability ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span>{service.availability ? 'Available Now' : 'Currently Busy'}</span>
            </div>
            </div>
        </CardContent>
        <CardFooter className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={handleCallClick}>
            <Phone className="h-4 w-4 mr-2" />
            Call
            </Button>
            <Button size="sm" className="flex-1" onClick={handleWhatsAppClick}>
            <MessageCircle className="h-4 w-4 mr-2" />
            WhatsApp
            </Button>
        </CardFooter>
        {isOwner && !service.premium && (
            <div className="px-6 pb-6">
            <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={handleUpgrade}
            >
                Upgrade to Premium (GHS 10)
            </Button>
            </div>
        )}
        </Card>
    );
    }