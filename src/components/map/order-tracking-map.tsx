    "use client";

    import { useEffect, useState } from "react";
    import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
    import { LatLngExpression } from "leaflet";
    import "leaflet/dist/leaflet.css";
    import { Order } from "@/types/order";

    interface OrderTrackingMapProps {
    order: Order;
    currentPosition?: { lat: number; lng: number };
    }

    export function OrderTrackingMap({ order, currentPosition }: OrderTrackingMapProps) {
    const [pickupCoords, setPickupCoords] = useState<LatLngExpression | null>(null);
    const [deliveryCoords, setDeliveryCoords] = useState<LatLngExpression | null>(null);
    const [routeCoords, setRouteCoords] = useState<LatLngExpression[]>([]);

    useEffect(() => {
        // Geocode addresses to coordinates (simplified for demo)
        const geocodeAddress = async (address: string): Promise<[number, number]> => {
        // In a real app, you would use a geocoding service
        // For demo, we'll return dummy coordinates for Accra
        const accraCoords: { [key: string]: [number, number] } = {
            "Accra Central": [5.6037, -0.1870],
            "Osu": [5.5540, -0.1765],
            "Labone": [5.5750, -0.1690],
            "Kaneshie": [5.5890, -0.2010],
            "Spintex": [5.6140, -0.2100],
        };
        
        // Extract area name from address
        const area = Object.keys(accraCoords).find(key => 
            address.toLowerCase().includes(key.toLowerCase())
        );
        
        return area ? accraCoords[area] : [5.6037, -0.1870];
        };

        const getRoute = async (start: [number, number], end: [number, number]) => {
        // In a real app, you would use a routing service like OSRM
        // For demo, we'll create a simple route with waypoints
        const route: LatLngExpression[] = [];
        
        // Add start point
        route.push(new window.L.LatLng(start[0], start[1]));
        
        // Add some intermediate points for a realistic route
        const midLat = (start[0] + end[0]) / 2;
        const midLng = (start[1] + end[1]) / 2;
        route.push(new window.L.LatLng(midLat + 0.01, midLng + 0.01));
        route.push(new window.LatLng(midLat - 0.01, midLng - 0.01));
        
        // Add end point
        route.push(new window.LatLng(end[0], end[1]));
        
        return route;
        };

        const initMap = async () => {
        try {
            const pickup = await geocodeAddress(order.pickupAddress);
            const delivery = await geocodeAddress(order.deliveryAddress);
            
            setPickupCoords(new window.L.LatLng(pickup[0], pickup[1]));
            setDeliveryCoords(new window.LatLng(delivery[0], delivery[1]));
            
            const route = await getRoute(pickup, delivery);
            setRouteCoords(route);
        } catch (error) {
            console.error("Error geocoding addresses:", error);
        }
        };

        initMap();
    }, [order.pickupAddress, order.deliveryAddress]);

    const getMarkerColor = () => {
        switch (order.status) {
        case "pending": return "gray";
        case "accepted": return "blue";
        case "picked_up": return "orange";
        case "in_transit": return "green";
        case "delivered": return "green";
        case "cancelled": return "red";
        default: return "gray";
        }
    };

    if (!pickupCoords || !deliveryCoords) {
        return (
        <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
            <p>Loading map...</p>
        </div>
        );
    }

    return (
        <div className="h-96 rounded-lg overflow-hidden">
        <MapContainer
            center={pickupCoords}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Route line */}
            {routeCoords.length > 0 && (
            <Polyline
                positions={routeCoords}
                color={getMarkerColor()}
                weight={5}
                opacity={0.7}
            />
            )}
            
            {/* Pickup marker */}
            <Marker position={pickupCoords}>
            <Popup>
                <div className="text-center">
                <strong>Pickup Location</strong>
                <br />
                {order.pickupAddress}
                </div>
            </Popup>
            </Marker>
            
            {/* Delivery marker */}
            <Marker position={deliveryCoords}>
            <Popup>
                <div className="text-center">
                <strong>Delivery Location</strong>
                <br />
                {order.deliveryAddress}
                </div>
            </Popup>
            </Marker>
            
            {/* Current position marker (if available) */}
            {currentPosition && (
            <Marker position={[currentPosition.lat, currentPosition.lng]}>
                <Popup>
                <div className="text-center">
                    <strong>Current Location</strong>
                    <br />
                    Last updated: {new Date().toLocaleTimeString()}
                </div>
                </Popup>
            </Marker>
            )}
        </MapContainer>
        </div>
    );
    }