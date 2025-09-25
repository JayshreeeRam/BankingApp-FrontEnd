

import { UserRole } from "../DTOs/RegisterDto";

export class User {
  userId!: number;
  username!: string;
  password!: string;
  email!: string;
  phoneNumber!: string;
  userRole!: UserRole;

  // Optional: Related data (if needed in frontend later)
  // documents?: Document[];
  // reports?: Report[];
}
