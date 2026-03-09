import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import { getDoctors } from "./_action";
import DoctorsList from "@/components/modules/consultation/DoctorsList";

export default async function ConsultationPage() {
  const queryClient = new QueryClient();
  
  await queryClient.prefetchQuery({
    queryKey: ['doctors'],
    queryFn: getDoctors,
  })
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DoctorsList />
    </HydrationBoundary>
  )
}
