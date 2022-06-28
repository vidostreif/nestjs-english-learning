import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { TokensModule } from 'src/tokens/tokens.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [TokensModule, PrismaModule],
})
export class UsersModule {}
