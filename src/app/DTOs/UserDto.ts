export class UserDto {
  username: string;  // Required, max length: 50
  password: string;  // Required, max length: 100
  email: string;     // Required, max length: 100
  phoneNumber: string;  // Required, max length: 10
  userRole: UserRole;  // Required, enum type

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

// Enum for UserRole (can be customized based on your system's roles)
export enum UserRole {
  Admin = 'Admin',
  User = 'User',
  Moderator = 'Moderator'
}
