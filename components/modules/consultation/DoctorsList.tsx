"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { getDoctors } from "@/services/doctor.services";
import { getReviews } from "@/services/review.services";
import { getSchedules } from "@/services/schedule.services";
import { getSpecialties } from "@/services/specialty.services";
import { IDoctor } from "@/types/doctor.types";
import { IReview } from "@/types/review.types";
import { ISchedule } from "@/types/schedule.types";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface DoctorsListProps {
  queryString: string;
  queryParamsObject: {
    [key: string]: string | string[] | undefined;
  };
}

const pickFirst = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const formatDateTime = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
};

const renderStars = (rating: number) => {
  const filled = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <span className="text-sm tracking-wide text-amber-500" aria-label={`${rating.toFixed(1)} out of 5`}>
      {"★".repeat(filled)}
      <span className="text-muted-foreground">{"☆".repeat(5 - filled)}</span>
    </span>
  );
};

const getVisiblePages = (currentPage: number, totalPages: number) => {
  const pages: (number | -1)[] = [];
  const delta = 2;

  pages.push(1);

  let left = Math.max(2, currentPage - delta);
  let right = Math.min(totalPages - 1, currentPage + delta);

  if (currentPage <= 4) {
    right = Math.min(totalPages - 1, 7);
  }
  if (currentPage >= totalPages - 3) {
    left = Math.max(2, totalPages - 6);
  }

  if (left > 2) {
    pages.push(-1);
  }

  for (let p = left; p <= right; p++) {
    pages.push(p);
  }

  if (right < totalPages - 1) {
    pages.push(-1);
  }

  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
};

