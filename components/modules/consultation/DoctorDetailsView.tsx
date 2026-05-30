"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDoctorById } from "@/services/doctor.services";
import { getReviews } from "@/services/review.services";
import { getSchedules } from "@/services/schedule.services";
import { IDoctor } from "@/types/doctor.types";
import { IReview } from "@/types/review.types";
import { ISchedule } from "@/types/schedule.types";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface DoctorDetailsViewProps {
  doctorId: string;
}

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

export default function DoctorDetailsView({ doctorId }: DoctorDetailsViewProps) {
  const { data: doctorResponse, isLoading: isDoctorLoading, isError: isDoctorError } =
    useQuery({
      queryKey: ["consultation-doctor-details", doctorId],
      queryFn: () => getDoctorById(doctorId),
      retry: false,
    });

  const { data: reviewsResponse } = useQuery({
    queryKey: ["consultation-reviews"],
    queryFn: getReviews,
    staleTime: 60 * 1000,
  });

  const { data: schedulesResponse, isError: isSchedulesError } = useQuery({
    queryKey: ["consultation-schedules"],
    queryFn: () =>
      getSchedules("include=doctorSchedules&sortBy=startDateTime&sortOrder=asc&page=1&limit=800"),
    retry: false,
    staleTime: 60 * 1000,
  });

  const doctor = doctorResponse?.data as IDoctor | undefined;
  const allReviews = reviewsResponse?.data ?? [];
  const allSchedules = schedulesResponse?.data ?? [];

  const doctorReviews = allReviews
    .filter((review: IReview) => String(review.doctorId) === String(doctorId))
    .sort((a: IReview, b: IReview) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });

  const availableSchedules = allSchedules
    .filter((slot: ISchedule) => {
      const endMs = new Date(slot.endDateTime).getTime();
      if (!Number.isFinite(endMs) || endMs <= Date.now()) {
        return false;
      }

      return (slot.doctorSchedules ?? []).some(
        (assignment) =>
          String(assignment.doctorId) === String(doctorId) && !assignment.isBooked,
      );
    })
    .sort(
      (a: ISchedule, b: ISchedule) =>
        new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime(),
    );

  if (isDoctorLoading) {
    return (
      <section className="mx-auto w-full max-w-7xl space-y-4 px-4 py-8 md:px-6 lg:px-8">
        <Card className="min-h-40 animate-pulse bg-muted/40" />
        <Card className="min-h-72 animate-pulse bg-muted/40" />
      </section>
    );
  }

  if (isDoctorError || !doctor) {
    return (
      <section className="mx-auto w-full max-w-4xl space-y-4 px-4 py-8 md:px-6">
        <Card>
          <CardContent className="space-y-3 py-8 text-center">
            <p className="text-base font-medium">Doctor not found</p>
            <p className="text-sm text-muted-foreground">
              The doctor profile you requested is not available.
            </p>
            <div>
              <Link href="/consultation">
                <Button variant="outline">Back to Consultation</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-7xl space-y-5 px-4 py-8 md:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Dr. {doctor.name}
          </h1>
          <p className="text-sm text-muted-foreground md:text-base">
            Doctor details, available schedule slots, and patient reviews.
          </p>
        </div>

        <Link href="/consultation">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>{doctor.designation || "Specialist"}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">Email: </span>
                {doctor.email || "N/A"}
              </p>
              <p>
                <span className="text-muted-foreground">Contact: </span>
                {doctor.contactNumber || "N/A"}
              </p>
              <p>
                <span className="text-muted-foreground">Experience: </span>
                {typeof doctor.experience === "number" ? `${doctor.experience} years` : "N/A"}
              </p>
              <p>
                <span className="text-muted-foreground">Fee: </span>
                {typeof doctor.appointmentFee === "number" ? `$${doctor.appointmentFee}` : "N/A"}
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">Qualification: </span>
                {doctor.qualification || "N/A"}
              </p>
              <p>
                <span className="text-muted-foreground">Working Place: </span>
                {doctor.currentWorkingPlace || "N/A"}
              </p>
              <div className="flex items-center gap-2">
                {renderStars(Number(doctor.averageRating || 0))}
                <span className="text-muted-foreground">
                  {Number(doctor.averageRating || 0).toFixed(1)} ({doctorReviews.length} reviews)
                </span>
              </div>
            </div>

            <div className="md:col-span-2 flex flex-wrap gap-1.5">
              {(doctor.specialties ?? []).map((item) => (
                <Badge key={item.specialtyId} variant="secondary" className="font-normal">
                  {item.specialty?.title || "Specialty"}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Book Appointment</CardTitle>
            <CardDescription>
              Appointment booking flow will be added in the next step.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button disabled className="w-full">
              Booking Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Schedules</CardTitle>
          <CardDescription>Future unbooked slots for this doctor.</CardDescription>
        </CardHeader>
        <CardContent>
          {isSchedulesError ? (
            <p className="text-sm text-muted-foreground">
              Schedule visibility is currently unavailable.
            </p>
          ) : availableSchedules.length > 0 ? (
            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
              {availableSchedules.map((slot) => (
                <div key={slot.id} className="rounded-lg border border-dashed p-3 text-sm">
                  <p className="font-medium">{formatDateTime(slot.startDateTime)}</p>
                  <p className="text-xs text-muted-foreground">
                    To {formatDateTime(slot.endDateTime)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No upcoming available schedules.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Patient Reviews</CardTitle>
          <CardDescription>What patients are saying.</CardDescription>
        </CardHeader>
        <CardContent>
          {doctorReviews.length > 0 ? (
            <div className="space-y-3">
              {doctorReviews.map((review) => (
                <div key={review.id} className="rounded-lg border p-3">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    {renderStars(review.rating)}
                    <span className="text-xs text-muted-foreground">
                      {formatDateTime(review.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No reviews yet for this doctor.</p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
