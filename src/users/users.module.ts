import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
// import { AuthorizationGuard } from '../tokens/authorization.guard';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [AuthModule, PrismaModule],
})
export class UsersModule {}
