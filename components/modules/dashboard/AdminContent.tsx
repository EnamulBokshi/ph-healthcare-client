"use client"

import AppointmentBarChart from "@/components/shared/AppointmentBarChart";
import AppointmentPieChart from "@/components/shared/AppointmentPieChart";
import StatsCard from "@/components/shared/StatsCard";
import { getDashboardData } from "@/services/dashbord.services"
import { ApiResponse } from "@/types/api.types";
import { IAdminDashboardData } from "@/types/dashboard.types";
import { useQuery } from "@tanstack/react-query"

function AdminContent() {
    const {data:adminDashboardData} = useQuery({
         queryKey: ["admin-dashboard-data"],
            queryFn: getDashboardData,
            refetchOnWindowFocus: true,
    })
const data = adminDashboardData as ApiResponse<IAdminDashboardData>;
const dashboardData = data?.data;
const barData = (dashboardData?.barChartData ?? (dashboardData as IAdminDashboardData & { barChatData?: IAdminDashboardData["barChartData"] })?.barChatData) || [];
const pieData = dashboardData?.pieChartData || [];

  return (
    <div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> 
         <StatsCard 
        title="Total Appointments"
        value={data?.data?.appointmentCount}
        iconName="CalendarCheck"
        description="Number of appointments scheduled"
        />
        <StatsCard 
        title="Total Patients"
        value={data?.data?.patientCount}
        iconName="Users"
        description="Number of registered patients"
        />
         <StatsCard 
        title="Total Doctors"
        value={data?.data?.doctorCount}
        iconName="UserCheck"
        description="Number of registered doctors"
        />
         <StatsCard 
        title="Total Admins"
        value={data?.data?.adminCount}
        iconName="UserShield"
        description="Number of registered admins"
        />
         <StatsCard 
        title="Total Super Admins"
        value={data?.data?.superAdminCount}
        iconName="UserStar"
        description="Number of registered super admins"
        />
         <StatsCard 
        title="Total Payments"
        value={data?.data?.paymentCount}
        iconName="CreditCard"
        description="Number of payments processed"
        />
         <StatsCard 
        title="Total Revenue"
        value={`$${Number(dashboardData?.totalRevenue || 0).toFixed(2)}`}
        iconName="DollarSign"
        description="Total revenue generated from appointments"
         />
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <AppointmentBarChart data={barData} />
        <AppointmentPieChart data={pieData} />
       </div>
    </div>
  )
}

export default AdminContent