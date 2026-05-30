  "use client";

  import { useEffect, useMemo, useState } from "react";
  import { usePathname, useRouter, useSearchParams } from "next/navigation";
  import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
  import {
    ColumnDef,
  } from "@tanstack/react-table";
  import { toast } from "sonner";

  import useUrlDataTableControls from "@/components/shared/data-table/useUrlDataTableControls";
  import DataTable from "@/components/shared/DataTable";
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog";
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  import {
    deleteSchedule,
    getSchedules,
  } from "@/services/schedule.services";
  import { ISchedule } from "@/types/schedule.types";
  import CreateScheduleModal from "./CreateScheduleModal";
  import ScheduleDetailsModal from "./ScheduleDetailsModal";
  import UpdateScheduleModal from "./UpdateScheduleModal";

  interface SchedulesTableProps {
    queryString: string;
    queryParamsObject: {
      [key: string]: string | string[] | undefined;
    };
  }

  interface ScheduleFilterState {
    searchTerm: string;
  }

  const getDefaultScheduleFilters = (): ScheduleFilterState => ({
    searchTerm: "",
  });

  const SchedulesTable = ({ queryString, queryParamsObject }: SchedulesTableProps) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [optimisticFilters, setOptimisticFilters] =
      useState<ScheduleFilterState | null>(null);
    const [selectedScheduleForView, setSelectedScheduleForView] =
      useState<ISchedule | null>(null);
    const [selectedSchedule, setSelectedSchedule] = useState<ISchedule | null>(null);
    const [scheduleToDelete, setScheduleToDelete] = useState<ISchedule | null>(null);

    const { data, isLoading, isFetching } = useQuery({
      queryKey: ["schedules", queryParamsObject],
      queryFn: () => getSchedules(queryString),
      placeholderData: (previousData) => previousData,
    });

    const { mutateAsync: deleteScheduleMutation, isPending: isDeletingSchedule } =
      useMutation({
        mutationFn: deleteSchedule,
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ["schedules"] });
        },
      });

    const {
      isNavigationPending,
      sortingState,
      paginationState,
      searchTermState,
      optimisticSorting,
      optimisticPagination,
      optimisticSearchTerm,
      setOptimisticPagination,
      handleSortingChange,
      handlePaginationChange,
      handleSearchChange,
    } = useUrlDataTableControls({
      queryParamsObject,
      searchParams,
      pathname,
      router,
      serverPage: data?.meta?.page,
      serverLimit: data?.meta?.limit,
      defaultPageSize: 10,
    });

    const filterState = useMemo<ScheduleFilterState>(() => {
      const base = getDefaultScheduleFilters();

      return {
        ...base,
        searchTerm: String(
          Array.isArray(queryParamsObject.search)
            ? queryParamsObject.search[0]
            : queryParamsObject.search ?? ""
        ),
      };
    }, [queryParamsObject]);

    useEffect(() => {
      setOptimisticFilters(null);
    }, [filterState]);

    const handleApplyFilters = () => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", "1");
      params.set("limit", String(paginationState.pageSize));

      const nextQuery = params.toString();
      setOptimisticPagination((prev: any) => ({
        pageIndex: 0,
        pageSize: prev?.pageSize ?? paginationState.pageSize,
      }));

      router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
    };

    const handleClearFilters = () => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", "1");
      params.set("limit", String(paginationState.pageSize));

      const nextQuery = params.toString();
      setOptimisticPagination((prev: any) => ({
        pageIndex: 0,
        pageSize: prev?.pageSize ?? paginationState.pageSize,
      }));

      router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
    };

    const schedules = data?.data || [];
    const totalItems = data?.meta?.total ?? 0;
    const totalPages = data?.meta?.totalPages ?? 1;

    const handleView = (schedule: ISchedule) => {
      setSelectedScheduleForView(schedule);
    };

    const handleEdit = (schedule: ISchedule) => {
      setSelectedSchedule(schedule);
    };

    const handleDelete = (schedule: ISchedule) => {
      setScheduleToDelete(schedule);
    };

    const getApiErrorMessage = (error: unknown, fallback: string) => {
      const candidate = error as {
        response?: { data?: { message?: string } };
      };
      return candidate?.response?.data?.message || fallback;
    };

    const handleConfirmDelete = async () => {
      if (!scheduleToDelete?.id) {
        toast.error("Unable to delete schedule");
        return;
      }

      try {
        await deleteScheduleMutation(scheduleToDelete.id);
        toast.success("Schedule deleted successfully");
        setScheduleToDelete(null);
      } catch (error: unknown) {
        toast.error(getApiErrorMessage(error, "Failed to delete schedule"));
      }
    };

    const scheduleColumns: ColumnDef<ISchedule>[] = [
      {
        accessorKey: "startDateTime",
        header: "Start Date Time",
        cell: ({ row }) => {
          return new Date(row.original.startDateTime).toLocaleString();
        },
      },
      {
        accessorKey: "endDateTime",
        header: "End Date Time",
        cell: ({ row }) => {
          return new Date(row.original.endDateTime).toLocaleString();
        },
      },
    ];

    const activeSortingState = optimisticSorting ?? sortingState;
    const activePaginationState = optimisticPagination ?? paginationState;
    const activeSearchTerm = optimisticSearchTerm ?? searchTermState;
    const showLoadingState = isLoading || isFetching || isNavigationPending;

    return (
      <Card>
        <CardHeader>
          <CardTitle>Schedule Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <CreateScheduleModal />
          </div>

          <DataTable<ISchedule>
            data={schedules}
            columns={scheduleColumns}
            isLoading={showLoadingState}
            emptyMessage="No schedules found."
            search={{
              value: activeSearchTerm,
              onSearchChange: handleSearchChange,
              placeholder: "Search schedules...",
              debounceMs: 700,
            }}
            pagination={{
              state: activePaginationState,
              pageCount: totalPages,
              totalItems: totalItems,
              onPaginationChange: handlePaginationChange,
            }}
            sorting={{
              state: activeSortingState,
              onSortingChange: handleSortingChange,
            }}
            actions={{
              onView: handleView,
              onEdit: handleEdit,
              onDelete: handleDelete,
            }}
          />

          <UpdateScheduleModal
            schedule={selectedSchedule}
            onClose={() => setSelectedSchedule(null)}
          />

          <ScheduleDetailsModal
            schedule={selectedScheduleForView}
            onClose={() => setSelectedScheduleForView(null)}
          />

          <AlertDialog open={Boolean(scheduleToDelete)}>
            <AlertDialogContent>
              <AlertDialogTitle>Delete Schedule</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this schedule? This action cannot
                be undone.
              </AlertDialogDescription>
              <div className="flex justify-end gap-2">
                <AlertDialogCancel onClick={() => setScheduleToDelete(null)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDelete}
                  disabled={isDeletingSchedule}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  {isDeletingSchedule ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    );
  };

  export default SchedulesTable;
