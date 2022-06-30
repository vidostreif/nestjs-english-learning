import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import * as sharp from 'sharp';
import {
  MarkersIncludeDictionary,
  TaskIncludeMarkersIncludeDictionary,
  taskIncludeMarkersIncludeDictionary,
} from '../prisma/prisma.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskEntity } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(private prismaClient: PrismaService) {}

  async createOrUpdate(
    userId: number,
    file: Express.Multer.File,
    createTaskDto: CreateTaskDto,
  ): Promise<TaskEntity> {
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

  findAll() {
    return `This action returns all tasks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
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
