import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

import { TokenModule } from 'src/token/token.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [TokenModule, PrismaModule],
})
export class UserModule {}
