import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

export class GetTasksRatingsQuery {
  // constructor(limit = default_limit, page = default_page) {
  //   this.limit = limit;
  //   this.page = page;
  // }

  @ApiProperty({
    example: '4',
    description: 'Id оценки задания',
    required: false,
    // default: default_limit,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'id должен быть числом' })
  @Min(1)
  id?: number;

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
