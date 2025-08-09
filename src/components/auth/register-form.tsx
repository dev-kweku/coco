    "use client";

    import { useState } from "react";
    import { useRouter } from "next/navigation";
    import Link from "next/link";
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

    export function RegisterForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "customer",
        phone: "",
        location: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setIsLoading(false);
        return;
        }

        try {
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
            router.push("/login?message=Registration successful");
        } else {
            setError(data.message || "Registration failed");
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
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
            Enter your information to create your account
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="role">Account Type</Label>
                <Select value={formData.role} onValueChange={(value) => handleChange("role", value)}>
                <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="courier">Courier</SelectItem>
                </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                required
                />
            </div>
            {error && (
                <div className="text-destructive text-sm">{error}</div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
            </Button>
            </form>
            <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
                Sign in
            </Link>
            </div>
        </CardContent>
        </Card>
    );
    }