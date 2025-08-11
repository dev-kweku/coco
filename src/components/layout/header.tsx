    "use client";

    import Link from "next/link";
    import { useSession, signOut } from "next-auth/react";
    import { Button } from "@/components/ui/button";
    import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    } from "@/components/ui/dropdown-menu";
    import { User, LogOut } from "lucide-react";

    export function Header() {
    const { data: session, status } = useSession();

    return (
        <header className="bg-background border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
            Courier<span className="text-primary">GH</span>
            </Link>
            
            <nav className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-primary">Home</Link>
            <Link href="/services" className="hover:text-primary">Services</Link>
            <Link href="/track" className="hover:text-primary">Track Order</Link>
            <Link href="/about" className="hover:text-primary">About</Link>
            <Link href="/contact" className="hover:text-primary">Contact</Link>
            </nav>

            <div className="flex items-center space-x-4">
            {status === "loading" ? (
                <div>Loading...</div>
            ) : session ? (
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <User className="h-5 w-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{session.user?.name}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {session.user?.email}
                        </p>
                    </div>
                    </div>
                    <DropdownMenuSeparator />
                    {session.user.role === "courier" && (
                    <DropdownMenuItem asChild>
                        <Link href="/courier/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    )}
                    {session.user.role === "admin" && (
                    <DropdownMenuItem asChild>
                        <Link href="/admin">Admin</Link>
                    </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                    <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                    <Link href="/register">Register</Link>
                </Button>
                </div>
            )}
            </div>
        </div>
        </header>
    );
    }