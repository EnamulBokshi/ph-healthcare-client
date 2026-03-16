import AdminContent from "@/components/modules/dashboard/AdminContent";
import { getDashboardData } from "@/services/dashbord.services";
import { ApiResponse } from "@/types/api.types";
import { IAdminDashboardData } from "@/types/dashboard.types";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

export default async function AdminDashboardPage() {

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["admin-dashboard-data"],
    queryFn: getDashboardData,
    staleTime: 30*1000, // 30 seconds
    gcTime: 5*60*1000, // 5 minutes
  })

  // const dashboardData = queryClient.getQueryData(["admin-dashboard-data"]) as ApiResponse<IAdminDashboardData>;
  // console.log("dashboardData: ", dashboardData);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminContent />
    </HydrationBoundary>
  )
}
