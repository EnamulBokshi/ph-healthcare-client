"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IReview } from "@/types/review.types";

export const getReviews = async () => {
  try {
    return await httpClient.get<IReview[]>("/reviews");
  } catch (error) {
    console.error("Error fetching reviews: ", error);
    throw error;
  }
};
