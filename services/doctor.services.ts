"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IDoctor } from "@/types/doctor.types";

export const getDoctors = async (queryString?: string) => {
  try {
    const endPoint = "/doctors" + (queryString ? `?${queryString}` : "");
    console.log("Fetching doctors with endpoint: ", endPoint);
    const doctors = await httpClient.get<IDoctor[]>(endPoint);
    console.log("Fetched doctors: ", doctors);
    return doctors;
  } catch (error) {
    console.error("Error fetching doctors: ", error);
    throw error;
  }
};
