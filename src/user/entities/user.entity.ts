// import { UserRole, User as UserPrisma } from '@prisma/client';
// import { Exclude } from 'class-transformer';
import { UserIncludeRole } from 'prisma/prisma';

export class User implements UserIncludeRole {
  id: number;
  name: string;
  email: string;
  isActivated: boolean;
  userRole: { name: string };
}
