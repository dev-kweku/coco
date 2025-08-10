    import Service from "@/models/Service";

    export async function getService(id: string) {
    try {
        const service = await Service.findById(id).lean();
        
        if (!service) return null;
        
        // Convert ObjectId fields to strings
        return {
        ...service,
        _id: service._id.toString(),
        courierId: service.courierId.toString(),
        };
    } catch (error) {
        console.error("Error fetching service:", error);
        return null;
    }
    }