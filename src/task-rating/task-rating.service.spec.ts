import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { TaskRatingService } from './task-rating.service';

describe('TaskRatingService', () => {
  let service: TaskRatingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskRatingService],
      imports: [PrismaModule, AuthModule],
    }).compile();

    service = module.get<TaskRatingService>(TaskRatingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
