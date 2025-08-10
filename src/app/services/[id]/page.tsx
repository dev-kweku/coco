    import { notFound } from "next/navigation";
    import { getService } from "@/lib/services";
    import { ServiceCard } from "@/components/courier/service-card";
    import { ReviewForm } from "@/components/courier/review-form";
    import { Button } from "@/components/ui/button";
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
    import { Star, MapPin, Phone, MessageCircle, Calendar } from "lucide-react";
    import { useSession } from "next-auth/react";
    import Link from "next/link";

    interface ServicePageProps {
    params: {
        id: string;
    };
    }

    export default async function ServicePage({ params }: ServicePageProps) {
    const service = await getService(params.id);

    if (!service) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">{service.title}</h1>
                <p className="text-muted-foreground">by {service.courierName}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Service Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                        <p className="font-medium">Service Areas</p>
                        <p className="text-sm text-muted-foreground">{service.areas.join(", ")}</p>
                    </div>
                    </div>
                    <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                        <p className="font-medium">Vehicle Type</p>
                        <p className="text-sm text-muted-foreground capitalize">{service.vehicleType}</p>
                    </div>
                    </div>
                    <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                        <p className="font-medium">Price Range</p>
                        <p className="text-sm text-muted-foreground">GHS {service.priceRange.min} - {service.priceRange.max}</p>
                    </div>
                    </div>
                </CardContent>
                </Card>

                <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Contact Courier</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button className="w-full" onClick={() => window.location.href = `tel:+233${service.courierPhone}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    Call Now
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => {
                    const message = `Hello! I'm interested in your service "${service.title}" on CourierGH.`;
                    window.open(`https://wa.me/233${service.courierPhone}?text=${encodeURIComponent(message)}`, '_blank');
                    }}>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    WhatsApp
                    </Button>
                </CardContent>
                </Card>
            </div>

            {/* Reviews Section */}
            <div id="reviews" className="mb-8">
                <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
                
                <ReviewForm serviceId={service._id} />
                
                {service.reviews.length > 0 ? (
                <div className="space-y-4 mt-8">
                    {service.reviews.map((review) => (
                    <Card key={review._id}>
                        <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                            <div className="flex mr-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`h-4 w-4 ${
                                    star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                    }`}
                                />
                                ))}
                            </div>
                            <span className="font-medium">{review.customerName}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <p className="text-sm">{review.comment}</p>
                        </CardContent>
                    </Card>
                    ))}
                </div>
                ) : (
                <Card>
                    <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">No reviews yet. Be the first to review!</p>
                    </CardContent>
                </Card>
                )}
            </div>
            </div>

            <div>
            <ServiceCard service={service} />
            </div>
        </div>
        </div>
    );
    }