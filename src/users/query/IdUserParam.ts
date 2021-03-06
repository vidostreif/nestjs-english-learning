import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class IdUserParam {
  @ApiProperty({
    name: 'id',
    description: 'Id пользователя',
    example: '1',
  })
  @Type(() => Number)
  @IsInt({ message: 'id должен быть числом' })
  @Min(1)
  id: number;
}
