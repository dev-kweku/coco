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
    import { User, LogOut, Bell } from "lucide-react";
    import { Badge } from "@/components/ui/badge";
    import { formatDistanceToNow } from "date-fns";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal, AwaitedReactNode } from "react";

    function HeaderContent() {
    const { data: session, status } = useSession();
    
    // Try to get notifications, but handle the case where provider is not available
    let notifications = [];
    let unreadCount = 0;
    let isConnected = false;
    let markAsRead = (id: string) => {};
    let markAllAsRead = () => {};
    
    try {
        // Dynamically import to avoid SSR issues
        const { useNotifications } = require("@/contexts/NotificationContext");
        const notificationsContext = useNotifications();
        notifications = notificationsContext.notifications;
        unreadCount = notificationsContext.unreadCount;
        isConnected = notificationsContext.isConnected;
        markAsRead = notificationsContext.markAsRead;
        markAllAsRead = notificationsContext.markAllAsRead;
    } catch (error) {
        // Notifications not available, use default values
        console.log("Notifications not available in header");
    }

    const handleSignOut = () => {
        signOut({ callbackUrl: "/" });
    };

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
            {/* Connection status indicator */}
            <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-1 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-xs text-muted-foreground">
                {isConnected ? 'Online' : 'Offline'}
                </span>
            </div>
            
            {status === "loading" ? (
                <div>Loading...</div>
            ) : session ? (
                <>
                {/* Notifications */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                        <Badge 
                            variant="destructive" 
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                        >
                            {unreadCount}
                        </Badge>
                        )}
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                    <div className="flex items-center justify-between p-2">
                        <h3 className="font-medium">Notifications</h3>
                        {unreadCount > 0 && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={markAllAsRead}
                            className="text-xs"
                        >
                            Mark all as read
                        </Button>
                        )}
                    </div>
                    <DropdownMenuSeparator />
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground">
                        No notifications
                        </div>
                    ) : (
                        notifications.slice(0, 5).map((notification: { id: Key | null | undefined; message: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; read: any; timestamp: string | number | Date; }) => (
                        <DropdownMenuItem 
                            key={notification.id} 
                            className="flex-col items-start p-4 cursor-pointer"
                            onClick={() => markAsRead(notification.id)}
                        >
                            <div className="flex w-full justify-between">
                            <p className="font-medium">{notification.message}</p>
                            {!notification.read && (
                                <div className="h-2 w-2 bg-primary rounded-full" />
                            )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                            </p>
                        </DropdownMenuItem>
                        ))
                    )}
                    {notifications.length > 5 && (
                        <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-center justify-center">
                            View all notifications
                        </DropdownMenuItem>
                        </>
                    )}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
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
                        <>
                        <DropdownMenuItem asChild>
                            <Link href="/courier/dashboard">Dashboard</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/courier/orders">Manage Orders</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/courier/analytics">Analytics</Link>
                        </DropdownMenuItem>
                        </>
                    )}
                    {session.user.role === "customer" && (
                        <DropdownMenuItem asChild>
                        <Link href="/orders">My Orders</Link>
                        </DropdownMenuItem>
                    )}
                    {session.user.role === "admin" && (
                        <DropdownMenuItem asChild>
                        <Link href="/admin">Admin Panel</Link>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                </>
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

    export function Header() {
    const { data: session } = useSession();

    if (!session) {
        return <HeaderContent />;
    }

    // Only wrap with NotificationProvider if session exists
    const { NotificationProvider } = require("@/contexts/NotificationContext");
    
    return (
        <NotificationProvider userId={session.user.id} role={session.user.role}>
        <HeaderContent />
        </NotificationProvider>
    );
    }