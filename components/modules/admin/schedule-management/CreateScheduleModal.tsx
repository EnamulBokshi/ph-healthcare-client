"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AppField from "@/components/shared/form/AppField";
import { createSchedule } from "@/services/schedule.services";
import { createScheduleZodSchema } from "@/zod/schedule.schema";

export default function CreateScheduleModal() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { mutateAsync: createScheduleMutation, isPending } = useMutation({
    mutationFn: createSchedule,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });

  const form = useForm({
    defaultValues: {
      startDate: "",
      endDate: "",
      startTime: "09:00",
      endTime: "17:00",
    },
    onSubmit: async ({ value }) => {
      try {
        setServerError(null);
        await createScheduleMutation(value);
        toast.success("Schedule created successfully");
        setOpen(false);
        form.reset();
      } catch (error: unknown) {
        const candidate = error as {
          response?: { data?: { message?: string } };
        };
        const errorMsg =
          candidate?.response?.data?.message ||
          "Failed to create schedule";
        setServerError(errorMsg);
        toast.error(errorMsg);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen} disablePointerDismissal>
      <DialogTrigger
        render={
          <Button variant="default">
            Create Schedule
          </Button>
        }
      />

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Schedule</DialogTitle>
          <DialogDescription>
            Enter the date and time range for the schedule. Multiple 30-minute slots will be created.
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
              validators={{
                onChange: createScheduleZodSchema.shape.startDate,
              }}
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
              validators={{
                onChange: createScheduleZodSchema.shape.endDate,
              }}
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
              validators={{
                onChange: createScheduleZodSchema.shape.startTime,
              }}
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
              validators={{
                onChange: createScheduleZodSchema.shape.endTime,
              }}
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
                    setOpen(false);
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
                  {isSubmitting || isPending ? "Creating..." : "Create Schedule"}
                </Button>
              </div>
            )}
          </form.Subscribe>
        </form>
      </DialogContent>
    </Dialog>
  );
}
