import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

export class GetOneTaskParam {
  @ApiProperty({
    name: 'id',
    description: 'Id задания',
    example: '1',
  })
  @Type(() => Number)
  @IsInt({ message: 'id должен быть числом' })
  @Min(1)
  id: number;
}
