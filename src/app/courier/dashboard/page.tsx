    "use client";

    import { useSession } from "next-auth/react";
    import { useRouter } from "next/navigation";
    import { useEffect, useState } from "react";
    import { ServiceCard } from "@/components/courier/service-card";
    import { Button } from "@/components/ui/button";
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
    import { Plus, Star } from "lucide-react";
    import { Service } from "@/types/service";

    export default function CourierDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
        router.push("/login");
        } else if (status === "authenticated" && session?.user.role !== "courier") {
        router.push("/");
        } else if (status === "authenticated") {
        fetchServices();
        }
    }, [status, session, router]);

    const fetchServices = async () => {
        try {
        const response = await fetch(`/api/services?courierId=${session?.user.id}`);
        const data = await response.json();
        setServices(data);
        } catch (error) {
        console.error("Error fetching services:", error);
        } finally {
        setLoading(false);
        }
    };

    if (status === "loading" || loading) {
        return <div className="container mx-auto px-4 py-8">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
            <div>
            <h1 className="text-3xl font-bold">Courier Dashboard</h1>
            <p className="text-muted-foreground">Manage your delivery services</p>
            </div>
            <Button asChild>
            <a href="/courier/services/new">
                <Plus className="mr-2 h-4 w-4" />
                Add New Service
            </a>
            </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Services</CardTitle>
                <Plus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{services.length}</div>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                {services.length > 0 
                    ? (services.reduce((sum, service) => sum + service.rating, 0) / services.length).toFixed(1)
                    : "0.0"}
                </div>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Premium Listings</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                {services.filter(s => s.premium).length}
                </div>
            </CardContent>
            </Card>
        </div>

        {/* Services */}
        <div>
            <h2 className="text-xl font-semibold mb-4">Your Services</h2>
            {services.length === 0 ? (
            <Card>
                <CardContent className="pt-6">
                <div className="text-center">
                    <p className="text-muted-foreground mb-4">You haven't created any services yet.</p>
                    <Button asChild>
                    <a href="/courier/services/new">Create Your First Service</a>
                    </Button>
                </div>
                </CardContent>
            </Card>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                <ServiceCard key={service._id} service={service} />
                ))}
            </div>
            )}
        </div>
        </div>
    );
    }