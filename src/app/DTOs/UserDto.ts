import { UserRole } from "../Enum/UserRole 1";

export interface UserDto {
  userId: number;
  username: string;
  email: string;
  phoneNumber: string;
  userRole: UserRole;
  documents: any[]; 
}
