    "use client";

    // import { React } from "react";
    import { NotificationProvider } from "@/contexts/NotificationContext";
    import { useSession } from "next-auth/react";

    interface NotificationsProviderWrapperProps {
    children: React.ReactNode;
    }

    export function NotificationsProviderWrapper({ children }: NotificationsProviderWrapperProps) {
    const { data: session } = useSession();
    
    // Only provide notifications if user is logged in
    if (!session) {
        return <>{children}</>;
    }

    return (
        <NotificationProvider userId={session.user.id} role={session.user.role}>
        {children}
        </NotificationProvider>
    );
    }