"use server";

import { httpClient } from "@/lib/axios/httpClient";
import {
  ICreateDoctorPayload,
  IDoctor,
  IUpdateDoctorPayload,
} from "@/types/doctor.types";

export const getDoctors = async (queryString?: string) => {
  try {
    const endPoint = "/doctors" + (queryString ? `?${queryString}` : "");
    return await httpClient.get<IDoctor[]>(endPoint);
  } catch (error) {
    console.error("Error fetching doctors: ", error);
    throw error;
  }
};

export const getDoctorById = async (doctorId: string) => {
  try {
    return await httpClient.get<IDoctor>(`/doctors/${doctorId}`);
  } catch (error) {
    console.error("Error fetching doctor details: ", error);
    throw error;
  }
};

export const createDoctor = async (payload: ICreateDoctorPayload) => {
  try {
    return await httpClient.post<IDoctor>("/users/create-doctor", payload);
  } catch (error) {
    console.error("Error creating doctor: ", error);
    throw error;
  }
};

export const updateDoctor = async (doctorId: string, payload: IUpdateDoctorPayload) => {
  try {
    return await httpClient.patch<IDoctor>(`/doctors/${doctorId}`, payload);
  } catch (error) {
    console.error("Error updating doctor: ", error);
    throw error;
  }
};

export const deleteDoctor = async (doctorId: string) => {
  try {
    return await httpClient.delete<null>(`/doctors/${doctorId}`);
  } catch (error) {
    console.error("Error deleting doctor: ", error);
    throw error;
  }
};
