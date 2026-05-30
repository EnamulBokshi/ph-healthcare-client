"use server";

import { httpClient } from "@/lib/axios/httpClient";
import {
  ICreateDoctorSchedulePayload,
  IDoctorSchedule,
  IUpdateDoctorSchedulePayload,
} from "@/types/doctor-schedule.types";

export const getMyDoctorSchedules = async (queryString?: string) => {
  try {
    const endPoint =
      "/doctor-schedules/my-doctor-schedules" +
      (queryString ? `?${queryString}` : "");
    return await httpClient.get<IDoctorSchedule[]>(endPoint);
  } catch (error) {
    console.error("Error fetching doctor schedules: ", error);
    throw error;
  }
};

export const createMyDoctorSchedule = async (
  payload: ICreateDoctorSchedulePayload,
) => {
  try {
    return await httpClient.post<IDoctorSchedule[]>(
      "/doctor-schedules/create-my-doctor-schedule",
      payload,
    );
  } catch (error) {
    console.error("Error creating doctor schedule: ", error);
    throw error;
  }
};

export const updateMyDoctorSchedule = async (
  payload: IUpdateDoctorSchedulePayload,
) => {
  try {
    return await httpClient.patch<unknown>(
      "/doctor-schedules/update-my-doctor-schedule",
      payload,
    );
  } catch (error) {
    console.error("Error updating doctor schedule: ", error);
    throw error;
  }
};

export const deleteMyDoctorSchedule = async (scheduleId: string) => {
  try {
    return await httpClient.delete<null>(
      `/doctor-schedules/delete-my-doctor-schedule/${scheduleId}`,
    );
  } catch (error) {
    console.error("Error deleting doctor schedule: ", error);
    throw error;
  }
};
