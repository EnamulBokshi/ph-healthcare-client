export interface ICreateSchedulePayload {
  startDate: string; // ISO date string (YYYY-MM-DD)
  endDate: string; // ISO date string (YYYY-MM-DD)
  startTime: string; // Time string (HH:MM)
  endTime: string; // Time string (HH:MM)
}

export interface IUpdateSchedulePayload {
  startDate?: string; // ISO date string (YYYY-MM-DD)
  endDate?: string; // ISO date string (YYYY-MM-DD)
  startTime?: string; // Time string (HH:MM)
  endTime?: string; // Time string (HH:MM)
}

export interface ISchedule {
  id: string;
  startDateTime: string; // ISO datetime string
  endDateTime: string; // ISO datetime string
  createdAt?: string;
  updatedAt?: string;
  appointments?: Array<{
    id: string;
    [key: string]: unknown;
  }>;
  doctorSchedules?: Array<{
    doctorId: string;
    scheduleId: string;
    isBooked: boolean;
    createdAt?: string;
    updatedAt?: string;
  }>;
}

export interface IScheduleMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ISchedulesResponse {
  data: ISchedule[];
  meta: IScheduleMeta;
}
