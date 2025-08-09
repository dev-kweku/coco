    "use client";

    import { useState } from "react";
    import { signIn } from "next-auth/react";
    import { useRouter } from "next/navigation";
    import Link from "next/link";
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

    export function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError("Invalid email or password");
        } else {
            router.push("/");
        }
        } catch (error) {
        setError("An error occurred. Please try again.");
        } finally {
        setIsLoading(false);
        }
    };

    return (
        <Card>
        <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
            Enter your email and password to access your account
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
            </div>
            {error && (
                <div className="text-destructive text-sm">{error}</div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            </form>
            <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
                Sign up
            </Link>
            </div>
        </CardContent>
        </Card>
    );
    }