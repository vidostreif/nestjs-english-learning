import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// import { CreateTaskRatingDto } from './dto/create-task-rating.dto';
import { UpdateTaskRatingDto } from './dto/update-task-rating.dto';
import { GetTasksRatingsQuery } from './query/GetTasksRatingsQuery';

@Injectable()
export class TaskRatingService {
  constructor(private prismaClient: PrismaService) {}

  async create(
    userId: number,
    taskId: number,
    rating: number,
  ): Promise<number> {
    const user = await this.prismaClient.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('Пользователь не найден');
    }

    const task = await this.prismaClient.task.findFirst({
      where: { id: taskId },
    });

    if (!task) {
      throw new Error('Задание не найдено');
    }

    await this.prismaClient.taskRating.upsert({
      where: {
        userId_taskId: {
          userId: userId,
          taskId: taskId,
        },
      },
      create: { rating, userId, taskId },
      update: { rating },
    });

    return rating;
  }

  findAll({ id, taskId, userId }: GetTasksRatingsQuery) {
    return `This action returns all taskRating`;
  }

  findOne(id: number) {
    return `This action returns a #${id} taskRating`;
  }

  update(id: number, updateTaskRatingDto: UpdateTaskRatingDto) {
    return `This action updates a #${id} taskRating`;
  }

  remove(id: number) {
    return `This action removes a #${id} taskRating`;
  }
}
