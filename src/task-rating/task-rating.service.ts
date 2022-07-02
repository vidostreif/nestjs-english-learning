import { Injectable } from '@nestjs/common';
import { TaskRating } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
// import { CreateTaskRatingDto } from './dto/create-task-rating.dto';
// import { UpdateTaskRatingDto } from './dto/update-task-rating.dto';
import { GetTasksRatingsQuery } from './query/GetTasksRatingsQuery';

@Injectable()
export class TaskRatingService {
  constructor(private prismaClient: PrismaService) {}

  async createOrUpdate(
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

  async findAll({
    taskId,
    userId,
  }: GetTasksRatingsQuery): Promise<Array<TaskRating>> {
    const where: any = {};
    if (userId) {
      where.userId = userId;
    }

    if (taskId) {
      where.taskId = taskId;
    }

    return await this.prismaClient.taskRating.findMany({
      where,
    });
  }

  async findOneForUser(userId: number, taskId: number): Promise<TaskRating> {
    if (!taskId) {
      throw new Error('Не задан ID задания');
    }

    if (!userId) {
      throw new Error('Не задан ID пользователя');
    }

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

    return await this.prismaClient.taskRating.findFirst({
      where: { userId, taskId },
    });
  }

  async remove(userId: number, taskId: number) {
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

    return await this.prismaClient.taskRating.delete({
      where: {
        userId_taskId: {
          userId: userId,
          taskId: taskId,
        },
      },
    });
  }
}
