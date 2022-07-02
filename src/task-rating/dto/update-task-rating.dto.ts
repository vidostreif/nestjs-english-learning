import { PartialType } from '@nestjs/swagger';
import { CreateTaskRatingDto } from './create-task-rating.dto';

export class UpdateTaskRatingDto extends PartialType(CreateTaskRatingDto) {}
