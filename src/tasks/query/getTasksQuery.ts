import { ApiParam, ApiProperty, ApiQuery } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

const default_limit = 10;
const default_page = 1;

export enum sortEnum {
  newFirst = 'newFirst',
  popularFirst = 'popularFirst',
  hardFirst = 'hardFirst',
  easyFirst = 'easyFirst',
  highlyRatedFirst = 'highlyRatedFirst',
  lowRatedFirst = 'lowRatedFirst',
}

export class GetTasksQuery {
  constructor(limit = default_limit, page = default_page) {
    this.limit = limit;
    this.page = page;
  }

  @ApiProperty({
    example: '8',
    description: 'Количество запрашиваемых заданий',
    type: Number,
    required: false,
    default: default_limit,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit должен быть числом' })
  @Min(1)
  limit!: number;

  @ApiProperty({
    example: '2',
    description: 'Номер страницы',
    type: Number,
    required: false,
    default: default_page,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page должен быть числом' })
  @Min(1)
  page!: number;

  @ApiProperty({
    example: '3',
    description: 'Сложность',
    type: Number,
    required: false,
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map((i) => Number(i)) : Number(value),
  )
  @IsInt({
    message: 'complexity должен быть числом или массивом чисел',
    each: true,
  })
  @Min(1, { each: true })
  @Max(5, { each: true })
  complexity!: number | number[];

  @ApiProperty({
    example: sortEnum.newFirst,
    description: 'Сортировка',
    enum: sortEnum,
    required: false,
  })
  @IsOptional()
  // @Type(() => String)
  @IsEnum(sortEnum, { message: 'sort не из списка сортировок' })
  sort!: sortEnum;
}
