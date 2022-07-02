import { Test, TestingModule } from '@nestjs/testing';
import { TaskRatingController } from './task-rating.controller';
import { TaskRatingService } from './task-rating.service';

describe('TaskRatingController', () => {
  let controller: TaskRatingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskRatingController],
      providers: [TaskRatingService],
    }).compile();

    controller = module.get<TaskRatingController>(TaskRatingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
