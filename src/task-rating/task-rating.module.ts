import { Module } from '@nestjs/common';
import { TaskRatingService } from './task-rating.service';
import { TaskRatingController } from './task-rating.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [TaskRatingController],
  providers: [TaskRatingService],
  imports: [PrismaModule, AuthModule],
})
export class TaskRatingModule {}
