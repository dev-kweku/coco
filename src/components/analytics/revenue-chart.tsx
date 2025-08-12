    "use client";

    import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

    interface RevenueChartProps {
    data: {
        month: string;
        revenue: number;
        orders: number;
    }[];
    }

    export function RevenueChart({ data }: RevenueChartProps) {
    return (
        <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
            formatter={(value: any, name: string) => {
                if (name === "revenue") {
                return [`GHS ${value}`, "Revenue"];
                }
                return [value, name];
            }}
            />
            <Legend />
            <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
            <Bar dataKey="orders" fill="#82ca9d" name="Orders" />
        </BarChart>
        </ResponsiveContainer>
    );
    }