import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class TaskId_TaskRating_Param {
  @ApiProperty({
    name: 'id',
    description: 'Id задания',
    example: '1',
  })
  @Type(() => Number)
  @IsInt({ message: 'id должен быть числом' })
  @Min(1)
  taskId: number;
}
