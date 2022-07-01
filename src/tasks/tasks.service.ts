import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import * as sharp from 'sharp';
import {
  TaskIncludeMarkersIncludeDictionary,
  taskIncludeMarkersIncludeDictionary,
} from '../prisma/prisma.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksQuery, sortEnum } from './query/getTasksQuery';
import { GetRandomTasksQuery } from './query/getRandomTasksQuery';

@Injectable()
export class TasksService {
  constructor(private prismaClient: PrismaService) {}

  async createOrUpdate(
    userId: number,
    file: Express.Multer.File,
    createTaskDto: CreateTaskDto,
  ): Promise<TaskIncludeMarkersIncludeDictionary> {
    const { complexity, markers } = createTaskDto;
    let { id } = createTaskDto;

    // const markers2: Array<MarkersIncludeDictionary> = JSON.parse(markers);

    // получение картинки
    let img = null;
    if (file) {
      img = file;
    } else if (!id) {
      throw new Error('Попытка сохранения задания без картинки!');
    }

    let task: TaskIncludeMarkersIncludeDictionary = null;
    //если есть id задачи, то ищем задачу в БД
    if (id) {
      task = await this.prismaClient.task.findFirst({
        where: { id: id },
        ...taskIncludeMarkersIncludeDictionary,
      });

      if (!task) {
        throw new Error(`Не удалось найти задание по ID ${id}`);
      }

      task.complexity = complexity;

      if (img && task.imgUrl !== img.name) {
        //Если названия картинок не совпадают, то
        //Удаляем старую картинку
        this.delImg(task.imgUrl);
        //И сохраняем новую картинку
        task.imgUrl = await this.saveImg(img);
      }
    } //Если нет id задачи то создаем новую задачу
    else {
      task = await this.prismaClient.task.create({
        data: { imgUrl: await this.saveImg(img), complexity },
        ...taskIncludeMarkersIncludeDictionary,
      });
      // если небыло id задания сохраняем первую оценку от автора задания
      // taskRatingService.add(userId, task.id, 100);
    }

    await this.prismaClient.marker.deleteMany({
      where: {
        taskId: task.id,
      },
    });

    id = task.id;
    delete task.id;
    delete task.markers;

    //Сохраняем слова и привязываем их к маркерам
    for (let index = 0; index < markers.length; index++) {
      const name = markers[index].dictionary.name.trim().toLowerCase();

      await this.prismaClient.marker.create({
        data: {
          left: markers[index].left,
          top: markers[index].top,
          task: { connect: { id: id } },
          dictionary: {
            connectOrCreate: { where: { name }, create: { name } },
          },
        },
      });
    }

    return await this.prismaClient.task.update({
      where: { id: id },
      data: {
        ...task,
      },
      ...taskIncludeMarkersIncludeDictionary,
    });
  }

