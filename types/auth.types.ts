import { loginZodSchema } from "@/zod/auth.shcema";

export interface ILoginResponse {
    token: string;
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
        image?: string;
        isDeleted: boolean;
        emailVerified: boolean;
        status: string;
        needPasswordChange: boolean;
    }
}


export enum UserRole {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    DOCTOR = "DOCTOR",
    PATIENT = "PATIENT",
}