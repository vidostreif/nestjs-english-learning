import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { getMailConfig } from './configs/mail.config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { TasksModule } from './tasks/tasks.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TaskRatingModule } from './task-rating/task-rating.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMailConfig,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'Client'),
    }),
    AuthModule,
    UsersModule,
    PrismaModule,
    TasksModule,
    TaskRatingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
