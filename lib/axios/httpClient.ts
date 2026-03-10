import { ApiResponse } from '@/types/api.types';
import axios from  'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if(!API_BASE_URL){
    throw new Error("API_BASE_URL is not defined in environment variables");
}


const axiosInstance = ()=> {
    const instance = axios.create({
        baseURL: API_BASE_URL,
        timeout: 30000,
        headers: {
            "Content-Type": 'application/json',
        }
    })

    return instance
}

export interface ApiReqeustOptions {
    params?: Record<string, unknown>,
    headers?: Record<string, string>,
}

const httpGet = async<TData>(endPoint: string, options?: ApiReqeustOptions):Promise<ApiResponse<TData>> => {
    try {
        const instance = axiosInstance();
        const response = await instance.get<ApiResponse<TData>>(endPoint, {
            params: options?.params,
            headers: options?.headers
        });

        return response.data;
        
    } catch (error) {
        console.error(`GET request to ${endPoint} failed: `, error);
        throw error;
    }
}

const httpPost = async<TData>(endPoint: string, data: unknown, options?: ApiReqeustOptions):Promise<ApiResponse<TData>> => {
    try {
        const instance = axiosInstance();
        const response = await instance.post<ApiResponse<TData>>(endPoint, data, {
            params: options?.params,
            headers: options?.headers
        });

        return response.data;
        
    } catch (error) {
        console.error(`POST request to ${endPoint} failed: `, error);
        throw error;
    }
}

const httpPut = async<TData>(endPoint: string, data: unknown, options?: ApiReqeustOptions):Promise<ApiResponse<TData>> => {
    try {
        const instance = axiosInstance();
        const response = await instance.put<ApiResponse<TData>>(endPoint, data, {
            params: options?.params,
            headers: options?.headers
        });

        return response.data;
        
    } catch (error) {
        console.error(`PUT request to ${endPoint} failed: `, error);
        throw error;
    }
}

const httpDelete = async<TData>(endPoint: string, options?: ApiReqeustOptions):Promise<ApiResponse<TData>> => {
    try {
        const instance = axiosInstance();
        const response = await instance.delete<ApiResponse<TData>>(endPoint, {
            params: options?.params,
            headers: options?.headers
        });

        return response.data;
        
    } catch (error) {
        console.error(`DELETE request to ${endPoint} failed: `, error);
        throw error;
    }   
}

const httpPatch = async<TData>(endPoint: string, data: unknown, options?: ApiReqeustOptions):Promise<ApiResponse<TData>> => {
    try {
        const instance = axiosInstance();
        const response = await instance.patch<ApiResponse<TData>>(endPoint, data, {
            params: options?.params,
            headers: options?.headers
        });

        return response.data;
        
    } catch (error) {
        console.error(`PATCH request to ${endPoint} failed: `, error);
        throw error;
    }   
}
export const httpClient = {
    get: httpGet,
    put: httpPut,
    delete: httpDelete,
    patch: httpPatch,
    post: httpPost,
}