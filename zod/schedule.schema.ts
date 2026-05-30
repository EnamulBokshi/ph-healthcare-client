import z from "zod";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

export const createScheduleZodSchema = z.object({
  startDate: z
    .string()
    .refine((date) => dateRegex.test(date), {
      message: "Invalid date format (use YYYY-MM-DD)",
    })
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date",
    }),
  endDate: z
    .string()
    .refine((date) => dateRegex.test(date), {
      message: "Invalid date format (use YYYY-MM-DD)",
    })
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date",
    }),
  startTime: z.string().refine((time) => timeRegex.test(time), {
    message: "Invalid time format (use HH:MM)",
  }),
  endTime: z.string().refine((time) => timeRegex.test(time), {
    message: "Invalid time format (use HH:MM)",
  }),
});

export const updateScheduleZodSchema = z.object({
  startDate: z
    .string()
    .refine((date) => dateRegex.test(date), {
      message: "Invalid date format (use YYYY-MM-DD)",
    })
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date",
    })
    .optional(),
  endDate: z
    .string()
    .refine((date) => dateRegex.test(date), {
      message: "Invalid date format (use YYYY-MM-DD)",
    })
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date",
    })
    .optional(),
  startTime: z
    .string()
    .refine((time) => timeRegex.test(time), {
      message: "Invalid time format (use HH:MM)",
    })
    .optional(),
  endTime: z
    .string()
    .refine((time) => timeRegex.test(time), {
      message: "Invalid time format (use HH:MM)",
    })
    .optional(),
});

export type ICreateScheduleForm = z.infer<typeof createScheduleZodSchema>;
export type IUpdateScheduleForm = z.infer<typeof updateScheduleZodSchema>;
