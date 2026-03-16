import { PieChartData } from "@/types/dashboard.types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";


import { PieChart, Pie, Legend, ResponsiveContainer, Tooltip, Cell } from "recharts";




interface AppointmentPieChartProps {
    data: PieChartData[];
    title?: string;
    description?: string;
}


const CHART_COLORS = [
    "oklch(0.646 0.222 41.116)", // chart-1 orange
    "oklch(0.646 0.222 231.116)", // chart-2 blue
    "oklch(0.646 0.222 131.116)", // chart-3 green
    "oklch(0.646 0.222 281.116)", // chart-4 purple
    "oklch(0.646 0.222 71.116)" // chart-5 yellow
]




export default function AppointmentPieChart({ data, title, description }: AppointmentPieChartProps) {
    if(!data || !Array.isArray(data)) {
        return (
            <Card className={"border-dashed border-muted col-span-2"}>
                <CardHeader>
                    <CardTitle>{title || "Appointment Status Distribution"}</CardTitle>
                </CardHeader>
                <CardContent className={"flex items-center justify-center h-48"}>
                    <p className="text-muted-foreground">Invalid data format.</p>
                </CardContent>
            </Card>
        )
    }
    const formattedData = data.map((item) => ({
        name: item.status.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, char => char.toUpperCase()),
        value: Number(item.count) || 0,
    }));

    const totalValue = formattedData.reduce((sum, item) => sum + item.value, 0);

    if(!formattedData.length || formattedData.every(item => item.value === 0)) {
        return (
            <Card className={"border-dashed border-muted col-span-2"}>
                <CardHeader>
                    <CardTitle>{title || "Appointment Status Distribution"}</CardTitle>
                </CardHeader>
                <CardContent className={"flex items-center justify-center h-48"}>
                    <p className="text-muted-foreground">No appointment data available.</p>
                </CardContent>
            </Card>
        )
    }
  return (
    <Card className={"col-span-2"}>
      <CardHeader>
        <CardTitle>{title || "Appointment Status Distribution"}</CardTitle>
        <CardDescription>{description || "Distribution of appointments by status"}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                data={formattedData}
                cx={'50%'}
                cy={'50%'}
                innerRadius={55}
                outerRadius={90}
                cornerRadius={6}
                strokeWidth={0}
                paddingAngle={formattedData.length > 1 ? 2 : 0}
                fill="#8884d8"
                isAnimationActive
                animationDuration={600}
                labelLine={false}
                label={({ percent }) => (percent && percent >= 0.05 ? `${(percent * 100).toFixed(0)}%` : "")}
                dataKey={"value"}
                >
                    {
                        formattedData.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`}
                                fill={CHART_COLORS[index % CHART_COLORS.length]} 
                            />  
                        ))
                    }
                </Pie>
                                <Tooltip formatter={(value) => [Number(value ?? 0), "Appointments"]} />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
                <p className="mt-2 text-center text-sm text-muted-foreground">Total: {totalValue} appointments</p>
      </CardContent>
    </Card>
  ) 
}
