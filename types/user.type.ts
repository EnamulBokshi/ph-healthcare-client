import { UserRole } from "./auth.types";

export interface UserInfo{
    id: number;
    name: string;
    email: string;
    role: UserRole;
    
}

export enum UserStatus{
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    SUSPENDED = "SUSPENDED",
    DELETED = "DELETED"
}