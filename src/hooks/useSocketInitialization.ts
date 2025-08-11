    "use client";

    import { useEffect } from "react";

    export const useSocketInitialization = () => {
    useEffect(() => {
        // Initialize socket connection on the client side
        const initializeSocket = async () => {
        try {
            await fetch("/api/socket", {
            method: "POST",
            });
        } catch (error) {
            console.error("Failed to initialize socket:", error);
        }
        };

        // Initialize socket when component mounts
        initializeSocket();

        // Re-initialize socket when page becomes visible again
        const handleVisibilityChange = () => {
        if (document.visibilityState === "visible") {
            initializeSocket();
        }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);
    };