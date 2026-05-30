"use client";

import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateDoctor } from "@/services/doctor.services";
import {
  DoctorGenderValue,
  Gender,
  IDoctor,
  IUpdateDoctorPayload,
} from "@/types/doctor.types";
import { ISpecialty } from "@/types/specialty.types";
import {
  IUpdateDoctorForm,
  updateDoctorZodSchema,
} from "@/zod/doctor.schema";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const getApiErrorMessage = (error: unknown, fallback: string) => {
  const candidate = error as { response?: { data?: { message?: string } } };
  return candidate?.response?.data?.message || fallback;
};

interface UpdateDoctorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctor: IDoctor | null;
  specialties: ISpecialty[];
}

const emptyValues: IUpdateDoctorForm = {
  name: "",
  email: "",
  contactNumber: "",
  address: "",
  registrationNumber: "",
  experience: "",
  gender: "MALE",
  appointmentFee: "",
  qualification: "",
  designation: "",
  currentWorkingPlace: "",
  specialties: [],
};

const mapGenderToValue = (
  gender: IDoctor["gender"] | string | number | null | undefined,
): DoctorGenderValue => {
  if (gender === Gender.MALE || String(gender).toUpperCase() === "MALE") {
    return "MALE";
  }
  if (gender === Gender.FEMALE || String(gender).toUpperCase() === "FEMALE") {
    return "FEMALE";
  }
  return "OTHER";
};

const getDefaultValues = (doctor: IDoctor | null): IUpdateDoctorForm => {
  if (!doctor) {
    return emptyValues;
  }

  return {
    name: doctor.name ?? "",
    email: doctor.email ?? "",
    contactNumber: doctor.contactNumber ?? "",
    address: doctor.address ?? "",
    registrationNumber: doctor.registrationNumber ?? "",
    experience: String(doctor.experience ?? ""),
    gender: mapGenderToValue(doctor.gender),
    appointmentFee: String(doctor.appointmentFee ?? ""),
    qualification: doctor.qualification ?? "",
    designation: doctor.designation ?? "",
    currentWorkingPlace: doctor.currentWorkingPlace ?? "",
    specialties: doctor.specialties?.map((item) => item.specialtyId) ?? [],
  };
};

