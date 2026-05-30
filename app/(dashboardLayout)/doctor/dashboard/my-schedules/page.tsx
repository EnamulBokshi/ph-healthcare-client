import DoctorScheduleManagement from "@/components/modules/doctor/shedule-management/DoctorScheduleManagement";
import { getMyDoctorSchedules } from "@/services/doctor-schedule.services";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

interface DoctorMySchedulePageParams {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

export default async function DoctorMySchedulePage({
  searchParams,
}: DoctorMySchedulePageParams) {
  const queryParamsObject = await searchParams;

  const queryString = Object.keys(queryParamsObject)
    .map((key) => {
      const value = queryParamsObject[key];

      if (Array.isArray(value)) {
        return value
          .map((val) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
          .join("&");
      }

      return `${encodeURIComponent(key)}=${encodeURIComponent(value ?? "")}`;
    })
    .join("&");

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["my-doctor-schedules", queryParamsObject],
    queryFn: () => getMyDoctorSchedules(queryString),
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DoctorScheduleManagement
        queryString={queryString}
        queryParamsObject={queryParamsObject}
      />
    </HydrationBoundary>
  );
}
