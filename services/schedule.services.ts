"use server";

import { httpClient } from "@/lib/axios/httpClient";
import {
  ICreateSchedulePayload,
  ISchedule,
  IUpdateSchedulePayload,
} from "@/types/schedule.types";

export const getSchedules = async (queryString?: string) => {
  try {
    const endPoint = "/schedules" + (queryString ? `?${queryString}` : "");
    return await httpClient.get<ISchedule[]>(endPoint);
  } catch (error) {
    console.error("Error fetching schedules: ", error);
    throw error;
  }
};

export const getScheduleById = async (scheduleId: string) => {
  try {
    return await httpClient.get<ISchedule>(`/schedules/${scheduleId}`);
  } catch (error) {
    console.error("Error fetching schedule details: ", error);
    throw error;
  }
};

export const createSchedule = async (payload: ICreateSchedulePayload) => {
  try {
    return await httpClient.post<ISchedule[]>("/schedules", payload);
  } catch (error) {
    console.error("Error creating schedule: ", error);
    throw error;
  }
};

export const updateSchedule = async (
  scheduleId: string,
  payload: IUpdateSchedulePayload
) => {
  try {
    return await httpClient.patch<ISchedule>(`/schedules/${scheduleId}`, payload);
  } catch (error) {
    console.error("Error updating schedule: ", error);
    throw error;
  }
};

export const deleteSchedule = async (scheduleId: string) => {
  try {
    return await httpClient.delete<null>(`/schedules/${scheduleId}`);
  } catch (error) {
    console.error("Error deleting schedule: ", error);
    throw error;
  }
};
