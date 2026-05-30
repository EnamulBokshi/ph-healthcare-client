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
  DialogTrigger,
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
import { createDoctor } from "@/services/doctor.services";
import { DoctorGenderValue, ICreateDoctorPayload } from "@/types/doctor.types";
import { ISpecialty } from "@/types/specialty.types";
import {
  createDoctorZodSchema,
  ICreateDoctorForm,
} from "@/zod/doctor.schema";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const getApiErrorMessage = (error: unknown, fallback: string) => {
  const candidate = error as { response?: { data?: { message?: string } } };
  return candidate?.response?.data?.message || fallback;
};

interface CreateDoctorModalProps {
  specialties: ISpecialty[];
}

const defaultValues: ICreateDoctorForm = {
  password: "",
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

export default function CreateDoctorModal({ specialties }: CreateDoctorModalProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { mutateAsync } = useMutation({
    mutationFn: createDoctor,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });

  const form = useForm({
    defaultValues,
    onSubmit: async (formState) => {
      setServerError(null);
      try {
        const value = formState.value;
        const payload: ICreateDoctorPayload = {
          password: value.password,
          doctor: {
            name: value.name,
            email: value.email,
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

        const result = await mutateAsync(payload);

        if (!result?.success) {
          const message = result?.message || "Failed to create doctor";
          setServerError(message);
          toast.error(message);
          return;
        }

        toast.success(result?.message || "Doctor created successfully");
        form.reset();
        setOpen(false);
      } catch (error: unknown) {
        const message = getApiErrorMessage(error, "Failed to create doctor");
        setServerError(message);
        toast.error(message);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen} disablePointerDismissal>
      <DialogTrigger
        render={
          <Button type="button" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Create Doctor
          </Button>
        }
      />

      <DialogContent
        className="sm:max-w-6xl p-0"
      >
        <DialogHeader className="px-4 pt-4">
          <DialogTitle>Create New Doctor</DialogTitle>
          <DialogDescription>
            Fill in required details and submit to create a doctor account.
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
              validators={{ onChange: createDoctorZodSchema.shape.name }}
              children={(field) => (
                <AppField field={field} label="Name" placeholder="Dr. Enamul" />
              )}
            />

            <form.Field
              name="email"
              validators={{ onChange: createDoctorZodSchema.shape.email }}
              children={(field) => (
                <AppField
                  field={field}
                  label="Email"
                  type="email"
                  placeholder="doctor@example.com"
                />
              )}
            />

            <form.Field
              name="password"
              validators={{ onChange: createDoctorZodSchema.shape.password }}
              children={(field) => (
                <AppField
                  field={field}
                  label="Password"
                  type="password"
                  placeholder="doctor123"
                />
              )}
            />

            <form.Field
              name="contactNumber"
              validators={{ onChange: createDoctorZodSchema.shape.contactNumber }}
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
              validators={{ onChange: createDoctorZodSchema.shape.registrationNumber }}
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
              validators={{ onChange: createDoctorZodSchema.shape.experience }}
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
              validators={{ onChange: createDoctorZodSchema.shape.appointmentFee }}
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
              validators={{ onChange: createDoctorZodSchema.shape.gender }}
              children={(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value as DoctorGenderValue)}
                  >
                    <SelectTrigger id="gender" className="w-full" size="default">
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
              validators={{ onChange: createDoctorZodSchema.shape.qualification }}
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
              validators={{ onChange: createDoctorZodSchema.shape.designation }}
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
              validators={{ onChange: createDoctorZodSchema.shape.currentWorkingPlace }}
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
              validators={{ onChange: createDoctorZodSchema.shape.address }}
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
            validators={{ onChange: createDoctorZodSchema.shape.specialties }}
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
                    form.reset();
                    setOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <AppSubmitButton
                  isPending={isSubmitting}
                  disabled={!canSubmit}
                  pendingLabel="Creating..."
                  className="w-auto"
                >
                  Create Doctor
                </AppSubmitButton>
              </div>
            )}
          </form.Subscribe>
        </form>
      </DialogContent>
    </Dialog>
  );
}
