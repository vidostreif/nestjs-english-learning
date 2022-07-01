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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
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

import { createParamDecorator } from '@nestjs/swagger/dist/decorators/helpers';
import { isNil } from 'lodash';

const initialMetadata = {
  name: '',
  required: true,
};

export const ApiImplicitFormData = (metadata: {
  name: string;
  description?: string;
  required?: boolean;
  type: any;
}): MethodDecorator => {
  const param = {
    name: isNil(metadata.name) ? initialMetadata.name : metadata.name,
    in: 'formData',
    description: metadata.description || '',
    required: metadata.required || false,
    type: metadata.type,
  };
  return createParamDecorator(param, initialMetadata);
};

@ApiTags('api/task')
@Controller('/api/task')
@UseInterceptors(ClassSerializerInterceptor)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({ summary: 'Создать или обновить задание' })
  @ApiResponse({ status: 200, type: TaskIncludeMarkersIncludeDictionaryEntity })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
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
    console.log(file);

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
  @Get(':id')
  async findOne(@Param() params: IdTaskParam) {
    return new TaskIncludeMarkersIncludeDictionaryEntity(
      await this.tasksService.findOne(params.id),
    );
  }

  @ApiOperation({ summary: 'Пометит задание на удаление' })
  @ApiResponse({ status: 200, type: TaskIncludeMarkersIncludeDictionaryEntity })
  @ApiBearerAuth()
  @Roles('administrator')
  @UseGuards(AuthorizationGuard)
  @Delete(':id')
  remove(@Param() params: IdTaskParam) {
    return this.tasksService.remove(params.id);
  }

  @ApiOperation({ summary: 'Увеличить счетчик прохождений' })
  @ApiResponse({ status: 200, type: String })
  @ApiBearerAuth()
  @Roles('administrator')
  @UseGuards(AuthorizationGuard)
  @Patch('/passed/:id')
  async wasPassed(@Param() params: IdTaskParam) {
    return await this.tasksService.wasPassed(params.id);
  }
}
