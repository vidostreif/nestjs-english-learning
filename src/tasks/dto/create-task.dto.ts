import {
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsNumberString,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import {
  markerIncludeDictionary,
  MarkersIncludeDictionary,
  taskIncludeMarkersIncludeDictionary,
} from '../../prisma/prisma.dto';
import { plainToClass, Transform, Type } from 'class-transformer';
import { Prisma } from '@prisma/client';

export class CreateTaskDto {
  @IsOptional()
  // @IsNumberString()
  @Type(() => Number)
  @IsInt({ message: 'id не число' })
  id!: number | null;

  // @IsNumberString()
  @Type(() => Number)
  @IsInt({ message: 'сложность не число' })
  complexity: number;

  @IsNotEmpty()
  @Transform(({ value }) => plainToClass(MarkerDTO, JSON.parse(value)))
  // @ValidateNested({ each: true })
  // @Type((mar) => {
  //   console.log(mar.object);
  //   return MarkerDTO;
  // })
  // @IsNotEmptyObject({}, { message: 'нет маркеров' })
  markers: MarkerDTO[];
}

class MarkerDTO {
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  left: number;

  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  top: number;

  @IsNotEmpty()
  dictionary: any;
}
