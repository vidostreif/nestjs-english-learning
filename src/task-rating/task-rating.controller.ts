import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { TaskRatingService } from './task-rating.service';
import { Request } from 'express';
import { CreateTaskRatingDto } from './dto/create-task-rating.dto';
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
import { TaskId_TaskRating_Param } from './query/taskId-taskRating-param';

@ApiTags('Рейтинг заданий')
@Controller('tasks_ratings')
export class TaskRatingController {
  constructor(private readonly taskRatingService: TaskRatingService) {}

  @ApiOperation({
    summary: 'Создать или обновить оценку задания',
  })
  @ApiResponse({
    status: 200,
    type: Number,
    description: 'Оценка',
  })
  @ApiBearerAuth('all')
  @Roles('all')
  @UseGuards(AuthorizationGuard)
  @Post('/your')
  async create(
    @Body() createTaskRatingDto: CreateTaskRatingDto,
    @Req() req: Request,
  ) {
    const userId = req.user.id;
    return this.taskRatingService.createOrUpdate(
      +userId,
      createTaskRatingDto.taskId,
      createTaskRatingDto.rating,
    );
  }

  @ApiOperation({ summary: 'Найти оценки текущего пользователя' })
  @ApiResponse({ status: 200, type: [TaskRatingEntity] })
  @ApiBearerAuth('all')
  @Roles('all')
  @UseGuards(AuthorizationGuard)
  @Get('/your')
  async findAllForUser(@Req() req: Request) {
    const userId = req.user.id;
    const taskRatings = (await this.taskRatingService.findAll({
      userId: +userId,
    })) as TaskRatingEntity[];

    return taskRatings;
  }

  @ApiOperation({
    summary: 'Найти оценку текущего пользователя для конерктного задания',
  })
  @ApiResponse({ status: 200, type: TaskRatingEntity })
  @ApiBearerAuth('all')
  @Roles('all')
  @UseGuards(AuthorizationGuard)
  @Get('/your/:taskId')
  async findOneForUser(
    @Req() req: Request,
    @Param() params: TaskId_TaskRating_Param,
  ) {
    const userId = req.user.id;
    return new TaskRatingEntity(
      await this.taskRatingService.findOneForUser(userId, params.taskId),
    );
  }

  // @ApiOperation({ summary: 'Получить оценку задания по id' })
  // @ApiResponse({ status: 200, type: TaskRatingEntity })
  // @Get(':id')
  // async findOne(@Param() params: Id_TaskRatingParam) {
  //   return await this.taskRatingService.findOne(params.id);
  // }

  // @Patch(':id')
  // async update(
  //   @Param() params: Id_TaskRatingParam,
  //   @Body() updateTaskRatingDto: UpdateTaskRatingDto,
  // ) {
  //   return await this.taskRatingService.update(params.id, updateTaskRatingDto);
  // }

  @ApiOperation({
    summary: 'Удалить оценку текущего пользователя для конерктного задания',
  })
  @ApiResponse({ status: 200, type: TaskRatingEntity })
  @ApiBearerAuth('all')
  @Roles('all')
  @UseGuards(AuthorizationGuard)
  @Delete('/your/:taskId')
  async remove(@Req() req: Request, @Param() params: TaskId_TaskRating_Param) {
    const userId = req.user.id;
    return new TaskRatingEntity(
      await this.taskRatingService.remove(userId, params.taskId),
    );
  }

  @ApiOperation({ summary: 'Найти оценки по параметрам' })
  @ApiResponse({ status: 200, type: TaskRatingEntity })
  @ApiBearerAuth('administrator')
  @Roles('administrator')
  @UseGuards(AuthorizationGuard)
  @Get()
  async findAll(@Query() getTasksRatingsQuery: GetTasksRatingsQuery) {
    const taskRatings = (await this.taskRatingService.findAll(
      getTasksRatingsQuery,
    )) as TaskRatingEntity[];

    return taskRatings;
  }
}
