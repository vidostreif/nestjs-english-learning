import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { plainToClass, Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class DictionaryDTO {
  @ApiProperty({ example: 'table', description: 'Текст' })
  @ApiProperty({
    example: 'table',
    description: 'Текст',
    minLength: 1,
    maxLength: 200,
    required: true,
  })
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(200)
  name: string;
}

class MarkerDTO {
  @ApiProperty({
    example: '34',
    description: 'Координаты по горизонтали',
    minimum: 0,
    maximum: 100,
    required: true,
  })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  @Max(100)
  left: number;

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
  top: number;

  @ApiProperty()
  @IsNotEmpty()
  dictionary: DictionaryDTO;
}

export class CreateTaskDto {
  @ApiProperty({
    example: '1',
    description: 'Id задания (если нет, создается новое задание)',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'id не число' })
  id!: number | null;

  @ApiProperty({
    example: '3',
    description: 'Сложность задания',
    minimum: 1,
    maximum: 5,
    required: true,
  })
  @Type(() => Number)
  @IsInt({ message: 'сложность не число' })
  complexity: number;

  @ApiProperty({
    type: 'file',
    example: 'foto.jpeg',
    description: 'Картинка задания',
    required: false,
  })
  img!: Express.Multer.File;

  @ApiProperty({ type: MarkerDTO, isArray: true })
  @IsNotEmpty()
  @Transform(({ value }) => plainToClass(MarkerDTO, JSON.parse(value)))
  // @Transform(({ value }) => {
  //   if (Array.isArray(value)) {
  //     // try {
  //     console.log(value);

  //     return value.map((i) => plainToClass(MarkerDTO, JSON.parse(i)));
  //     // } catch (error) {
  //     //   throw new HttpException(
  //     //     `Не удалось распарсить параметр markers`,
  //     //     HttpStatus.BAD_REQUEST,
  //     //   );
  //     // }
  //   } else {
  //     throw new HttpException(
  //       `Параметр markers не массив маркеров`,
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // })
  // @IsArray({ message: 'параметр markers должен быть массивом маркеров' })
  // @ArrayMinSize(1, { message: 'количество маркеров не должно быть меньше 1' })
  // @ArrayMaxSize(50)
  // @ValidateNested({ each: true })
  // @Type((i) => {
  //   console.log(i);
  //   return MarkerDTO;
  // })
  // @IsNotEmptyObject({}, { message: 'нет маркеров' })
  markers: MarkerDTO[];
}