export default function UpdateDoctorModal({
  open,
  onOpenChange,
  doctor,
  specialties,
}: UpdateDoctorModalProps) {
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);

  const { mutateAsync } = useMutation({
    mutationFn: ({ doctorId, payload }: { doctorId: string; payload: IUpdateDoctorPayload }) =>
      updateDoctor(doctorId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });

  const form = useForm({
    defaultValues: emptyValues,
    onSubmit: async (formState) => {
      if (!doctor?.id) {
        toast.error("Unable to update doctor: missing doctor id");
        return;
      }

      setServerError(null);

      try {
        const value = formState.value;

        const payload: IUpdateDoctorPayload = {
          doctor: {
            name: value.name,
            contactNumber: value.contactNumber,
            address: value.address,
            registrationNumber: value.registrationNumber,
            experience: Number(value.experience),
            gender: value.gender,
            appointmentFee: Number(value.appointmentFee),
            qualification: value.qualification,
            designation: value.designation,
            currentWorkingPlace: value.currentWorkingPlace,
          },
          specialties: value.specialties,
        };

        const result = await mutateAsync({ doctorId: String(doctor.id), payload });

        if (!result?.success) {
          const message = result?.message || "Failed to update doctor";
          setServerError(message);
          toast.error(message);
          return;
        }

        toast.success(result?.message || "Doctor updated successfully");
        onOpenChange(false);
      } catch (error: unknown) {
        const message = getApiErrorMessage(error, "Failed to update doctor");
        setServerError(message);
        toast.error(message);
      }
    },
  });

  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues(doctor));
    }
  }, [doctor, form, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} disablePointerDismissal>
      <DialogContent className="sm:max-w-6xl p-0">
        <DialogHeader className="px-4 pt-4">
          <DialogTitle>Update Doctor</DialogTitle>
          <DialogDescription>
            Edit doctor information and save your changes.
          </DialogDescription>
        </DialogHeader>

        <form
          className="max-h-[78vh] space-y-3 overflow-y-auto px-4 pb-4"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="grid gap-3 md:grid-cols-2">
            <form.Field
              name="name"
              validators={{ onChange: updateDoctorZodSchema.shape.name }}
              children={(field) => (
                <AppField field={field} label="Name" placeholder="Dr. Enamul" />
              )}
            />

            <form.Field
              name="email"
              validators={{ onChange: updateDoctorZodSchema.shape.email }}
              children={(field) => (
                <AppField
                  field={field}
                  label="Email"
                  type="email"
                  placeholder="doctor@example.com"
                  disabled
                />
              )}
            />

            <form.Field
              name="contactNumber"
              validators={{ onChange: updateDoctorZodSchema.shape.contactNumber }}
              children={(field) => (
                <AppField
                  field={field}
                  label="Contact Number"
                  placeholder="+8802343434"
                />
              )}
            />

            <form.Field
              name="registrationNumber"
              validators={{ onChange: updateDoctorZodSchema.shape.registrationNumber }}
              children={(field) => (
                <AppField
                  field={field}
                  label="Registration Number"
                  placeholder="MBC-123434"
                />
              )}
            />

            <form.Field
              name="experience"
              validators={{ onChange: updateDoctorZodSchema.shape.experience }}
              children={(field) => (
                <AppField
                  field={field}
                  label="Experience (Years)"
                  type="number"
                  placeholder="3"
                />
              )}
            />

            <form.Field
              name="appointmentFee"
              validators={{ onChange: updateDoctorZodSchema.shape.appointmentFee }}
              children={(field) => (
                <AppField
                  field={field}
                  label="Appointment Fee"
                  type="number"
                  placeholder="1200"
                />
              )}
            />

            <form.Field
              name="gender"
              validators={{ onChange: updateDoctorZodSchema.shape.gender }}
              children={(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor="update-gender">Gender</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value as DoctorGenderValue)}
                  >
                    <SelectTrigger id="update-gender" className="w-full" size="default">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />

            <form.Field
              name="qualification"
              validators={{ onChange: updateDoctorZodSchema.shape.qualification }}
              children={(field) => (
                <AppField
                  field={field}
                  label="Qualification"
                  placeholder="MBBS, FCPS (Medicine)"
                />
              )}
            />

            <form.Field
              name="designation"
              validators={{ onChange: updateDoctorZodSchema.shape.designation }}
              children={(field) => (
                <AppField
                  field={field}
                  label="Designation"
                  placeholder="Consultant Physician"
                />
              )}
            />

            <form.Field
              name="currentWorkingPlace"
              validators={{ onChange: updateDoctorZodSchema.shape.currentWorkingPlace }}
              children={(field) => (
                <AppField
                  field={field}
                  label="Current Working Place"
                  placeholder="DMCH"
                />
              )}
            />

            <form.Field
              name="address"
              validators={{ onChange: updateDoctorZodSchema.shape.address }}
              children={(field) => (
                <AppField
                  field={field}
                  label="Address"
                  placeholder="Mirpur section2"
                />
              )}
            />
          </div>

          <form.Field
            name="specialties"
            validators={{ onChange: updateDoctorZodSchema.shape.specialties }}
            children={(field) => {
              const hasError =
                field.state.meta.isTouched && field.state.meta.errors.length > 0;

              return (
                <div className="space-y-1.5">
                  <Label>Specialties</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full justify-between"
                        >
                          <span className="truncate text-left">
                            {field.state.value.length > 0
                              ? `${field.state.value.length} selected`
                              : "Select specialties"}
                          </span>
                        </Button>
                      }
                    />

                    <DropdownMenuContent align="start" className="w-72">
                      <div className="max-h-60 overflow-y-auto">
                        {specialties.length === 0 ? (
                          <p className="px-2 py-1 text-sm text-muted-foreground">
                            No specialties found
                          </p>
                        ) : (
                          specialties.map((specialty) => (
                            <DropdownMenuCheckboxItem
                              key={specialty.id}
                              checked={field.state.value.includes(specialty.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.handleChange([
                                    ...field.state.value,
                                    specialty.id,
                                  ]);
                                  return;
                                }

                                field.handleChange(
                                  field.state.value.filter((id) => id !== specialty.id),
                                );
                              }}
                            >
                              {specialty.title}
                            </DropdownMenuCheckboxItem>
                          ))
                        )}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {hasError && (
                    <p className="text-sm text-destructive">
                      {String(field.state.meta.errors[0] ?? "Invalid value")}
                    </p>
                  )}
                </div>
              );
            }}
          />

          {serverError && (
            <Alert variant="destructive">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
            {([canSubmit, isSubmitting]) => (
              <div className="flex justify-end gap-2 border-t pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    onOpenChange(false);
                  }}
                >
                  Cancel
                </Button>
                <AppSubmitButton
                  isPending={isSubmitting}
                  disabled={!canSubmit}
                  pendingLabel="Updating..."
                  className="w-auto"
                >
                  Update Doctor
                </AppSubmitButton>
              </div>
            )}
          </form.Subscribe>
        </form>
      </DialogContent>
    </Dialog>
  );
}
