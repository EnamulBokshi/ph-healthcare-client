"use server";

import { ingestDoctorService, queryRagService, RagQueryPayload } from "@/services/rag.services";

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

              if (doctor.name) text += `${index + 1}. ***${doctor.name}\n***`;
              if (doctor.specialty) text += `Specialty: ${doctor.specialty}\n`;
              if (doctor.reason) text += `Reason: ${doctor.reason}\n`;

              return text;
            });
        } else{
          answer = "I couldn't find any doctors that match your query. Please try rephrasing your question or providing more details.";

        }
      }
      else {
        answer = JSON.stringify(answer, null, 2);
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
   
    return {
      success: false,
      error: "An error occurred while processing your request. Please try again later.",
    }
  }
};


export const ingestDoctorAction = async () => {
  try {
    const response = await ingestDoctorService();
    if (!response?.data) {
      return {
        success: false,
        error: "No data found in the response",
      };
    }
    return {
      success: response.data.success,
      message: response.data.message ?? response.message ?? "No message provided",
      indexedCount: response.data.indexedCount,
    };

  }
  catch (error) {
    console.error("Error in ingestDoctorAction:", error);
    return {
      success:false,
      error: "An error occurred while processing your request. Please try again later.",  
    }
  }
}


export const getUserRoleAction = async( ) => {
  try {
    const {getUserInfo} = await import("@/services/auth.services");
    const userInfoResponse = await getUserInfo();
    return userInfoResponse.role ?? null;
  } catch (error) {
    console.error("Error in getUserRoleAction:", error);
    return null;
  }
}