"use client";

import DataTable from "@/components/shared/DataTable";
import useUrlDataTableControls from "@/components/shared/data-table/useUrlDataTableControls";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { getMyDoctorSchedules, createMyDoctorSchedule, deleteMyDoctorSchedule } from "@/services/doctor-schedule.services";
import { getSchedules } from "@/services/schedule.services";
import { IDoctorSchedule } from "@/types/doctor-schedule.types";
import { ISchedule } from "@/types/schedule.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

interface DoctorScheduleManagementProps {
  queryString: string;
  queryParamsObject: {
    [key: string]: string | string[] | undefined;
  };
}

const formatDateTime = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
};

export default function DoctorScheduleManagement({
  queryString,
  queryParamsObject,
}: DoctorScheduleManagementProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedScheduleIds, setSelectedScheduleIds] = useState<string[]>([]);
  const [scheduleToDelete, setScheduleToDelete] = useState<IDoctorSchedule | null>(
    null,
  );

  const {
    isNavigationPending,
    sortingState,
    paginationState,
    searchTermState,
    optimisticSorting,
    optimisticPagination,
    optimisticSearchTerm,
    handleSortingChange,
    handlePaginationChange,
    handleSearchChange,
  } = useUrlDataTableControls({
    queryParamsObject,
    searchParams,
    pathname,
    router,
    defaultPageSize: 10,
  });

  const { data: mySchedulesData, isLoading: isMySchedulesLoading, isFetching: isMySchedulesFetching } =
    useQuery({
      queryKey: ["my-doctor-schedules", queryParamsObject],
      queryFn: () => getMyDoctorSchedules(queryString),
      placeholderData: (previousData) => previousData,
    });

  const { data: schedulesData, isLoading: isAvailableSchedulesLoading } = useQuery({
    queryKey: ["available-schedules-pool"],
    queryFn: () =>
      getSchedules("sortBy=startDateTime&sortOrder=asc&limit=200&page=1"),
    staleTime: 60 * 1000,
  });

  const { mutateAsync: createMyDoctorScheduleMutation, isPending: isBookingSchedules } =
    useMutation({
      mutationFn: createMyDoctorSchedule,
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["my-doctor-schedules"] });
        await queryClient.invalidateQueries({ queryKey: ["available-schedules-pool"] });
      },
    });

  const { mutateAsync: deleteMyDoctorScheduleMutation, isPending: isDeletingSchedule } =
    useMutation({
      mutationFn: deleteMyDoctorSchedule,
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["my-doctor-schedules"] });
        await queryClient.invalidateQueries({ queryKey: ["available-schedules-pool"] });
      },
    });

  const mySchedules = mySchedulesData?.data ?? [];
  const totalItems = mySchedulesData?.meta?.total ?? 0;
  const totalPages = mySchedulesData?.meta?.totalPages ?? 1;
  const availablePool = schedulesData?.data ?? [];

  const bookableSchedules = useMemo(() => {
    const now = Date.now();
    const myScheduleIds = new Set(mySchedules.map((item) => item.scheduleId));

    return availablePool.filter((slot: ISchedule) => {
      const start = new Date(slot.startDateTime).getTime();
      const end = new Date(slot.endDateTime).getTime();
      const isFuture = Number.isFinite(start) && Number.isFinite(end) && end > now;
      const hasAnyDoctorAssignment =
        Array.isArray(slot.doctorSchedules) && slot.doctorSchedules.length > 0;
      const alreadyInMySchedules = myScheduleIds.has(slot.id);
      return isFuture && !hasAnyDoctorAssignment && !alreadyInMySchedules;
    });
  }, [availablePool, mySchedules]);

  const bookableScheduleIdSet = useMemo(
    () => new Set(bookableSchedules.map((slot) => slot.id)),
    [bookableSchedules],
  );

  const toggleSelectedSchedule = (scheduleId: string) => {
    if (!bookableScheduleIdSet.has(scheduleId)) {
      toast.error("Only available future schedules can be booked");
      return;
    }

    setSelectedScheduleIds((prev) =>
      prev.includes(scheduleId)
        ? prev.filter((id) => id !== scheduleId)
        : [...prev, scheduleId],
    );
  };

  const handleBookSelectedSchedules = async () => {
    const validScheduleIds = selectedScheduleIds.filter((id) =>
      bookableScheduleIdSet.has(id),
    );

    if (validScheduleIds.length === 0) {
      toast.error("Please select at least one available future schedule");
      return;
    }

    try {
      await createMyDoctorScheduleMutation({ scheduleIds: validScheduleIds });
      toast.success("Schedules booked successfully");
      setSelectedScheduleIds([]);
    } catch (error: unknown) {
      const candidate = error as { response?: { data?: { message?: string } } };
      toast.error(candidate?.response?.data?.message || "Failed to book schedules");
    }
  };

  const handleDeleteMySchedule = (row: IDoctorSchedule) => {
    if (row.isBooked) {
      toast.error("This schedule is already booked by an appointment and cannot be removed");
      return;
    }
    setScheduleToDelete(row);
  };

  const handleConfirmDelete = async () => {
    if (!scheduleToDelete?.scheduleId) {
      toast.error("Missing schedule id");
      return;
    }

    try {
      await deleteMyDoctorScheduleMutation(scheduleToDelete.scheduleId);
      toast.success("Schedule removed successfully");
      setScheduleToDelete(null);
    } catch (error: unknown) {
      const candidate = error as { response?: { data?: { message?: string } } };
      toast.error(candidate?.response?.data?.message || "Failed to remove schedule");
    }
  };

  const myScheduleColumns: ColumnDef<IDoctorSchedule>[] = [
    {
      id: "startDateTime",
      header: "Start",
      cell: ({ row }) => formatDateTime(row.original.schedule?.startDateTime),
    },
    {
      id: "endDateTime",
      header: "End",
      cell: ({ row }) => formatDateTime(row.original.schedule?.endDateTime),
    },
    {
      accessorKey: "isBooked",
      header: "Status",
      cell: ({ row }) => {
        if (row.original.isBooked) {
          return <Badge variant="destructive">Booked</Badge>;
        }

        const endDateTime = row.original.schedule?.endDateTime;
        const endTimeMs = endDateTime ? new Date(endDateTime).getTime() : NaN;
        const isExpired = Number.isFinite(endTimeMs) && endTimeMs <= Date.now();

        if (isExpired) {
          return <Badge variant="outline">Expired</Badge>;
        }

        return <Badge variant="secondary">Available</Badge>;
      },
    },
  ];

  const activeSortingState = optimisticSorting ?? sortingState;
  const activePaginationState = optimisticPagination ?? paginationState;
  const activeSearchTerm = optimisticSearchTerm ?? searchTermState;
  const showMyScheduleLoading =
    isMySchedulesLoading || isMySchedulesFetching || isNavigationPending;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Book Available Schedules</CardTitle>
          <p className="text-sm text-muted-foreground">
            Only future and unassigned schedules are listed below.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {isAvailableSchedulesLoading ? (
            <p className="text-sm text-muted-foreground">Loading schedules...</p>
          ) : bookableSchedules.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No future available schedules found.
            </p>
          ) : (
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {bookableSchedules.map((slot) => {
                const isChecked = selectedScheduleIds.includes(slot.id);

                return (
                  <label
                    key={slot.id}
                    className="flex cursor-pointer items-start gap-2 rounded-lg border p-3"
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => toggleSelectedSchedule(slot.id)}
                    />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {formatDateTime(slot.startDateTime)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        to {formatDateTime(slot.endDateTime)}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-between border-t pt-3">
            <p className="text-sm text-muted-foreground">
              Selected: {selectedScheduleIds.length}
            </p>
            <Button
              disabled={selectedScheduleIds.length === 0 || isBookingSchedules}
              onClick={handleBookSelectedSchedules}
            >
              {isBookingSchedules ? "Booking..." : "Book Selected Schedules"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Schedules</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable<IDoctorSchedule>
            data={mySchedules}
            columns={myScheduleColumns}
            isLoading={showMyScheduleLoading}
            emptyMessage="No schedules booked yet."
            search={{
              value: activeSearchTerm,
              onSearchChange: handleSearchChange,
              placeholder: "Search by schedule id...",
              debounceMs: 700,
            }}
            sorting={{
              state: activeSortingState,
              onSortingChange: handleSortingChange,
            }}
            pagination={{
              state: activePaginationState,
              pageCount: totalPages,
              totalItems,
              onPaginationChange: handlePaginationChange,
            }}
            actions={{
              onDelete: handleDeleteMySchedule,
            }}
          />
        </CardContent>
      </Card>

      <AlertDialog
        open={Boolean(scheduleToDelete)}
        onOpenChange={(open) => {
          if (!open && !isDeletingSchedule) {
            setScheduleToDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Schedule?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the schedule from your availability list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingSchedule}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeletingSchedule}
              onClick={handleConfirmDelete}
            >
              {isDeletingSchedule ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
