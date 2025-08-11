import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Socket.IO types
export interface ServerToClientEvents {
  "order-updated": (data: { orderId: string; status: string; timestamp: Date }) => void;
  "new-order-received": (data: { orderId: string; customerName: string; price: number; timestamp: Date }) => void;
  "new-notification": (notification: any) => void;
}

export interface ClientToServerEvents {
  "join-room": (room: string) => void;
  "order-update": (data: { room: string; orderId: string; status: string }) => void;
  "new-order": (data: { courierId: string; orderId: string; customerName: string; price: number }) => void;
}