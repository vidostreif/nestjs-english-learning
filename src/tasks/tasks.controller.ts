import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  TaskIncludeMarkersIncludeDictionaryEntity,
  TaskIncludeRatingEntity,
} from './entities/task.entity';
import { Roles } from '../auth/rolesAuth.decorator';
import { AuthorizationGuard } from '../auth/authorization.guard';
import { GetTasksQuery } from './query/getTasksQuery';
import { GetRandomTasksQuery } from './query/getRandomTasksQuery';
import { GetOneTaskParam } from './query/getOneTaskParam';

@ApiTags('api/task')
@Controller('/api/task')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({ summary: 'Создать или обновить задание' })
  @ApiResponse({ status: 200, type: TaskIncludeMarkersIncludeDictionaryEntity })
  @Roles('administrator')
  @UseGuards(AuthorizationGuard)
  @UseInterceptors(FileInterceptor('img'))
  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @UploadedFile()
    file: Express.Multer.File,
    @Req() req: Request,
  ): Promise<TaskIncludeMarkersIncludeDictionaryEntity> {
    const userId = req.user.id;

    return new TaskIncludeMarkersIncludeDictionaryEntity(
      await this.tasksService.createOrUpdate(+userId, file, createTaskDto),
    );
  }

  @ApiOperation({ summary: 'Получить список заданий по параметрам' })
  @ApiResponse({
    status: 200,
    type: [TaskIncludeRatingEntity],
  })
  @Get()
  async findAll(@Query() queryParams: GetTasksQuery) {
    return new TaskIncludeRatingEntity(
      await this.tasksService.findAll(queryParams),
    );
  }

  @ApiOperation({ summary: 'Получить случайный список заданий' })
  @ApiResponse({
    status: 200,
    type: [TaskIncludeRatingEntity],
  })
  @Get('/random')
  async findRandom(@Query() queryParams: GetRandomTasksQuery) {
    return new TaskIncludeRatingEntity(
      await this.tasksService.findRandom(queryParams),
    );
  }

  @ApiOperation({ summary: 'Получить задание по id' })
  @ApiResponse({ status: 200, type: TaskIncludeMarkersIncludeDictionaryEntity })
  // @ApiParam({
  //   name: 'id',
  //   type: Number,
  //   description: 'Id задания',
  //   example: '1',
  // })
  @Get(':id')
  async findOne(@Param() params: GetOneTaskParam) {
    return new TaskIncludeMarkersIncludeDictionaryEntity(
      await this.tasksService.findOne(params.id),
    );
  }

  @ApiOperation({ summary: 'Пометит задание на удаление' })
  @ApiResponse({ status: 200, type: TaskIncludeMarkersIncludeDictionaryEntity })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Id задания',
    example: '1',
  })
  // @Roles('administrator')
  // @UseGuards(AuthorizationGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.remove(id);
  }

  @ApiOperation({ summary: 'Увеличить счетчик прохождений' })
  @ApiResponse({ status: 200, type: String })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Id задания',
    example: '1',
  })
  // @Roles('administrator')
  // @UseGuards(AuthorizationGuard)
  @Patch('/passed/:id')
  async wasPassed(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory(error) {
          return error;
        },
      }),
    )
    id: number,
  ) {
    return await this.tasksService.wasPassed(id);
  }
}
