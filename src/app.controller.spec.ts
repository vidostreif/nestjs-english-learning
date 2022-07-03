import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Test, TestingModule } from '@nestjs/testing';
import { join } from '@prisma/client/runtime';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { getMailConfig } from './configs/mail.config';
import { PrismaModule } from './prisma/prisma.module';
import { TaskRatingModule } from './task-rating/task-rating.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
      imports: [
        ConfigModule.forRoot(),
        MailerModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: getMailConfig,
        }),
        AuthModule,
        UsersModule,
        PrismaModule,
        TasksModule,
        TaskRatingModule,
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
