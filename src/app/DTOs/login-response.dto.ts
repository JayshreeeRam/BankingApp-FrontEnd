export interface User {
    username: string;
    email: string;
    role: string; // Adjust this to match the actual role type (it could be an enum)
}

export interface LoginResponseDTO {
    token: string;
    user: User;
    username: string;
}
