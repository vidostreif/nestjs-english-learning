// import { UserRole, User as UserPrisma } from '@prisma/client';
// import { Exclude } from 'class-transformer';
import { UserIncludeRole } from 'src/prisma/prisma.dto';

export class UserWithTokens implements UserIncludeRole {
  id: number;
  name: string;
  email: string;
  isActivated: boolean;
  userRole: { name: string };

  lifetimeAccessToken: number;
  accessToken: string;
  refreshToken: string;
}
