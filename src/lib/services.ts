    // import { MongoClient, ObjectId } from "mongodb";

    // export async function getService(id: string) {
    // try {
    //     const client = new MongoClient(process.env.MONGODB_URI!);
    //     await client.connect();
    //     const db = client.db();

    //     // Convert string id to ObjectId
    //     const objectId = new ObjectId(id);
        
    //     const service = await db.collection("services").findOne({ _id: objectId });

    //     await client.close();

    //     return service;
    // } catch (error) {
    //     console.error("Error fetching service:", error);
    //     return null;
    // }
    // }


import Service from "@/models/Service";

export async function getService(id: string) {
    try {
    const service = await Service.findById(id).lean();
    return service;
    } catch (error) {
    console.error("Error fetching service:", error);
    return null;
    }
}