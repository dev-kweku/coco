import { NextRequest,NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";


export async function POST(request:NextRequest){
    try{
        const {name,email,password,role,phone,location}=await request.json();
        if(!name||!email||!password||!phone||!location){
            return NextResponse.json(
                {message:"Missing required fields"},
                {status:400}
            )
        }

        const client=new MongoClient(process.env.MONGODB_URI!);
        await client.connect();
        const db=client.db();

        const existingUser=await db.collection("users").findOne({
            email:email.toLowerCase()
        });

        if(existingUser){
            await client.close();
            return NextResponse.json(
                {message:"User already exists"},
                {status:400}
            )
        }

        // hash pass for security
        const hashPassword=await bcrypt.hash(password,12);
        const result=await db.collection('users').insertOne({
            name,
            email:email.toLowerCase(),
            password:hashPassword,
            role:role||"customer",
            phone,
            location,
            createdAt:new Date(),
            updatedAt:new Date(),
        })

        await client.close();
        return NextResponse.json(
            {message:"User created successfully",
                userId:result.insertedId
            },
            {status:201}
        )

    }catch(error){
        console.error("registration error: ",error);
        return NextResponse.json(
            {message:"Internal server errror"},
            {status:500}
        )
    }
}