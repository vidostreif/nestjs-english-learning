import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
// import { AuthorizationGuard } from '../tokens/authorization.guard';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [AuthModule, PrismaModule],
})
export class UsersModule {}
