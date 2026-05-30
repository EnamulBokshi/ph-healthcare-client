"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { getDoctorById } from "@/services/doctor.services";
import { Gender, IDoctor } from "@/types/doctor.types";
import { UserStatus } from "@/types/user.type";
import { useQuery } from "@tanstack/react-query";

interface DoctorDetailsModalProps {
  open: boolean;
  doctorId: string | null;
  fallbackDoctor: IDoctor | null;
  onOpenChange: (open: boolean) => void;
}

const getGenderLabel = (
  gender: IDoctor["gender"] | string | number | null | undefined,
): string => {
  if (gender === null || gender === undefined) {
    return "N/A";
  }

  if (gender === Gender.MALE || String(gender).toUpperCase() === "MALE") {
    return "Male";
  }
  if (gender === Gender.FEMALE || String(gender).toUpperCase() === "FEMALE") {
    return "Female";
  }
  return "Other";
};

const getStatusToneClass = (status: UserStatus | undefined) => {
  if (status === UserStatus.ACTIVE) return "bg-green-100 text-green-800";
  if (status === UserStatus.SUSPENDED) return "bg-yellow-100 text-yellow-800";
  if (status === UserStatus.DELETED) return "bg-red-100 text-red-800";
  return "bg-gray-100 text-gray-800";
};

const formatDateTime = (value: string | Date | undefined) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleString();
};

const InfoRow = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex items-start justify-between gap-3 border-b py-2 text-sm last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
};

export default function DoctorDetailsModal({
  open,
  doctorId,
  fallbackDoctor,
  onOpenChange,
}: DoctorDetailsModalProps) {
  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["doctor-details", doctorId],
    queryFn: () => getDoctorById(String(doctorId)),
    enabled: open && Boolean(doctorId),
  });

  const doctor = data?.data ?? fallbackDoctor;

  return (
    <Dialog open={open} onOpenChange={onOpenChange} disablePointerDismissal>
      <DialogContent
        className="sm:max-w-6xl max-h-[90vh] overflow-y-auto p-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ msOverflowStyle: "none" }}
      >
        <DialogHeader className="border-b px-6 pt-6 pb-4">
          <DialogTitle className="text-xl">
            {doctor?.name ? `Dr. ${doctor.name}` : "Doctor Details"}
          </DialogTitle>
          <DialogDescription>
            Full profile details including contact, professional information, and specialties.
          </DialogDescription>
        </DialogHeader>

        {isLoading || isFetching ? (
          <div className="flex min-h-56 items-center justify-center gap-2 px-6 py-10 text-muted-foreground">
            <Spinner className="size-5" />
            Loading doctor details...
          </div>
        ) : isError ? (
          <div className="space-y-3 px-6 py-8">
            <p className="text-sm text-destructive">Failed to load doctor details.</p>
            <Button type="button" variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : (
          <div className="space-y-4 px-6 py-5">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Identity and account status.</CardDescription>
                </CardHeader>
                <CardContent>
                  <InfoRow label="Name" value={doctor?.name ?? "N/A"} />
                  <InfoRow label="Email" value={doctor?.email ?? "N/A"} />
                  <InfoRow label="Gender" value={getGenderLabel(doctor?.gender)} />
                  <div className="flex items-start justify-between gap-3 border-b py-2 text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <Badge className={getStatusToneClass(doctor?.user?.status)}>
                      {doctor?.user?.status ?? "N/A"}
                    </Badge>
                  </div>
                  <InfoRow
                    label="Joined On"
                    value={formatDateTime(doctor?.createdAt)}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Professional Information</CardTitle>
                  <CardDescription>Career and fee details.</CardDescription>
                </CardHeader>
                <CardContent>
                  <InfoRow
                    label="Designation"
                    value={doctor?.designation ?? "N/A"}
                  />
                  <InfoRow
                    label="Qualification"
                    value={doctor?.qualification ?? "N/A"}
                  />
                  <InfoRow
                    label="Experience"
                    value={doctor?.experience ? `${doctor.experience} years` : "N/A"}
                  />
                  <InfoRow
                    label="Appointment Fee"
                    value={
                      typeof doctor?.appointmentFee === "number"
                        ? `$${doctor.appointmentFee.toFixed(2)}`
                        : "N/A"
                    }
                  />
                  <InfoRow
                    label="Average Rating"
                    value={
                      typeof doctor?.averageRating === "number"
                        ? `${doctor.averageRating.toFixed(1)} / 5`
                        : "N/A"
                    }
                  />
                  <InfoRow
                    label="Registration No."
                    value={doctor?.registrationNumber ?? "N/A"}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Contact and Workplace</CardTitle>
                  <CardDescription>How to reach and where doctor works.</CardDescription>
                </CardHeader>
                <CardContent>
                  <InfoRow
                    label="Contact Number"
                    value={doctor?.contactNumber ?? "N/A"}
                  />
                  <InfoRow label="Address" value={doctor?.address ?? "N/A"} />
                  <InfoRow
                    label="Current Working Place"
                    value={doctor?.currentWorkingPlace ?? "N/A"}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Specialties</CardTitle>
                  <CardDescription>Clinical specialties assigned to this doctor.</CardDescription>
                </CardHeader>
                <CardContent>
                  {doctor?.specialties?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {doctor.specialties.map((item) => (
                        <Badge key={item.specialtyId} variant="outline">
                          {item.specialty?.title ?? "N/A"}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No specialties assigned.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}
