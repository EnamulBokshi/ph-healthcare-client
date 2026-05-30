import { ISchedule } from "./schedule.types";

export interface ICreateDoctorSchedulePayload {
  scheduleIds: string[];
}

export interface IUpdateDoctorSchedulePayload {
  scheduleIds: Array<{
    shouldDelete: boolean;
    id: string;
  }>;
}

export interface IDoctorSchedule {
  doctorId: string;
  scheduleId: string;
  isBooked: boolean;
  createdAt: string;
  updatedAt: string;
  schedule?: ISchedule;
  doctor?: {
    id: string;
    name?: string;
    email?: string;
  };
}

export interface IDoctorSchedulesResponse {
  data: IDoctorSchedule[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
