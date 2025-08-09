import "next-auth";
import "next-auth/jwt"

declare module "next-auth"{
    interface Session{
        user:{
            id:string;
            role:string;
            phone:string;
            location:string;
        } & DefaultSession["user"];
    }

    interface User{
        role:string;
        phone:string;
        location:string;
    }
}

declare module "next-auth/jwt"{
    interface JWT {
        role:string;
        phone:string;
        location:string;
    }
}


