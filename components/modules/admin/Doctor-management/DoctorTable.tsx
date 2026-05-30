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

import { deleteDoctor, getDoctors } from "@/services/doctor.services";
import { getSpecialties } from "@/services/specialty.services";
import { IDoctor } from "@/types/doctor.types";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";


import { doctorColumns } from "./doctorColumn";
import DoctorFilters, {
  DoctorFilterState,
  getDefaultDoctorFilters,
} from "./DoctorFilters";
import CreateDoctorModal from "./CreateDoctorModal";
import DoctorDetailsModal from "./DoctorDetailsModal";
import UpdateDoctorModal from "./UpdateDoctorModal";

interface DoctorsTableProps {
  queryString: string;
  queryParamsObject: {
    [key: string]: string | string[] | undefined;
  }
}

const DoctorsTable = ({ queryString, queryParamsObject }: DoctorsTableProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [optimisticFilters, setOptimisticFilters] =
    useState<DoctorFilterState | null>(null);
  const [selectedDoctorForView, setSelectedDoctorForView] =
    useState<IDoctor | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<IDoctor | null>(null);
  const [doctorToDelete, setDoctorToDelete] = useState<IDoctor | null>(null);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["doctors", queryParamsObject],
    queryFn: () => getDoctors(queryString),
    // Keep previous rows rendered while next sorting result is loading.
    placeholderData: (previousData) => previousData,
  });

  const { data: specialtiesData } = useQuery({
    queryKey: ["specialties"],
    queryFn: getSpecialties,
    staleTime: 60 * 60 * 1000,
  });

  const { mutateAsync: deleteDoctorMutation, isPending: isDeletingDoctor } =
    useMutation({
      mutationFn: deleteDoctor,
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["doctors"] });
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

  const filterState = useMemo<DoctorFilterState>(() => {
    const base = getDefaultDoctorFilters();

    const rawGender = queryParamsObject.gender;
    const rawSpecialtyByTitle =
      queryParamsObject["specialties.specialty.title"];
    const rawSpecialtyLegacy = queryParamsObject.specialty;

    const pick = (value: string | string[] | undefined) =>
      Array.isArray(value) ? value[0] : value;

    const toArray = (value: string | string[] | undefined) => {
      if (Array.isArray(value)) return value.filter(Boolean);
      if (!value) return [];
      return [value];
    };

    return {
      ...base,
      gender: String(pick(rawGender) ?? ""),
      specialties:
        toArray(rawSpecialtyByTitle).length > 0
          ? toArray(rawSpecialtyByTitle)
          : toArray(rawSpecialtyLegacy),
      experience: {
        exact: String(pick(queryParamsObject.experience) ?? ""),
        lowerOperator:
          (queryParamsObject["experience[gt]"] ? "gt" : "gte") as
            | "gt"
            | "gte",
        lowerValue: String(
          pick(
            queryParamsObject["experience[gt]"] ??
              queryParamsObject["experience[gte]"],
          ) ?? "",
        ),
        upperOperator:
          (queryParamsObject["experience[lt]"] ? "lt" : "lte") as
            | "lt"
            | "lte",
        upperValue: String(
          pick(
            queryParamsObject["experience[lt]"] ??
              queryParamsObject["experience[lte]"],
          ) ?? "",
        ),
      },
      appointmentFee: {
        exact: String(pick(queryParamsObject.appointmentFee) ?? ""),
        lowerOperator:
          (queryParamsObject["appointmentFee[gt]"] ? "gt" : "gte") as
            | "gt"
            | "gte",
        lowerValue: String(
          pick(
            queryParamsObject["appointmentFee[gt]"] ??
              queryParamsObject["appointmentFee[gte]"],
          ) ?? "",
        ),
        upperOperator:
          (queryParamsObject["appointmentFee[lt]"] ? "lt" : "lte") as
            | "lt"
            | "lte",
        upperValue: String(
          pick(
            queryParamsObject["appointmentFee[lt]"] ??
              queryParamsObject["appointmentFee[lte]"],
          ) ?? "",
        ),
      },
    };
  }, [queryParamsObject]);

  useEffect(() => {
    // Once URL-synced filters arrive from server props, clear optimistic override.
    setOptimisticFilters(null);
  }, [filterState]);

  const clearFilterParams = (params: URLSearchParams) => {
    params.delete("gender");
    params.delete("specialties.specialty.title");
    params.delete("specialty");
    params.delete("experience");
    params.delete("experience[gt]");
    params.delete("experience[gte]");
    params.delete("experience[lt]");
    params.delete("experience[lte]");
    params.delete("appointmentFee");
    params.delete("appointmentFee[gt]");
    params.delete("appointmentFee[gte]");
    params.delete("appointmentFee[lt]");
    params.delete("appointmentFee[lte]");
  };

  const applyFiltersToParams = (
    params: URLSearchParams,
    nextFilters: DoctorFilterState,
  ) => {
    clearFilterParams(params);

    if (nextFilters.gender) {
      params.set("gender", nextFilters.gender);
    }

    nextFilters.specialties.forEach((specialtyTitle) => {
      if (specialtyTitle) {
        params.append("specialties.specialty.title", specialtyTitle);
      }
    });

    if (nextFilters.experience.exact) {
      params.set("experience", nextFilters.experience.exact);
    }
    if (nextFilters.experience.lowerValue) {
      params.set(
        `experience[${nextFilters.experience.lowerOperator}]`,
        nextFilters.experience.lowerValue,
      );
    }
    if (nextFilters.experience.upperValue) {
      params.set(
        `experience[${nextFilters.experience.upperOperator}]`,
        nextFilters.experience.upperValue,
      );
    }

    if (nextFilters.appointmentFee.exact) {
      params.set("appointmentFee", nextFilters.appointmentFee.exact);
    }
    if (nextFilters.appointmentFee.lowerValue) {
      params.set(
        `appointmentFee[${nextFilters.appointmentFee.lowerOperator}]`,
        nextFilters.appointmentFee.lowerValue,
      );
    }
    if (nextFilters.appointmentFee.upperValue) {
      params.set(
        `appointmentFee[${nextFilters.appointmentFee.upperOperator}]`,
        nextFilters.appointmentFee.upperValue,
      );
    }
  };

  const handleApplyFilters = (nextFilters: DoctorFilterState) => {
    setOptimisticFilters(nextFilters);
    setOptimisticPagination((prev) => ({
      pageIndex: 0,
      pageSize: prev?.pageSize ?? paginationState.pageSize,
    }));

    const params = new URLSearchParams(searchParams.toString());
    applyFiltersToParams(params, nextFilters);

    params.set("page", "1");
    params.set("limit", String(paginationState.pageSize));

    const nextQuery = params.toString();
    setOptimisticPagination((prev) => ({
      pageIndex: 0,
      pageSize: prev?.pageSize ?? paginationState.pageSize,
    }));

    router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  };

  const handleClearFilters = () => {
    const reset = getDefaultDoctorFilters();
    setOptimisticFilters(reset);
    setOptimisticPagination((prev) => ({
      pageIndex: 0,
      pageSize: prev?.pageSize ?? paginationState.pageSize,
    }));

    const params = new URLSearchParams(searchParams.toString());
    clearFilterParams(params);

    params.set("page", "1");
    params.set("limit", String(paginationState.pageSize));

    const nextQuery = params.toString();
    setOptimisticPagination((prev) => ({
      pageIndex: 0,
      pageSize: prev?.pageSize ?? paginationState.pageSize,
    }));

    router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  };

  // const doctorColumns: ColumnDef<IDoctor>[] = [
  //   { accessorKey: "name", header: "Name" },
  //   // { accessorKey: "specialization", header: "Specialization" },
  //   { accessorKey: "experience", header: "Experience" },
  //   // { accessorKey: "rating", header: "Rating" },
  // ];

  const doctors = data?.data || [];
  const totalItems = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;
  const specialties = specialtiesData?.data || [];

