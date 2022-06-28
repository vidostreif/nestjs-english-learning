import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  INestApplication,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
      errorFormat: 'colorless',
    });
  }

  async onModuleInit() {
    /***********************************/
    /* SOFT DELETE MIDDLEWARE */
    /***********************************/

    this.$use(async (params, next) => {
      if (
        params.model == 'User' ||
        params.model == 'Task' ||
        params.model == 'UserRole'
      ) {
        // if (!params.args.where['deleted']) {
        if (params.action === 'findUnique' || params.action === 'findFirst') {
          // Change to findFirst - you cannot filter
          // by anything except ID / unique with findUnique
          params.action = 'findFirst';
          // Add 'deleted' filter
          // ID filter maintained
          params.args.where['deleted'] = false;
        }
        if (params.action === 'findMany') {
          // Find many queries
          if (params.args.where) {
            if (params.args.where.deleted == undefined) {
              // Exclude deleted records if they have not been explicitly requested
              params.args.where['deleted'] = false;
            }
          } else {
            params.args['where'] = { deleted: false };
          }
        }
        // }
      }
      return next(params);
    });

    this.$on<any>('query', (event: Prisma.QueryEvent) => {
      console.dir('params: ' + event.params);
      console.log('Query: ' + event.query);
      console.log('Duration: ' + event.duration + 'ms');
    });
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async enableShoutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
