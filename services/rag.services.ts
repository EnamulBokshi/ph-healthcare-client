import { httpClient } from "@/lib/axios/httpClient";

export type RagQueryPayload = {
    query: string;
    limit?: number;
    sourceType?:string;

}

export interface IRagSource {
    id: string;
    content: string;
    similarity: number;
    metadata?: {
        name?: string;
        [key: string]: unknown;
    }

    sourceType?: string;
}

export interface IRagQueryResponse {
    answer: any;
    sources: IRagSource[];
    contextUsed: string;
}



export interface IIngestDoctorsData {
    success: boolean;
    message: string;
    indexedCount: number;
}

export const queryRagService = async (payload: RagQueryPayload) => {
    const response = await httpClient.post<IRagQueryResponse>("/rag/query", payload);
    return response;
}

export const ingestDoctorService = async()=>{
    const response = await httpClient.post<IIngestDoctorsData>("/rag/ingest-doctor", {});
    return response;
}