const handleView = (doctor: IDoctor) => {
  setSelectedDoctorForView(doctor);
}
const handleEdit = (doctor: IDoctor) => {
  setSelectedDoctor(doctor);
}
const handleDelete = (doctor: IDoctor) => {
  setDoctorToDelete(doctor);
}

const getApiErrorMessage = (error: unknown, fallback: string) => {
  const candidate = error as { response?: { data?: { message?: string } } };
  return candidate?.response?.data?.message || fallback;
};

const handleConfirmDelete = async () => {
  if (!doctorToDelete?.id) {
    toast.error("Unable to delete doctor: missing doctor id");
    return;
  }

  try {
    const result = await deleteDoctorMutation(String(doctorToDelete.id));

    if (!result?.success) {
      toast.error(result?.message || "Failed to delete doctor");
      return;
    }

    toast.success(result?.message || "Doctor deleted successfully");
    setDoctorToDelete(null);
  } catch (error: unknown) {
    toast.error(getApiErrorMessage(error, "Failed to delete doctor"));
  }
};

  const activeSortingState = optimisticSorting ?? sortingState;
  const activePaginationState = optimisticPagination ?? paginationState;
  const activeSearchTerm = optimisticSearchTerm ?? searchTermState;
  const activeFilters = optimisticFilters ?? filterState;
  const showLoadingState = isLoading || isFetching || isNavigationPending;

  return (
    <div className="space-y-3">
    <DataTable 
      data={doctors}
      columns={doctorColumns}
      isLoading={showLoadingState}
      emptyMessage="No doctors found."
      search={{
        value: activeSearchTerm,
        onSearchChange: handleSearchChange,
        placeholder: "Search doctors by name, email, contact...",
        debounceMs: 700,
      }}
      filters={
        <DoctorFilters
          value={activeFilters}
          specialties={specialties}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
          onDebouncedChange={setOptimisticFilters}
          debounceMs={700}
        />
      }
      sorting={{ state: activeSortingState, onSortingChange: handleSortingChange }}
      pagination={{
        state: activePaginationState,
        pageCount: totalPages,
        totalItems,
        pageSizeOptions: [1, 10, 20, 50, 100],
        onPaginationChange: handlePaginationChange,
      }}
      actions={
        {
          onDelete: handleDelete,
          onEdit: handleEdit,
          onView: handleView
        }
      }

    />

      <UpdateDoctorModal
        open={Boolean(selectedDoctor)}
        doctor={selectedDoctor}
        specialties={specialties}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedDoctor(null);
          }
        }}
      />

      <DoctorDetailsModal
        open={Boolean(selectedDoctorForView)}
        doctorId={selectedDoctorForView ? String(selectedDoctorForView.id) : null}
        fallbackDoctor={selectedDoctorForView}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedDoctorForView(null);
          }
        }}
      />

      <AlertDialog
        open={Boolean(doctorToDelete)}
        onOpenChange={(open) => {
          if (!open && !isDeletingDoctor) {
            setDoctorToDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Doctor?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Are you sure you want to delete
              {doctorToDelete?.name ? ` Dr. ${doctorToDelete.name}` : " this doctor"}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingDoctor}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeletingDoctor}
              onClick={handleConfirmDelete}
            >
              {isDeletingDoctor ? "Deleting..." : "Yes, Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex justify-end">
        <CreateDoctorModal specialties={specialties} />
      </div>
    </div>
  );
};

export default DoctorsTable;
