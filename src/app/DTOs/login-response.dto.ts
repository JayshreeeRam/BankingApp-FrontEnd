import { UserRole } from "../Enum/UserRole 1";
export interface User {
    username: string;
    email: string;
    role: string|UserRole; 
}

export interface LoginResponseDTO {
    token: string;
    
    username: string;
    role: string|UserRole;
}