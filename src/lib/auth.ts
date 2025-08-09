import NextAuth from "next-auth/next";
import { AuthOptions } from "next-auth";
import { authOptions } from "./auth.config";

export default NextAuth(authOptions)