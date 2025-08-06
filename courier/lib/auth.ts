    import NextAuth, { type NextAuthOptions } from "next-auth";
    import CredentialsProvider from "next-auth/providers/credentials";
    import { MongoClient } from "mongodb";
    import bcrypt from "bcryptjs";
    import type { JWT } from "next-auth/jwt";
    import type { Session } from "next-auth";

    // MongoDB connection
    const client = new MongoClient(process.env.MONGODB_URI!);
    const clientPromise = client.connect();

    export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
        name: "credentials",
        credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) {
            return null;
            }

            try {
            const mongoClient = await clientPromise;
            const db = mongoClient.db();
            
            // Find user by email
            const user = await db.collection("users").findOne({ 
                email: credentials.email.toLowerCase() 
            });
            
            if (!user) {
                return null;
            }

            // Check password
            const isPasswordValid = await bcrypt.compare(
                credentials.password,
                user.password
            );

            if (!isPasswordValid) {
                return null;
            }

            // Return user object with required fields
            return {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                location: user.location,
            };
            } catch (error) {
            console.error("Authentication error:", error);
            return null;
            }
        }
        })
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    jwt: {
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async jwt({ token, user }: { token: JWT; user?: any }) {
        // Persist the role and other user info to the token
        if (user) {
            token.role = user.role;
            token.phone = user.phone;
            token.location = user.location;
        }
        return token;
        },
        async session({ session, token }: { session: Session; token: JWT }) {
        // Send properties to the client
        if (token) {
            session.user.id = token.sub!;
            session.user.role = token.role;
            session.user.phone = token.phone;
            session.user.location = token.location;
        }
        return session;
        },
    },
    pages: {
        signIn: "/login",
        signUp: "/register",
    },
    secret: process.env.NEXTAUTH_SECRET,
    };

    export default NextAuth(authOptions);