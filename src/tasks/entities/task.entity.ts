import { ApiProperty } from '@nestjs/swagger';
import { Dictionary, Task } from '@prisma/client';
import { Exclude } from 'class-transformer';
import {
  MarkersIncludeDictionary,
  TaskIncludeMarkersIncludeDictionary,
} from '../../prisma/prisma.dto';

export class TaskEntity implements Task {
  constructor(partial: Partial<TaskEntity>) {
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

  @Exclude()
  deleted: boolean;
}

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

export class MarkerIncludeDictionaryEntity implements MarkersIncludeDictionary {
  constructor(partial: Partial<MarkerIncludeDictionaryEntity>) {
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

export class TaskIncludeMarkersIncludeDictionaryEntity
  extends TaskEntity
  implements TaskIncludeMarkersIncludeDictionary
{
  constructor(partial: Partial<TaskIncludeMarkersIncludeDictionaryEntity>) {
    super(partial);
    this.markers = partial.markers.map(
      (marker) => new MarkerIncludeDictionaryEntity(marker),
    );
    delete partial.markers;
    Object.assign(this, partial);
  }

  @ApiProperty({ type: [MarkerIncludeDictionaryEntity] })
  markers: MarkerIncludeDictionaryEntity[];
}

export class TaskIncludeRatingEntity extends TaskEntity {
  constructor(partial: Partial<TaskEntity>) {
    super(partial);
    Object.assign(this, partial);
  }

  @ApiProperty({
    example: '75',
    description: 'Рейтинг задания',
    minimum: 0,
    maximum: 100,
  })
  rating: number;
}
