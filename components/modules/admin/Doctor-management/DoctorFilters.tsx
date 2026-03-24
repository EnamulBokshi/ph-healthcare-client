"use client";

import DataTableFilterPopover from "@/components/shared/data-table/DataTableFilterPopover";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ISpecialty } from "@/types/specialty.types";
import { useEffect, useMemo, useState } from "react";

type LowerRangeOperator = "gt" | "gte";
type UpperRangeOperator = "lt" | "lte";

interface NumericFilterState {
  exact: string;
  lowerOperator: LowerRangeOperator;
  lowerValue: string;
  upperOperator: UpperRangeOperator;
  upperValue: string;
}

export interface DoctorFilterState {
  gender: string;
  specialties: string[];
  experience: NumericFilterState;
  appointmentFee: NumericFilterState;
}

interface DoctorFiltersProps {
  value: DoctorFilterState;
  specialties: ISpecialty[];
  onApply: (value: DoctorFilterState) => void;
  onClear: () => void;
  onDebouncedChange?: (value: DoctorFilterState) => void;
  debounceMs?: number;
}

export const getDefaultDoctorFilters = (): DoctorFilterState => ({
  gender: "",
  specialties: [],
  experience: {
    exact: "",
    lowerOperator: "gte",
    lowerValue: "",
    upperOperator: "lte",
    upperValue: "",
  },
  appointmentFee: {
    exact: "",
    lowerOperator: "gte",
    lowerValue: "",
    upperOperator: "lte",
    upperValue: "",
  },
});

const countActiveFilters = (filters: DoctorFilterState) => {
  let count = 0;

  if (filters.gender) count += 1;
  if (filters.specialties.length > 0) count += 1;

  if (filters.experience.exact) count += 1;
  if (filters.experience.lowerValue) count += 1;
  if (filters.experience.upperValue) count += 1;

  if (filters.appointmentFee.exact) count += 1;
  if (filters.appointmentFee.lowerValue) count += 1;
  if (filters.appointmentFee.upperValue) count += 1;

  return count;
};

