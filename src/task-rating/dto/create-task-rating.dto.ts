import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, Max, Min } from 'class-validator';

export class CreateTaskRatingDto {
  // @ApiProperty({
  //   example: '1',
  //   description: 'Id пользователя',
  //   required: true,
  // })
  // @Type(() => Number)
  // @IsInt({ message: 'userId не число' })
  // userId: number;

  @ApiProperty({
    example: '1',
    description: 'Id задания',
    required: true,
  })
  @Type(() => Number)
  @IsInt({ message: 'taskId не число' })
  taskId: number;

  @ApiProperty({
    example: '43',
    description: 'Координаты по вертикали',
    minimum: 0,
    maximum: 100,
    required: true,
  })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  @Max(100)
  rating: number;
}
