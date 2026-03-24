"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ISpecialty } from "@/types/specialty.types";

export const getSpecialties = async () => {
  try {
    return await httpClient.get<ISpecialty[]>("/specialties");
  } catch (error) {
    console.error("Error fetching specialties:", error);
    throw error;
  }
};
