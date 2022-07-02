import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { TaskRatingService } from './task-rating.service';
import { Request } from 'express';
import { CreateTaskRatingDto } from './dto/create-task-rating.dto';
import { UpdateTaskRatingDto } from './dto/update-task-rating.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthorizationGuard } from '../auth/authorization.guard';
import { Roles } from '../auth/rolesAuth.decorator';
import { TaskRatingEntity } from './entities/task-rating.entity';
import { GetTasksRatingsQuery } from './query/GetTasksRatingsQuery';

@ApiTags('Рейтин заданий')
@Controller('/api/task_rating')
export class TaskRatingController {
  constructor(private readonly taskRatingService: TaskRatingService) {}

  @ApiOperation({ summary: 'Создать или обновить оценку задания' })
  @ApiResponse({ status: 200, type: Number })
  @ApiBearerAuth('all')
  @Roles('all')
  @UseGuards(AuthorizationGuard)
  @Post()
  create(
    @Body() createTaskRatingDto: CreateTaskRatingDto,
    @Req() req: Request,
  ) {
    const userId = req.user.id;
    return this.taskRatingService.create(
      +userId,
      createTaskRatingDto.taskId,
      createTaskRatingDto.rating,
    );
  }

  @ApiOperation({ summary: 'Найти оценки по параметрам' })
  @ApiResponse({ status: 200, type: TaskRatingEntity })
  @ApiBearerAuth('administrator')
  @Roles('administrator')
  @UseGuards(AuthorizationGuard)
  @Get()
  findAll(@Query() getTasksRatingsQuery: GetTasksRatingsQuery) {
    return this.taskRatingService.findAll(getTasksRatingsQuery);
  }

  @ApiOperation({ summary: 'Найти оценки текущего пользователя' })
  @ApiResponse({ status: 200, type: TaskRatingEntity })
  @ApiBearerAuth('all')
  @Roles('all')
  @UseGuards(AuthorizationGuard)
  @Get('/your')
  findAllForUser(@Req() req: Request) {
    const userId = req.user.id;
    return this.taskRatingService.findAll({ userId: +userId });
  }

  @ApiOperation({ summary: 'Получить оценку задания по id' })
  @ApiResponse({ status: 200, type: TaskRatingEntity })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskRatingService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskRatingDto: UpdateTaskRatingDto,
  ) {
    return this.taskRatingService.update(+id, updateTaskRatingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskRatingService.remove(+id);
  }
}
