"use server"

import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { ApiErrorResponse } from "@/types/api.types";
import { ILoginResponse } from "@/types/auth.types";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.shcema";
import { redirect } from "next/navigation";

export const loginAction = async (payload:ILoginPayload): Promise<ILoginResponse|ApiErrorResponse> => {
    // console.log("Login action called with payload:", payload);
    const parsedPayload = loginZodSchema.safeParse(payload);
    
    if (!parsedPayload.success) {
        const firstError = parsedPayload.error.issues[0].message || "Invalid input";

        return {
            success: false,
            message: firstError,
        }
    }
    try {
        const response = await httpClient.post<ILoginResponse>('auth/sign-in/email', parsedPayload.data);
        const {accessToken, refreshToken, token} = response.data;
        console.log("Login successful, received tokens:", { accessToken, refreshToken, token });
        await setTokenInCookies("accessToken", accessToken);
        await setTokenInCookies("refreshToken", refreshToken);
        await setTokenInCookies("better-auth.session_token", token);

        redirect("/dashboard");
    } catch (error) {
        if(error && typeof error === "object" && "digest" in error && typeof error.digest === "string" && error.digest.startsWith("NEXT_REDIRECT")){
            throw error; // Rethrow redirect errors to be handled by Next.js
        }
        return {
            success: false,
            message: error instanceof Error ? error.message : "An unknown error occurred",
        }
    }
}