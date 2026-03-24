import DoctorsTable from '@/components/modules/admin/Doctor-management/DoctorTable';
import { getDoctors } from '@/services/doctor.services';
import { getSpecialties } from '@/services/specialty.services';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

interface  DoctorManagementParams  {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;}>
}


export default async function DoctorManagementPage({ searchParams }: DoctorManagementParams) {
  const queryParamsObject = await searchParams;

  const queryString = Object.keys(queryParamsObject).map(key => {
    const value = queryParamsObject[key];
    if (Array.isArray(value)) {
      return value.map(val => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`).join('&');
    }
    return `${encodeURIComponent(key)}=${encodeURIComponent(value ?? '')}`;
  }).join('&');
  
  console.log('Constructed Query String:', queryString);
  const queryClient = new QueryClient();
   
   await queryClient.prefetchQuery({
     queryKey: ['doctors', queryParamsObject],
     queryFn: () => getDoctors(queryString),
     staleTime: 60*60*1000, // 1 hour
      gcTime: 6*60*60*1000, // 5 minutes
   })

   await queryClient.prefetchQuery({
     queryKey: ['specialties'],
     queryFn: getSpecialties,
     staleTime: 60 * 60 * 1000,
     gcTime: 6 * 60 * 60 * 1000,
   })
 


  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DoctorsTable queryString={queryString} queryParamsObject={queryParamsObject}/>
      </HydrationBoundary>
  )
}
