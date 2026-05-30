import z from "zod";

export const createDoctorZodSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters long"),
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  contactNumber: z.string().min(6, "Contact number is required"),
  address: z.string().min(1, "Address is required"),
  registrationNumber: z.string().min(1, "Registration number is required"),
  experience: z
    .string()
    .min(1, "Experience is required")
    .regex(/^\d+$/, "Experience must be a valid number"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  appointmentFee: z
    .string()
    .min(1, "Appointment fee is required")
    .regex(/^\d+(\.\d+)?$/, "Appointment fee must be a valid number"),
  qualification: z.string().min(1, "Qualification is required"),
  designation: z.string().min(1, "Designation is required"),
  currentWorkingPlace: z.string().min(1, "Current working place is required"),
  specialties: z.array(z.string()).min(1, "Select at least one specialty"),
});

export type ICreateDoctorForm = z.infer<typeof createDoctorZodSchema>;

export const updateDoctorZodSchema = createDoctorZodSchema.omit({
  password: true,
});

export type IUpdateDoctorForm = z.infer<typeof updateDoctorZodSchema>;
