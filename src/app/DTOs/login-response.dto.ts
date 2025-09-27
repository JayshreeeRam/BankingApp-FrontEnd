import { UserRole } from "../Enum/UserRole 1";
export interface User {
    username: string;
    email: string;
    role: string|UserRole; // Adjust this to match the actual role type (it could be an enum)
}

export interface LoginResponseDTO {
    token: string;
    // user: User;
    username: string;
    role: string|UserRole;
}