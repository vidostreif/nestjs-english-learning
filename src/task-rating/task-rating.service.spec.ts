import { Test, TestingModule } from '@nestjs/testing';
import { TaskRatingService } from './task-rating.service';

describe('TaskRatingService', () => {
  let service: TaskRatingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskRatingService],
    }).compile();

    service = module.get<TaskRatingService>(TaskRatingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
