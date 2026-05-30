import DoctorDetailsView from "@/components/modules/consultation/DoctorDetailsView";
import { getDoctorById } from "@/services/doctor.services";
import { getReviews } from "@/services/review.services";
import { getSchedules } from "@/services/schedule.services";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

interface ConsultingDoctorPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ConsultingDoctorPage({ params }: ConsultingDoctorPageProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["consultation-doctor-details", id],
    queryFn: () => getDoctorById(id),
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  await queryClient.prefetchQuery({
    queryKey: ["consultation-reviews"],
    queryFn: getReviews,
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  await queryClient.prefetchQuery({
    queryKey: ["consultation-schedules"],
    queryFn: () =>
      getSchedules("include=doctorSchedules&sortBy=startDateTime&sortOrder=asc&page=1&limit=800"),
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DoctorDetailsView doctorId={id} />
    </HydrationBoundary>
  );
}
