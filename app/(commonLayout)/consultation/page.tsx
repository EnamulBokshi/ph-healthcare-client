import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

import DoctorsList from "@/components/modules/consultation/DoctorsList";
import { getDoctors } from "@/services/doctor.services";
import { getReviews } from "@/services/review.services";
import { getSpecialties } from "@/services/specialty.services";

interface ConsultationPageParams {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

export default async function ConsultationPage({ searchParams }: ConsultationPageParams) {
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
    queryKey: ["consultation-doctors", queryParamsObject],
    queryFn: () => getDoctors(queryString),
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
    queryKey: ["specialties"],
    queryFn: getSpecialties,
    staleTime: 60 * 60 * 1000,
    gcTime: 6 * 60 * 60 * 1000,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DoctorsList queryString={queryString} queryParamsObject={queryParamsObject} />
    </HydrationBoundary>
  );
}
