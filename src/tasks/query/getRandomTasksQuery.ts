import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

const default_limit = 1;

export class GetRandomTasksQuery {
  constructor(limit = default_limit) {
    this.limit = limit;
  }

  @ApiProperty({
    example: '8',
    description: 'Количество запрашиваемых заданий',
    required: false,
    default: default_limit,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit должен быть числом' })
  @Min(1)
  limit: number;

  @ApiProperty({
    example: '56',
    description: 'Id задания исключаемый из выборки',
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'not_id должен быть числом' })
  @Min(1)
  not_id?: number;
}
