    import { MongoClient } from "mongodb";
    import mongoose from "mongoose";

    if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
    }

    const uri = process.env.MONGODB_URI;
    const options = {};

    let client: MongoClient;
    let clientPromise: Promise<MongoClient>;

    if (process.env.NODE_ENV === "development") {
    let globalWithMongo = global as typeof globalThis & {
        _mongoClientPromise?: Promise<MongoClient>;
        _mongooseConnection?: typeof mongoose;
    };

    if (!globalWithMongo._mongoClientPromise) {
        client = new MongoClient(uri, options);
        globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;

    if (!globalWithMongo._mongooseConnection) {
        mongoose.connect(uri);
        globalWithMongo._mongooseConnection = mongoose;
    }
    } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
    mongoose.connect(uri);
    }

    
    export default clientPromise;
    export { mongoose };

