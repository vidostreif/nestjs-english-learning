import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UploadedFile,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  TaskIncludeMarkersIncludeDictionaryEntity,
  TaskIncludeRatingEntity,
} from './entities/task.entity';
import { Roles } from '../auth/rolesAuth.decorator';
import { AuthorizationGuard } from '../auth/authorization.guard';
import { GetTasksQuery } from './query/getTasksQuery';
import { GetRandomTasksQuery } from './query/getRandomTasksQuery';
import { IdTaskParam } from './query/IdTaskParam';

@ApiTags('Задания')
@Controller('tasks')
@UseInterceptors(ClassSerializerInterceptor)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({ summary: 'Создать или обновить задание' })
  @ApiResponse({ status: 200, type: TaskIncludeMarkersIncludeDictionaryEntity })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('administrator')
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

  @ApiOperation({ summary: 'Получить случайный список заданий' })
  @ApiResponse({
    status: 200,
    type: [TaskIncludeMarkersIncludeDictionaryEntity],
  })
  @Get('/random')
  async findRandom(@Query() queryParams: GetRandomTasksQuery) {
    const tasks = (await this.tasksService.findRandom(
      queryParams,
    )) as TaskIncludeMarkersIncludeDictionaryEntity[];

    return tasks;
  }

  @ApiOperation({ summary: 'Получить список заданий по параметрам' })
  @ApiResponse({
    status: 200,
    type: [TaskIncludeRatingEntity],
  })
  @Get()
  async findAll(@Query() queryParams: GetTasksQuery) {
    const tasks = (await this.tasksService.findAll(
      queryParams,
    )) as TaskIncludeRatingEntity[];

    return tasks;
  }

  @ApiOperation({ summary: 'Получить задание по id' })
  @ApiResponse({ status: 200, type: TaskIncludeMarkersIncludeDictionaryEntity })
  @Get(':id')
  async findOne(@Param() params: IdTaskParam) {
    return new TaskIncludeMarkersIncludeDictionaryEntity(
      await this.tasksService.findOne(params.id),
    );
  }

  @ApiOperation({ summary: 'Пометит задание на удаление' })
  @ApiResponse({ status: 200, type: TaskIncludeMarkersIncludeDictionaryEntity })
  @ApiBearerAuth('administrator')
  @Roles('administrator')
  @UseGuards(AuthorizationGuard)
  @Delete(':id')
  remove(@Param() params: IdTaskParam) {
    return this.tasksService.remove(params.id);
  }

  @ApiOperation({ summary: 'Увеличить счетчик прохождений' })
  @ApiResponse({ status: 200, type: String })
  @ApiBearerAuth('administrator')
  @Roles('administrator')
  @UseGuards(AuthorizationGuard)
  @Patch('/passed/:id')
  async wasPassed(@Param() params: IdTaskParam) {
    return await this.tasksService.wasPassed(params.id);
  }
}
