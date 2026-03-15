import { UserRole } from "./auth.types";

export interface UserInfo{
    id: number;
    name: string;
    email: string;
    role: UserRole;
    
}