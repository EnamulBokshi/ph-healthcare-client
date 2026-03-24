"use client";

import DataTable from "@/components/shared/DataTable";

import { getDoctors } from "@/services/doctor.services";
import { getSpecialties } from "@/services/specialty.services";
import { IDoctor } from "@/types/doctor.types";
import { PaginationState, SortingState } from "@tanstack/react-table";

import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";


import { doctorColumns } from "./doctorColumn";
import DoctorFilters, {
  DoctorFilterState,
  getDefaultDoctorFilters,
} from "./DoctorFilters";

interface DoctorsTableProps {
  queryString: string;
  queryParamsObject: {
    [key: string]: string | string[] | undefined;
  }
}

const DoctorsTable = ({ queryString, queryParamsObject }: DoctorsTableProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [optimisticSorting, setOptimisticSorting] =
    useState<SortingState | null>(null);
  const [optimisticPagination, setOptimisticPagination] =
    useState<PaginationState | null>(null);
  const [optimisticSearchTerm, setOptimisticSearchTerm] =
    useState<string | null>(null);
  const [optimisticFilters, setOptimisticFilters] =
    useState<DoctorFilterState | null>(null);

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

  const sortingState: SortingState = useMemo(() => {
    const rawSortBy = queryParamsObject.sortBy;
    const rawSortOrder = queryParamsObject.sortOrder;

    const sortBy = Array.isArray(rawSortBy) ? rawSortBy[0] : rawSortBy;
    const sortOrder = Array.isArray(rawSortOrder)
      ? rawSortOrder[0]
      : rawSortOrder;

    if (!sortBy) {
      return [];
    }

    return [
      {
        id: sortBy,
        desc: String(sortOrder).toLowerCase() === "desc",
      },
    ];
  }, [queryParamsObject]);

  const paginationState: PaginationState = useMemo(() => {
    const rawPage = queryParamsObject.page;
    const rawLimit = queryParamsObject.limit;
    const serverPage = data?.meta?.page;
    const serverLimit = data?.meta?.limit;

    const page =
      Number(Array.isArray(rawPage) ? rawPage[0] : rawPage) || serverPage || 1;
    const limit =
      Number(Array.isArray(rawLimit) ? rawLimit[0] : rawLimit) ||
      serverLimit ||
      10;

    return {
      pageIndex: Math.max(page - 1, 0),
      pageSize: Math.max(limit, 1),
    };
  }, [queryParamsObject, data?.meta?.page, data?.meta?.limit]);

  const searchTermState = useMemo(() => {
    const rawSearchTerm = queryParamsObject.searchTerm;
    const searchTerm = Array.isArray(rawSearchTerm)
      ? rawSearchTerm[0]
      : rawSearchTerm;

    return String(searchTerm ?? "");
  }, [queryParamsObject]);

  const filterState = useMemo<DoctorFilterState>(() => {
    const base = getDefaultDoctorFilters();

    const rawGender = queryParamsObject.gender;
    const rawSpecialty = queryParamsObject.specialty;

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
      specialties: toArray(rawSpecialty),
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
    // Once URL-synced sorting arrives from server props, clear optimistic override.
    setOptimisticSorting(null);
  }, [sortingState]);

  useEffect(() => {
    // Once URL-synced pagination arrives from server props, clear optimistic override.
    setOptimisticPagination(null);
  }, [paginationState]);

  useEffect(() => {
    // Once URL-synced search arrives from server props, clear optimistic override.
    setOptimisticSearchTerm(null);
  }, [searchTermState]);

  useEffect(() => {
    // Once URL-synced filters arrive from server props, clear optimistic override.
    setOptimisticFilters(null);
  }, [filterState]);

  const handleSortingChange = (state: SortingState) => {
    setOptimisticSorting(state);
    setOptimisticPagination((prev) => ({
      pageIndex: 0,
      pageSize: prev?.pageSize ?? paginationState.pageSize,
    }));

    const params = new URLSearchParams(searchParams.toString());
    const nextSort = state[0];

    if (!nextSort) {
      params.delete("sortBy");
      params.delete("sortOrder");
    } else {
      params.set("sortBy", nextSort.id);
      params.set("sortOrder", nextSort.desc ? "desc" : "asc");
    }
    params.set("page", "1");
    params.set("limit", String(paginationState.pageSize));

    const nextQuery = params.toString();
    startTransition(() => {
      router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
    });
  };

  const handlePaginationChange = (state: PaginationState) => {
    setOptimisticPagination(state);

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(state.pageIndex + 1));
    params.set("limit", String(state.pageSize));

    const nextQuery = params.toString();
    startTransition(() => {
      router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
    });
  };

  const handleSearchChange = (searchTerm: string) => {
    setOptimisticSearchTerm(searchTerm);
    setOptimisticPagination((prev) => ({
      pageIndex: 0,
      pageSize: prev?.pageSize ?? paginationState.pageSize,
    }));

    const params = new URLSearchParams(searchParams.toString());
    const trimmedSearchTerm = searchTerm.trim();

    if (trimmedSearchTerm) {
      params.set("searchTerm", trimmedSearchTerm);
    } else {
      params.delete("searchTerm");
    }

    params.set("page", "1");
    params.set("limit", String(paginationState.pageSize));

    const nextQuery = params.toString();
    startTransition(() => {
      router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
    });
  };

  const clearFilterParams = (params: URLSearchParams) => {
    params.delete("gender");
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

    nextFilters.specialties.forEach((specialtyId) => {
      if (specialtyId) {
        params.append("specialty", specialtyId);
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
    startTransition(() => {
      router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
    });
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
    startTransition(() => {
      router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
    });
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
  // Implement view logic here
  console.log("View doctor:", doctor);
}
const handleEdit = (doctor: IDoctor) => {
  // Implement edit logic here
  console.log("Edit doctor:", doctor);
}
const handleDelete = (doctor: IDoctor) => {
  // Implement delete logic here
  console.log("Delete doctor:", doctor);
}

console.log("Doctors data:", doctors);

  const activeSortingState = optimisticSorting ?? sortingState;
  const activePaginationState = optimisticPagination ?? paginationState;
  const activeSearchTerm = optimisticSearchTerm ?? searchTermState;
  const activeFilters = optimisticFilters ?? filterState;
  const showLoadingState = isLoading || isFetching || isPending;

  return (
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
  );
};

export default DoctorsTable;
