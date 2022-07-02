import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class GetTasksRatingsQuery {
  // constructor(limit = default_limit, page = default_page) {
  //   this.limit = limit;
  //   this.page = page;
  // }

  @ApiProperty({
    example: '2',
    description: 'Id задания',
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'taskId должен быть числом' })
  @Min(1)
  taskId?: number;

  @ApiProperty({
    example: '1',
    description: 'Id пользователя',
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'userId должен быть числом' })
  @Min(1)
  userId?: number;
}
