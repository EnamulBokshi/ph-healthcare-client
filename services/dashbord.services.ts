"use server"

import { httpClient } from "@/lib/axios/httpClient";
import { IAdminDashboardData } from "@/types/dashboard.types";

export async function getDashboardData(){ 

    try{
        const response = await httpClient.get<IAdminDashboardData>("/dashboard-stats");
        return response;
    }catch(error: any){
        console.error("get dashboard error: ", error);
        return {
            success:false,
            message: error?.response?.data?.message || "Failed to fetch dashboard data",
            data: null,
            meta: null
        }
    }
}