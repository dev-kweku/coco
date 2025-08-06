    import { NextRequest, NextResponse } from "next/server";
    import bcrypt from "bcryptjs";
    import { MongoClient } from "mongodb";

    export async function POST(request: NextRequest) {
    try {
        const { name, email, password, role, phone, location } = await request.json();

        // Validate input
        if (!name || !email || !password || !phone || !location) {
        return NextResponse.json(
            { message: "Missing required fields" },
            { status: 400 }
        );
        }

        // Connect to database
        const client = new MongoClient(process.env.MONGODB_URI!);
        await client.connect();
        const db = client.db();
        
        // Check if user already exists
        const existingUser = await db.collection("users").findOne({ 
        email: email.toLowerCase() 
        });
        
        if (existingUser) {
        await client.close();
        return NextResponse.json(
            { message: "User already exists" },
            { status: 400 }
        );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const result = await db.collection("users").insertOne({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role || "customer",
        phone,
        location,
        createdAt: new Date(),
        updatedAt: new Date(),
        });

        await client.close();

        return NextResponse.json(
        { 
            message: "User created successfully",
            userId: result.insertedId 
        },
        { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
        );
    }
    }



    