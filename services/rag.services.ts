import { httpClient } from "@/lib/axios/httpClient";

type RagQueryPayload = {
    query: string;
    limit?: number;
    sourceType?:string;

}

export const queryRagService = async (payload: RagQueryPayload) => {
    const response = await httpClient.post("/rag/query", payload);
    return response;
}

export const ingestDoctorService = async()=>{
    const response = await httpClient.post("/rag/ingest-doctor", {});
    return response;
}