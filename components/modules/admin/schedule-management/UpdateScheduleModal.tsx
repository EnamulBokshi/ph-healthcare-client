"use client";

import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AppField from "@/components/shared/form/AppField";
import { updateSchedule } from "@/services/schedule.services";
import { ISchedule } from "@/types/schedule.types";
import { updateScheduleZodSchema } from "@/zod/schedule.schema";

interface UpdateScheduleModalProps {
  schedule: ISchedule | null;
  onClose: () => void;
}

export default function UpdateScheduleModal({
  schedule,
  onClose,
}: UpdateScheduleModalProps) {
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);

  const { mutateAsync: updateScheduleMutation, isPending } = useMutation({
    mutationFn: ({
      scheduleId,
      payload,
    }: {
      scheduleId: string;
      payload: any;
    }) => updateSchedule(scheduleId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });

  const form = useForm({
    defaultValues: {
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
    },
    onSubmit: async ({ value }) => {
      if (!schedule?.id) {
        toast.error("Unable to update schedule");
        return;
      }

      try {
        setServerError(null);

        // Filter out empty fields
        const payload = Object.fromEntries(
          Object.entries(value).filter(([_, v]) => v !== "")
        );

        await updateScheduleMutation({
          scheduleId: schedule.id,
          payload,
        });

        toast.success("Schedule updated successfully");
        onClose();
        form.reset();
      } catch (error: unknown) {
        const candidate = error as {
          response?: { data?: { message?: string } };
        };
        const errorMsg =
          candidate?.response?.data?.message ||
          "Failed to update schedule";
        setServerError(errorMsg);
        toast.error(errorMsg);
      }
    },
  });

  useEffect(() => {
    if (schedule) {
      const startDateTime = new Date(schedule.startDateTime);
      const endDateTime = new Date(schedule.endDateTime);

      form.setFieldValue("startDate", startDateTime.toISOString().split("T")[0]);
      form.setFieldValue(
        "startTime",
        startDateTime.toTimeString().slice(0, 5)
      );
      form.setFieldValue("endDate", endDateTime.toISOString().split("T")[0]);
      form.setFieldValue("endTime", endDateTime.toTimeString().slice(0, 5));
    }
  }, [schedule]);

  return (
    <Dialog open={Boolean(schedule)} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Update Schedule</DialogTitle>
          <DialogDescription>
            Modify the date and time range for this schedule.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <form.Field
              name="startDate"
              children={(field) => (
                <AppField
                  field={field}
                  label="Start Date"
                  type="date"
                  placeholder="2024-03-25"
                />
              )}
            />

            <form.Field
              name="endDate"
              children={(field) => (
                <AppField
                  field={field}
                  label="End Date"
                  type="date"
                  placeholder="2024-03-25"
                />
              )}
            />

            <form.Field
              name="startTime"
              children={(field) => (
                <AppField
                  field={field}
                  label="Start Time"
                  type="time"
                  placeholder="09:00"
                />
              )}
            />

            <form.Field
              name="endTime"
              children={(field) => (
                <AppField
                  field={field}
                  label="End Time"
                  type="time"
                  placeholder="17:00"
                />
              )}
            />
          </div>

          {serverError && (
            <Alert variant="destructive">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <form.Subscribe
            selector={(s) => [s.canSubmit, s.isSubmitting] as const}
          >
            {([canSubmit, isSubmitting]) => (
              <div className="flex justify-end gap-2 border-t pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    onClose();
                    form.reset();
                    setServerError(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!canSubmit || isSubmitting || isPending}
                >
                  {isSubmitting || isPending ? "Updating..." : "Update Schedule"}
                </Button>
              </div>
            )}
          </form.Subscribe>
        </form>
      </DialogContent>
    </Dialog>
  );
}
