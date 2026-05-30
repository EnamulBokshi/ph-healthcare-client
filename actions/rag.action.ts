"use server";

import { queryRagService, RagQueryPayload } from "@/services/rag.services";

export const queryRagAction = async (payload: RagQueryPayload) => {
  try {
    const response = await queryRagService(payload);
    if (!response?.data?.answer) {
      return {
        success: false,
        error: "No answer found in the response",
      };
    }
    let answer = response.data?.answer;
    if (typeof answer === "object" && answer !== null) {
      if ("doctors" in answer && Array.isArray(answer.doctors)) {
        const doctors = answer.doctors.slice(0, 5);

        if (doctors.length > 0) {
          answer =
            `I found ${doctors.length} doctors who match your query. \n\n` +
            `Here are their names:\n` +
            doctors.map((doctor: any, index: number) => {
              let text = "";

              if (doctor.name) text += `Name: ${doctor.name}\n`;
              if (doctor.specialty) text += `Specialty: ${doctor.specialty}\n`;
              if (doctor.reason) text += `Reason: ${doctor.reason}\n`;

              return `${index + 1}. ${text}`;
            });
        }
      }
    }
    let sources = 100 - Number(response.data?.sources[0]?.similarity) * 100;
    return {
      success: true,
      answer,
      sources: `${sources.toFixed(2)}% similar source found`,
    };
  } catch (error) {
    console.error("Error in queryRagAction:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

