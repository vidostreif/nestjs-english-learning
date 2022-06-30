import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
// import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [PrismaModule],
})
export class TasksModule {}
