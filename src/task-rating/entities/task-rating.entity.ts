import { ApiProperty } from '@nestjs/swagger';
import { TaskRating } from '@prisma/client';

export class TaskRatingEntity implements TaskRating {
  constructor(partial: Partial<TaskRatingEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ example: '1', description: 'Id оценки' })
  id: number;
  @ApiProperty({ example: '2', description: 'Id пользователя' })
  userId: number;
  @ApiProperty({ example: '3', description: 'Id задания' })
  taskId: number;
  @ApiProperty({
    example: '60',
    description: 'Оценка',
    minimum: 0,
    maximum: 100,
  })
  rating: number;
}
