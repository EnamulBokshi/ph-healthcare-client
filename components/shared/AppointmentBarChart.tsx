import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BarChartData } from "@/types/dashboard.types";



interface AppointmentBarChartProps {
    data: BarChartData[];

}


export default function AppointmentBarChart({ data }: AppointmentBarChartProps) {
    if(!data || !Array.isArray(data)) {
        return (
            <Card className={"border-dashed border-muted col-span-2"}>
                <CardHeader>
                    <CardTitle>{"Monthly Appointments"}</CardTitle>
                </CardHeader>
                <CardContent className={"flex items-center justify-center h-48"}>
                    <p className="text-muted-foreground">Invalid data format.</p>
                </CardContent>
            </Card>
        )
    }

    const formattedData = data.map(item => ({
        month: typeof item.month === "string" ? format(new Date(item.month), "MMM yy") : format(item.month, "MMM yy"),
        appointments: item.count
    }));

        if(!formattedData.length || formattedData.every(item => item.appointments === 0)) {
        return (
            <Card className={"border-dashed border-muted col-span-2"}>
                <CardHeader>
                    <CardTitle>{"Monthly Appointments"}</CardTitle>
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
        <CardTitle>{"Monthly Appointments"}</CardTitle>
        <CardDescription>{ "Number of appointments per month"}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Placeholder for Bar Chart */}
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={formattedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false}/>
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="appointments" fill ="oklch(0.646 0.222 41.116)" radius ={[4,4,0,0]} maxBarSize={60} />
                </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
