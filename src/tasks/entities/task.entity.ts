import { ApiProperty } from '@nestjs/swagger';
import { Dictionary } from '@prisma/client';
import { Exclude } from 'class-transformer';
import {
  MarkersIncludeDictionary,
  TaskIncludeMarkersIncludeDictionary,
} from '../../prisma/prisma.dto';
export class DictionaryEntity implements Dictionary {
  constructor(partial: Partial<DictionaryEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ example: '1', description: 'Id текста' })
  id: number;
  @ApiProperty({ example: 'table', description: 'Текст' })
  name: string;
  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date;
}

export class MarkerEntity implements MarkersIncludeDictionary {
  constructor(partial: Partial<MarkerEntity>) {
    this.dictionary = new DictionaryEntity(partial.dictionary);
    delete partial.dictionary;
    Object.assign(this, partial);
  }

  @ApiProperty({ example: '1', description: 'Id маркера' })
  id: number;
  @ApiProperty({ example: '65', description: 'Координаты по вертикали' })
  top: number;
  @ApiProperty({ example: '56', description: 'Координаты по горизонтали' })
  left: number;
  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date;
  @ApiProperty({
    example: '1',
    description: 'Id задания к которому привязан маркер',
  })
  taskId: number;
  @Exclude()
  dictionaryId: number;
  @ApiProperty()
  dictionary: DictionaryEntity;
}

export class TaskEntity implements TaskIncludeMarkersIncludeDictionary {
  constructor(partial: Partial<TaskEntity>) {
    this.markers = partial.markers.map((marker) => new MarkerEntity(marker));
    delete partial.markers;
    Object.assign(this, partial);
  }

  @ApiProperty({ example: '1', description: 'Id задания' })
  id: number;
  @ApiProperty({
    example: 'fd8fccd7-e538-449d-a227-b41d90bf0d29.webp',
    description: 'Адрес картинки',
  })
  imgUrl: string;
  @ApiProperty({
    example: '45',
    description: 'Сколько раз прошли это задание',
  })
  numberOfPasses: number;
  @ApiProperty({
    example: '2022-06-29T18:02:57.572Z',
    description: 'Дата создания',
  })
  createdAt: Date;
  @ApiProperty({
    example: '2022-06-29T18:02:57.572Z',
    description: 'Последняя дата обновления',
  })
  updatedAt: Date;
  @ApiProperty({
    example: '3',
    description: 'Сложность задания',
    minimum: 1,
    maximum: 5,
  })
  complexity: number;
  @ApiProperty({
    example: 'false',
    description: 'Помечен на удаление',
  })
  deleted: boolean;
  @ApiProperty({ type: [MarkerEntity] })
  markers: MarkerEntity[];
}
