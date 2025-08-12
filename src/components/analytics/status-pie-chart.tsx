    "use client";

    import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

    interface StatusPieChartProps {
    data: {
        name: string;
        value: number;
        color: string;
    }[];
    }

    export function StatusPieChart({ data }: StatusPieChartProps) {
    return (
        <ResponsiveContainer width="100%" height={300}>
        <PieChart>
            <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
            {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
            </Pie>
            <Tooltip />
            <Legend />
        </PieChart>
        </ResponsiveContainer>
    );
    }