export default function DoctorFilters({
  value,
  specialties,
  onApply,
  onClear,
  onDebouncedChange,
  debounceMs,
}: DoctorFiltersProps) {
  const [draft, setDraft] = useState<DoctorFilterState>(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (!onDebouncedChange) return;

    const timeout = setTimeout(() => {
      onDebouncedChange(draft);
    }, debounceMs ?? 700);

    return () => clearTimeout(timeout);
  }, [draft, onDebouncedChange, debounceMs]);

  const activeCount = useMemo(() => countActiveFilters(value), [value]);

  const toggleSpecialty = (specialtyId: string, checked: boolean) => {
    setDraft((prev) => ({
      ...prev,
      specialties: checked
        ? Array.from(new Set([...prev.specialties, specialtyId]))
        : prev.specialties.filter((id) => id !== specialtyId),
    }));
  };

  return (
    <DataTableFilterPopover
      activeCount={activeCount}
      onApply={() => onApply(draft)}
      onClear={() => {
        const reset = getDefaultDoctorFilters();
        setDraft(reset);
        onClear();
      }}
      title="Doctor Filters"
      description="Apply one or more filters to refine doctor results."
    >
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Gender</Label>
          <Select
            value={draft.gender || "all"}
            onValueChange={(value) => {
              setDraft((prev) => ({
                ...prev,
                gender: value && value !== "all" ? value : "",
              }));
            }}
          >
            <SelectTrigger className="w-full" size="sm">
              <SelectValue placeholder="All genders" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="MALE">Male</SelectItem>
              <SelectItem value="FEMALE">Female</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Specialties</Label>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button type="button" variant="outline" size="sm" className="w-full justify-between">
                  <span className="truncate text-left">
                    {draft.specialties.length > 0
                      ? `${draft.specialties.length} selected`
                      : "Select specialties"}
                  </span>
                </Button>
              }
            />
            <DropdownMenuContent align="start" className="w-72">
              <div className="max-h-56 overflow-y-auto">
                {specialties.length === 0 ? (
                  <p className="px-2 py-1 text-sm text-muted-foreground">No specialties found</p>
                ) : (
                  specialties.map((specialty) => (
                    <DropdownMenuCheckboxItem
                      key={specialty.id}
                      checked={draft.specialties.includes(specialty.id)}
                      onCheckedChange={(checked) =>
                        toggleSpecialty(specialty.id, checked === true)
                      }
                    >
                      {specialty.title}
                    </DropdownMenuCheckboxItem>
                  ))
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="rounded-md border p-2.5">
          <p className="mb-2 text-sm font-medium">Experience</p>
          <div className="grid gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Exact</Label>
              <Input
                type="number"
                value={draft.experience.exact}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    experience: { ...prev.experience, exact: e.target.value },
                  }))
                }
                placeholder="e.g. 5"
                className="h-8"
              />
            </div>

            <div className="grid grid-cols-[6.5rem_1fr] gap-2">
              <Select
                value={draft.experience.lowerOperator}
                onValueChange={(value) =>
                  setDraft((prev) => ({
                    ...prev,
                    experience: {
                      ...prev.experience,
                      lowerOperator: value as LowerRangeOperator,
                    },
                  }))
                }
              >
                <SelectTrigger size="sm" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gt">gt</SelectItem>
                  <SelectItem value="gte">gte</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={draft.experience.lowerValue}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    experience: { ...prev.experience, lowerValue: e.target.value },
                  }))
                }
                placeholder="Lower bound"
                className="h-8"
              />
            </div>

            <div className="grid grid-cols-[6.5rem_1fr] gap-2">
              <Select
                value={draft.experience.upperOperator}
                onValueChange={(value) =>
                  setDraft((prev) => ({
                    ...prev,
                    experience: {
                      ...prev.experience,
                      upperOperator: value as UpperRangeOperator,
                    },
                  }))
                }
              >
                <SelectTrigger size="sm" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lt">lt</SelectItem>
                  <SelectItem value="lte">lte</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={draft.experience.upperValue}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    experience: { ...prev.experience, upperValue: e.target.value },
                  }))
                }
                placeholder="Upper bound"
                className="h-8"
              />
            </div>
          </div>
        </div>

        <div className="rounded-md border p-2.5">
          <p className="mb-2 text-sm font-medium">Appointment Fee</p>
          <div className="grid gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Exact</Label>
              <Input
                type="number"
                value={draft.appointmentFee.exact}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    appointmentFee: { ...prev.appointmentFee, exact: e.target.value },
                  }))
                }
                placeholder="e.g. 1000"
                className="h-8"
              />
            </div>

            <div className="grid grid-cols-[6.5rem_1fr] gap-2">
              <Select
                value={draft.appointmentFee.lowerOperator}
                onValueChange={(value) =>
                  setDraft((prev) => ({
                    ...prev,
                    appointmentFee: {
                      ...prev.appointmentFee,
                      lowerOperator: value as LowerRangeOperator,
                    },
                  }))
                }
              >
                <SelectTrigger size="sm" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gt">gt</SelectItem>
                  <SelectItem value="gte">gte</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={draft.appointmentFee.lowerValue}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    appointmentFee: {
                      ...prev.appointmentFee,
                      lowerValue: e.target.value,
                    },
                  }))
                }
                placeholder="Lower bound"
                className="h-8"
              />
            </div>

            <div className="grid grid-cols-[6.5rem_1fr] gap-2">
              <Select
                value={draft.appointmentFee.upperOperator}
                onValueChange={(value) =>
                  setDraft((prev) => ({
                    ...prev,
                    appointmentFee: {
                      ...prev.appointmentFee,
                      upperOperator: value as UpperRangeOperator,
                    },
                  }))
                }
              >
                <SelectTrigger size="sm" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lt">lt</SelectItem>
                  <SelectItem value="lte">lte</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={draft.appointmentFee.upperValue}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    appointmentFee: {
                      ...prev.appointmentFee,
                      upperValue: e.target.value,
                    },
                  }))
                }
                placeholder="Upper bound"
                className="h-8"
              />
            </div>
          </div>
        </div>
      </div>
    </DataTableFilterPopover>
  );
}
