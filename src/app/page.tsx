"use client"
import { ServiceCard } from "@/components/courier/service-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Search, Filter } from "lucide-react";

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState("");
  const [premiumOnly, setPremiumOnly] = useState(false);

  // Fetch services based on filters (we'll implement this later)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Find Reliable Courier Services in Ghana</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Connect with trusted bike couriers for urgent deliveries in Accra, Kumasi, and beyond.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-card p-6 rounded-lg shadow mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="accra">Accra</SelectItem>
              <SelectItem value="kumasi">Kumasi</SelectItem>
              <SelectItem value="takoradi">Takoradi</SelectItem>
            </SelectContent>
          </Select>
          <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Vehicles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="motorbike">Motorbike</SelectItem>
              <SelectItem value="bicycle">Bicycle</SelectItem>
              <SelectItem value="van">Van</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <Button
              variant={premiumOnly ? "default" : "outline"}
              onClick={() => setPremiumOnly(!premiumOnly)}
              className="w-full"
            >
              <Filter className="mr-2 h-4 w-4" />
              Premium Only
            </Button>
          </div>
        </div>
      </div>

      {/* Service Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder for service cards */}
        <ServiceCard />
        <ServiceCard />
        <ServiceCard />
        <ServiceCard />
        <ServiceCard />
        <ServiceCard />
      </div>
    </div>
  );
}