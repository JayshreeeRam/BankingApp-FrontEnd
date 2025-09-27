import { UserRole } from "../Enum/UserRole 1";

export interface LoginDto {
  username: string;
  password: string;
  role: string|UserRole;
}
