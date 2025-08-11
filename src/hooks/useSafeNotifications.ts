    "use client";

    import { useContext } from "react";
    import { NotificationContext } from "@/contexts/NotificationContext";

    export function useSafeNotifications() {
    try {
        const context = useContext(NotificationContext);
        if (!context) {
        // Return default values if context is not available
        return {
            notifications: [],
            unreadCount: 0,
            markAsRead: () => {},
            markAllAsRead: () => {},
            socket: null,
            isConnected: false
        };
        }
        return context;
    } catch (error) {
        // Return default values if there's an error
        return {
        notifications: [],
        unreadCount: 0,
        markAsRead: () => {},
        markAllAsRead: () => {},
        socket: null,
        isConnected: false
        };
    }
    }