    import { Button } from "@/components/ui/button";
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
    import { Badge } from "@/components/ui/badge";
    import { Star, MapPin, Phone, MessageCircle } from "lucide-react";

    interface ServiceCardProps {
    service?: {
        title: string;
        description: string;
        vehicleType: string;
        areas: string[];
        priceRange: { min: number; max: number };
        availability: boolean;
        premium: boolean;
        rating: number;
        courier: {
        name: string;
        phone: string;
        };
    };
    }

    export function ServiceCard({ service }: ServiceCardProps) {
    // Default service data for now
    const defaultService = {
        title: "Express Delivery Service",
        description: "Fast and reliable delivery across Accra",
        vehicleType: "motorbike",
        areas: ["Accra Central", "Osu", "Labone"],
        priceRange: { min: 10, max: 50 },
        availability: true,
        premium: true,
        rating: 4.5,
        courier: {
        name: "Kofi Mensah",
        phone: "0501234567"
        }
    };

    const s = service || defaultService;

    return (
        <Card className={`overflow-hidden ${s.premium ? 'border-primary shadow-lg' : ''}`}>
        {s.premium && (
            <div className="bg-primary text-primary-foreground py-1 px-3 text-sm font-medium">
            PREMIUM LISTING
            </div>
        )}
        <CardHeader>
            <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-lg">{s.title}</CardTitle>
                <CardDescription>by {s.courier.name}</CardDescription>
            </div>
            <div className="flex items-center bg-secondary px-2 py-1 rounded">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="text-sm font-medium">{s.rating.toFixed(1)}</span>
            </div>
            </div>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{s.description}</p>
            <div className="space-y-2">
            <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{s.areas.join(", ")}</span>
            </div>
            <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{s.vehicleType}</span>
            </div>
            <div className="flex items-center text-sm">
                <span className="font-medium">GHS {s.priceRange.min} - {s.priceRange.max}</span>
            </div>
            <div className="flex items-center text-sm">
                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${s.availability ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span>{s.availability ? 'Available Now' : 'Currently Busy'}</span>
            </div>
            </div>
        </CardContent>
        <CardFooter className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
            <Phone className="h-4 w-4 mr-2" />
            Call
            </Button>
            <Button size="sm" className="flex-1">
            <MessageCircle className="h-4 w-4 mr-2" />
            WhatsApp
            </Button>
        </CardFooter>
        </Card>
    );
    }