  async findAll({ limit, page, complexity, sort }: GetTasksQuery) {
    const offset = limit * (page - 1);

    const filter: any = {};
    if (complexity) {
      filter.where = {
        complexity: Array.isArray(complexity) ? { in: complexity } : complexity,
      };
    }

    let order = { field: 'id', order: 'ASC' };
    if (sort) {
      switch (sort) {
        case sortEnum.newFirst:
          order = { field: `"task"."createdAt"`, order: 'DESC' };
          break;
        case sortEnum.popularFirst:
          order = { field: `"task"."numberOfPasses"`, order: 'DESC' };
          break;
        case sortEnum.hardFirst:
          order = { field: `"task"."complexity"`, order: 'DESC' };
          break;
        case sortEnum.easyFirst:
          order = { field: `"task"."complexity"`, order: 'ASC' };
          break;
        case sortEnum.highlyRatedFirst:
          order = { field: 'rating', order: 'DESC' };
          break;
        case sortEnum.lowRatedFirst:
          order = { field: 'rating', order: 'ASC' };
          break;
        default:
        // throw new Error('Неудалось определить сортировку по значению: ' + sort)
      }
    }

    const resu: any = {};

    resu.count = await this.prismaClient.task.count({ ...filter });

    resu.currentPage = page;
    resu.totalPages = Math.ceil(resu.count / limit); // всего страниц

    //Подготавливаем данные для фильтрации в запросе
    let WHERE = '';
    if (filter.where) {
      const whereArr = [];
      for (const key in filter.where) {
        // если фильтруем значениями из массива
        if (filter.where[key].in) {
          whereArr.push(key + ' in (' + filter.where[key].in.join(', ') + ')');
        } else {
          whereArr.push(key + '=' + filter.where[key]);
        }
      }
      WHERE = 'WHERE ' + whereArr.join(' AND ');
    }

    resu.tasks = await this.prismaClient.$queryRawUnsafe(`SELECT "task"."id",
      "task"."imgUrl",
      "task"."numberOfPasses",
      "task"."complexity",
      "task"."createdAt",
      "task"."updatedAt",
      AVG("taskRatings"."rating") AS "rating"
      FROM "tasks" AS "task"
        LEFT OUTER JOIN "taskRatings" AS "taskRatings" ON "task"."id" = "taskRatings"."taskId" 
      ${WHERE}
      GROUP BY "task"."id"
      ORDER BY ${order.field} ${order.order}, "task"."id" ASC
      LIMIT ${limit} 
      OFFSET ${offset};`);

    return resu;
  }

  async findRandom({ limit, not_id }: GetRandomTasksQuery) {
    // const limit = count ? count : 1;
    let WHERE = '';
    if (not_id) {
      WHERE = `WHERE "task"."id" != ${not_id}`;
    }

    const resu = await this.prismaClient.$queryRawUnsafe(`
        SELECT 
          "task"."id",
          "task"."imgUrl",
          "task"."numberOfPasses",
          "task"."complexity",
          "task"."createdAt",
          "task"."updatedAt"
        FROM "tasks" AS "task"
        ${WHERE}
        ORDER BY random()
        LIMIT ${limit};`);

    return resu;
  }

  async findOne(id: number): Promise<TaskIncludeMarkersIncludeDictionary> {
    if (!id) {
      throw new Error('Не задан ID');
    }

    const resu = await this.prismaClient.task.findFirst({
      where: {
        id,
      },
      include: { markers: { include: { dictionary: true } } },
    });

    return resu;
  }

  async remove(id: number) {
    if (!id) {
      throw new Error('Не задан ID');
    }

    await this.prismaClient.task.update({
      where: {
        id,
      },
      data: {
        deleted: true,
      },
    });

    return 'Задание помечено на удаление';
  }

  // увеличение счетчика прохождения задания
  async wasPassed(id: number) {
    if (!id) {
      throw new Error('Не задан ID задания');
    }

    await this.prismaClient.task.update({
      where: { id },
      data: { numberOfPasses: { increment: 1 } },
    });

    return 'Количество прохождений увеличено';
  }

  // сохранение новой картинки
  private async saveImg(img: { buffer: sharp.SharpOptions }) {
    const newUuid = v4();
    const fileName = newUuid + '.webp';
    const imgPath = path.resolve(__dirname, '..', 'static');
    const imgPathAll = path.resolve(imgPath, fileName);
    if (!fs.existsSync(imgPath)) {
      fs.mkdirSync(imgPath, { recursive: true });
    }
    const imgPathMini = path.resolve(imgPath, 'mini_' + fileName);

    console.log(img);

    await sharp(img.buffer).toFile(imgPathAll);
    // сохраняем миниатюру
    await sharp(img.buffer).resize(350).toFile(imgPathMini);

    return fileName;
  }

  // удаление старой картинки
  private async delImg(imgName: string) {
    const dirPath = path.resolve(__dirname, '..', 'static');
    // основную
    fs.unlink(path.resolve(dirPath, imgName), (err) => {
      if (err) throw err;
    });
    // миниатюру
    fs.unlink(path.resolve(dirPath, 'mini_' + imgName), (err) => {
      if (err) throw err;
    });
  }
}
