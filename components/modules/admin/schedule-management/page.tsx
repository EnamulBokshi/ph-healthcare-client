import SchedulesTable from './ScheduleTable';
import { getSchedules } from '@/services/schedule.services';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

interface ScheduleManagementParams {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

export default async function ScheduleManagementPage({
  searchParams,
}: ScheduleManagementParams) {
  const queryParamsObject = await searchParams;

  const queryString = Object.keys(queryParamsObject)
    .map((key) => {
      const value = queryParamsObject[key];
      if (Array.isArray(value)) {
        return value
          .map(
            (val) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(val)}`
          )
          .join('&');
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(value ?? '')}`;
    })
    .join('&');

  console.log('Constructed Query String:', queryString);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['schedules', queryParamsObject],
    queryFn: () => getSchedules(queryString),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 6 * 60 * 60 * 1000, // 6 hours
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SchedulesTable queryString={queryString} queryParamsObject={queryParamsObject} />
    </HydrationBoundary>
  );
}
