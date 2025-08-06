// import { RegisterForm } from "@/components/auth/register-form";
import { RegisterForm } from "components/auth/register-form";
export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Courier<span className="text-primary">GH</span></h1>
            <p className="text-muted-foreground mt-2">Create your account</p>
            </div>
            <RegisterForm />
        </div>
        </div>
    );
}