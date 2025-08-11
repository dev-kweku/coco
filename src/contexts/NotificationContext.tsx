    "use client";

    import React, { createContext, useContext, useEffect, useState } from "react";
    import { io, Socket } from "socket.io-client";
    import { useSocketInitialization } from "@/hooks/useSocketInitialization";

    interface Notification {
    id: string;
    type: "order" | "review" | "system";
    message: string;
    timestamp: Date;
    read: boolean;
    data?: any;
    }

    interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    socket: Socket | null;
    isConnected: boolean;
    }

    export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

    export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotifications must be used within a NotificationProvider");
    }
    return context;
    };

    interface NotificationProviderProps {
    children: React.ReactNode;
    userId: string;
    role: string;
    }

    export const NotificationProvider: React.FC<NotificationProviderProps> = ({ 
    children, 
    userId, 
    role 
    }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useSocketInitialization();

    useEffect(() => {
        // Initialize socket connection
        const socketInstance = io(process.env.NEXT_PUBLIC_SITE_URL || "", {
        path: "/api/socket",
        });

        setSocket(socketInstance);

        socketInstance.on("connect", () => {
        console.log("Socket connected");
        setIsConnected(true);
        
        // Join appropriate room based on role
        const room = role === "courier" ? `courier-${userId}` : `customer-${userId}`;
        socketInstance.emit("join-room", room);
        });

        socketInstance.on("disconnect", () => {
        console.log("Socket disconnected");
        setIsConnected(false);
        });

        // Listen for order updates
        socketInstance.on("order-updated", (data) => {
        setNotifications(prev => [{
            id: `order-${Date.now()}`,
            type: "order",
            message: `Order status updated to ${data.status}`,
            timestamp: new Date(),
            read: false,
            data
        }, ...prev]);
        });

        // Listen for new orders (for couriers)
        if (role === "courier") {
        socketInstance.on("new-order-received", (data) => {
            setNotifications(prev => [{
            id: `new-order-${Date.now()}`,
            type: "order",
            message: "New order received!",
            timestamp: new Date(),
            read: false,
            data
            }, ...prev]);
        });
        }

        return () => {
        socketInstance.disconnect();
        };
    }, [userId, role]);

    const markAsRead = (id: string) => {
        setNotifications(prev => 
        prev.map(notif => 
            notif.id === id ? { ...notif, read: true } : notif
        )
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        socket,
        isConnected
        }}>
        {children}
        </NotificationContext.Provider>
    );
    };