export default function DoctorsList({ queryString, queryParamsObject }: DoctorsListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchTermState = String(pickFirst(queryParamsObject.searchTerm) ?? "");
  const page = Number(pickFirst(queryParamsObject.page)) || 1;
  const limit = Number(pickFirst(queryParamsObject.limit)) || 9;
  const genderState = String(pickFirst(queryParamsObject.gender) ?? "");
  const specialtyState = String(pickFirst(queryParamsObject["specialties.specialty.title"]) ?? "");
  const sortByState = String(pickFirst(queryParamsObject.sortBy) ?? "");
  const sortOrderState = String(pickFirst(queryParamsObject.sortOrder) ?? "");

  const [searchInput, setSearchInput] = useState(searchTermState);

  useEffect(() => {
    setSearchInput(searchTermState);
  }, [searchTermState]);

  const { data: doctorsResponse, isLoading: isDoctorsLoading, isFetching: isDoctorsFetching } =
    useQuery({
      queryKey: ["consultation-doctors", queryParamsObject],
      queryFn: () => getDoctors(queryString),
      placeholderData: (previousData) => previousData,
    });

  const { data: reviewsResponse } = useQuery({
    queryKey: ["consultation-reviews"],
    queryFn: getReviews,
    staleTime: 60 * 1000,
  });

  const { data: schedulesResponse, isError: isSchedulesError } = useQuery({
    queryKey: ["consultation-schedules"],
    queryFn: () => getSchedules("include=doctorSchedules&sortBy=startDateTime&sortOrder=asc&page=1&limit=500"),
    retry: false,
    staleTime: 60 * 1000,
  });

  const { data: specialtiesResponse } = useQuery({
    queryKey: ["specialties"],
    queryFn: getSpecialties,
    staleTime: 60 * 60 * 1000,
  });

  const doctors = doctorsResponse?.data ?? [];
  const totalItems = doctorsResponse?.meta?.total ?? 0;
  const totalPages = Math.max(doctorsResponse?.meta?.totalPages ?? 1, 1);
  const specialties = specialtiesResponse?.data ?? [];
  const reviews = reviewsResponse?.data ?? [];
  const schedules = schedulesResponse?.data ?? [];

  const reviewsByDoctorId = useMemo(() => {
    const map = new Map<string, IReview[]>();

    reviews.forEach((review: IReview) => {
      const doctorId = String(review.doctorId);
      const current = map.get(doctorId) ?? [];
      current.push(review);
      map.set(doctorId, current);
    });

    map.forEach((arr) => {
      arr.sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      });
    });

    return map;
  }, [reviews]);

  const availableSchedulesByDoctorId = useMemo(() => {
    const map = new Map<string, ISchedule[]>();
    const now = Date.now();

    schedules.forEach((slot: ISchedule) => {
      const endMs = new Date(slot.endDateTime).getTime();
      if (!Number.isFinite(endMs) || endMs <= now) {
        return;
      }

      (slot.doctorSchedules ?? []).forEach((assignment) => {
        if (assignment.isBooked) {
          return;
        }

        const doctorId = String(assignment.doctorId);
        const list = map.get(doctorId) ?? [];
        list.push(slot);
        map.set(doctorId, list);
      });
    });

    map.forEach((arr) => {
      arr.sort(
        (a, b) =>
          new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime(),
      );
    });

    return map;
  }, [schedules]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput === searchTermState) {
        return;
      }

      const params = new URLSearchParams(searchParams.toString());
      const trimmed = searchInput.trim();

      if (trimmed) {
        params.set("searchTerm", trimmed);
      } else {
        params.delete("searchTerm");
      }

      params.set("page", "1");
      params.set("limit", String(limit));

      const nextQuery = params.toString();
      router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
    }, 600);

    return () => clearTimeout(timer);
  }, [searchInput, searchParams, pathname, router, searchTermState, limit]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.set("page", "1");
    params.set("limit", String(limit));

    const nextQuery = params.toString();
    router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  };

  const handlePageChange = (nextPage: number) => {
    const normalized = Math.min(Math.max(nextPage, 1), totalPages);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(normalized));
    params.set("limit", String(limit));
    const nextQuery = params.toString();
    router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  };

  const handleLimitChange = (nextLimit: string | null) => {
    if (!nextLimit) return;
    const parsed = Number(nextLimit);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", String(parsed));
    params.set("page", "1");
    const nextQuery = params.toString();
    router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("gender");
    params.delete("specialties.specialty.title");
    params.delete("sortBy");
    params.delete("sortOrder");
    params.delete("searchTerm");
    params.set("page", "1");
    params.set("limit", String(limit));
    setSearchInput("");
    const nextQuery = params.toString();
    router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  };

  const visiblePages = getVisiblePages(page, totalPages);

  return (
    <section className="mx-auto w-full max-w-7xl space-y-5 px-4 py-8 md:px-6 lg:px-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Find Your Doctor
        </h1>
        <p className="text-sm text-muted-foreground md:text-base">
          Browse doctors, check upcoming available schedules, and read patient reviews.
        </p>
      </div>

      <Card>
        <CardContent className="grid gap-3 p-4 md:grid-cols-2 lg:grid-cols-5">
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by doctor name or email"
            className="lg:col-span-2"
          />

          <Select value={genderState || "all"} onValueChange={(value) => updateParam("gender", !value || value === "all" ? "" : value)}>
            <SelectTrigger className="w-full" size="default">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genders</SelectItem>
              <SelectItem value="MALE">Male</SelectItem>
              <SelectItem value="FEMALE">Female</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={specialtyState || "all"}
            onValueChange={(value) =>
              updateParam("specialties.specialty.title", !value || value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-full" size="default">
              <SelectValue placeholder="Specialty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specialties</SelectItem>
              {specialties.map((specialty) => (
                <SelectItem key={specialty.id} value={specialty.title}>
                  {specialty.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Select
              value={sortByState ? `${sortByState}:${sortOrderState || "asc"}` : "default"}
              onValueChange={(value) => {
                if (!value) return;
                if (value === "default") {
                  updateParam("sortBy", "");
                  updateParam("sortOrder", "");
                  return;
                }

                const [sortBy, sortOrder] = value.split(":");
                const params = new URLSearchParams(searchParams.toString());
                params.set("sortBy", sortBy);
                params.set("sortOrder", sortOrder || "asc");
                params.set("page", "1");
                params.set("limit", String(limit));
                const nextQuery = params.toString();
                router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
              }}
            >
              <SelectTrigger className="w-full" size="default">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="averageRating:desc">Top Rated</SelectItem>
                <SelectItem value="experience:desc">Most Experienced</SelectItem>
                <SelectItem value="appointmentFee:asc">Lowest Fee</SelectItem>
                <SelectItem value="appointmentFee:desc">Highest Fee</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={clearFilters}>
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {isDoctorsLoading || isDoctorsFetching ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Card key={idx} className="min-h-72 animate-pulse bg-muted/40" />
          ))}
        </div>
      ) : doctors.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            No doctors found for the selected filters.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {doctors.map((doctor: IDoctor) => {
            const doctorId = String(doctor.id);
            const doctorReviews = reviewsByDoctorId.get(doctorId) ?? [];
            const doctorSchedules = (availableSchedulesByDoctorId.get(doctorId) ?? []).slice(0, 4);

            return (
              <Card
                key={doctorId}
                className="cursor-pointer overflow-hidden border-border/70 transition-colors hover:border-primary/40"
                onClick={() => {
                  router.push(`/consultation/doctor/${doctorId}`);
                }}
              >
                <CardHeader className="space-y-2 pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-lg">Dr. {doctor.name}</CardTitle>
                      <CardDescription className="line-clamp-1">
                        {doctor.designation || "Specialist"}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">
                      {typeof doctor.experience === "number" ? `${doctor.experience} yrs` : "N/A"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {renderStars(Number(doctor.averageRating || 0))}
                      <span className="text-muted-foreground">
                        {Number(doctor.averageRating || 0).toFixed(1)}
                      </span>
                    </div>
                    <span className="font-medium text-primary">
                      {typeof doctor.appointmentFee === "number" ? `$${doctor.appointmentFee}` : "Fee N/A"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {(doctor.specialties ?? []).slice(0, 3).map((item) => (
                      <Badge key={item.specialtyId} variant="secondary" className="font-normal">
                        {item.specialty?.title}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Upcoming Available Schedules</p>
                    {isSchedulesError ? (
                      <p className="text-xs text-muted-foreground">
                        Schedule visibility is currently unavailable.
                      </p>
                    ) : doctorSchedules.length > 0 ? (
                      <div className="space-y-1">
                        {doctorSchedules.map((slot) => (
                          <div
                            key={slot.id}
                            className="rounded-md border border-dashed px-2.5 py-1.5 text-xs text-muted-foreground"
                          >
                            {formatDateTime(slot.startDateTime)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        No upcoming available schedules.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Recent Reviews</p>
                      <span className="text-xs text-muted-foreground">
                        {doctorReviews.length} total
                      </span>
                    </div>

                    {doctorReviews.length > 0 ? (
                      <div className="space-y-2">
                        {doctorReviews.slice(0, 2).map((review) => (
                          <div key={review.id} className="rounded-md bg-muted/40 p-2.5">
                            <div className="mb-1 flex items-center justify-between">
                              {renderStars(review.rating)}
                              <span className="text-[11px] text-muted-foreground">
                                {formatDateTime(review.createdAt)}
                              </span>
                            </div>
                            <p className="line-clamp-2 text-xs text-muted-foreground">
                              {review.comment}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">No reviews yet.</p>
                    )}
                  </div>

                  <Button
                    className="w-full"
                    variant="default"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/consultation/doctor/${doctorId}`);
                    }}
                  >
                    View Doctor Details
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Card>
        <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground">
            Page <span className="font-medium text-foreground">{page}</span> of{" "}
            <span className="font-medium text-foreground">{totalPages}</span> | Total doctors{" "}
            <span className="font-medium text-foreground">{totalItems}</span>
          </p>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Cards per page</span>
              <Select value={String(limit)} onValueChange={handleLimitChange}>
                <SelectTrigger className="w-20" size="sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="9">9</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Pagination className="mx-0 w-auto justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    className={cn(page <= 1 && "pointer-events-none opacity-50")}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(page - 1);
                    }}
                  />
                </PaginationItem>

                {visiblePages.map((item, idx) =>
                  item === -1 ? (
                    <PaginationItem key={`ellipsis-${idx}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={item}>
                      <PaginationLink
                        href="#"
                        isActive={item === page}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(item);
                        }}
                      >
                        {item}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    className={cn(page >= totalPages && "pointer-events-none opacity-50")}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(page + 1);
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
