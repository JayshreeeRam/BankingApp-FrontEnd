import { UserRole } from "../Enum/UserRole 1";

export class UserDto {
  userId: number;
  username: string;
  email: string;
  phoneNumber: string;
  userRole:UserRole;
  documents: any[];

  constructor(
    userId: number,
    username: string,
    email: string,
    phoneNumber: string,
    userRole: UserRole,
    documents: any[] = []
  ) {
    this.userId = userId;
    this.username = username;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.userRole = userRole;
    this.documents = documents;
  }
}
