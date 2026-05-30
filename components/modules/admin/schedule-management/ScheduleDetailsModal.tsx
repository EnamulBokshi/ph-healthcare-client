"use client";

import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ISchedule } from "@/types/schedule.types";

interface ScheduleDetailsModalProps {
  schedule: ISchedule | null;
  onClose: () => void;
}

interface InfoRowProps {
  label: string;
  value: React.ReactNode;
}

const InfoRow = ({ label, value }: InfoRowProps) => (
  <div className="grid grid-cols-3 gap-4 border-b py-2 last:border-b-0">
    <div className="font-medium text-sm text-muted-foreground">{label}</div>
    <div className="col-span-2 text-sm">{value || "—"}</div>
  </div>
);

export default function ScheduleDetailsModal({
  schedule,
  onClose,
}: ScheduleDetailsModalProps) {
  const isLoading = false;

  if (!schedule) {
    return null;
  }

  const formatDateTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <Dialog open={Boolean(schedule)} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ msOverflowStyle: "none" }}>
        <DialogHeader>
          <DialogTitle>Schedule Details</DialogTitle>
          <DialogDescription>
            Full information about this schedule slot.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Spinner />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Schedule Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoRow
                  label="Schedule ID"
                  value={schedule.id}
                />
                <InfoRow
                  label="Start Date/Time"
                  value={formatDateTime(schedule.startDateTime)}
                />
                <InfoRow
                  label="End Date/Time"
                  value={formatDateTime(schedule.endDateTime)}
                />
                {schedule.createdAt && (
                  <InfoRow
                    label="Created At"
                    value={formatDateTime(schedule.createdAt)}
                  />
                )}
                {schedule.updatedAt && (
                  <InfoRow
                    label="Updated At"
                    value={formatDateTime(schedule.updatedAt)}
                  />
                )}
              </CardContent>
            </Card>

            {schedule.appointments && schedule.appointments.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <p className="text-muted-foreground">
                      Total Appointments: {schedule.appointments.length}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {schedule.doctorSchedules && schedule.doctorSchedules.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Doctor Assignments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <p className="text-muted-foreground">
                      Total Assignments: {schedule.doctorSchedules.length}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2 border-t pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
