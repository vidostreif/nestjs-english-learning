import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { TaskRatingController } from './task-rating.controller';
import { TaskRatingService } from './task-rating.service';

describe('TaskRatingController', () => {
  let controller: TaskRatingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskRatingController],
      providers: [TaskRatingService],
      imports: [PrismaModule, AuthModule],
    }).compile();

    controller = module.get<TaskRatingController>(TaskRatingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
