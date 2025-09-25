export enum UserRole {
  Admin = 'Admin',
  User = 'User',
  Manager = 'Manager',
}

export class RegisterDto {
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
  userRole: UserRole;

  constructor(
    username: string,
    password: string,
    email: string,
    phoneNumber: string,
    userRole: UserRole
  ) {
    this.username = username;
    this.password = password;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.userRole = userRole;
  }
}
