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
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TaskEntity } from './entities/task.entity';
import { Roles } from '../auth/rolesAuth.decorator';
import { AuthorizationGuard } from '../auth/authorization.guard';
import { GetTasksQuery } from './query/getTasksQuery';

@ApiTags('api/task')
@Controller('/api/task')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({ summary: 'Создать или обновить задание' })
  @ApiResponse({ status: 200, type: TaskEntity })
  @Roles('administrator')
  @UseGuards(AuthorizationGuard)
  @Post()
  @UseInterceptors(FileInterceptor('img'))
  // @UseInterceptors(ClassSerializerInterceptor)
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @UploadedFile()
    file: Express.Multer.File,
    // @Res()
    // res: Response,
    // @Req() req: Request,
  ): Promise<TaskEntity> {
    //!!! заменить на req.user.id
    const userId = 1;

    console.log(createTaskDto);

    const task = new TaskEntity(
      await this.tasksService.createOrUpdate(+userId, file, createTaskDto),
    );
    // res.json(task);
    return task;

    // return await this.tasksService.createOrUpdate(+userId, file, createTaskDto);
  }

  @ApiOperation({ summary: 'Получить список заданий по параметрам' })
  @ApiResponse({ status: 200, type: [TaskEntity] })
  // @ApiQuery({ type: GetTasksQuery })
  @Get()
  findAll(@Query() queryParams: GetTasksQuery) {
    return this.tasksService.findAll(queryParams);
  }

  @ApiOperation({ summary: 'Получить задание по id' })
  @ApiResponse({ status: 200, type: TaskEntity })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Id задания',
    example: '1',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
  //   return this.tasksService.update(+id, updateTaskDto);
  // }

  @ApiOperation({ summary: 'Пометит задание на удаление' })
  @ApiResponse({ status: 200, type: TaskEntity })
  // @Roles('administrator')
  // @UseGuards(AuthorizationGuard)
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Id задания',
    example: '1',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}
