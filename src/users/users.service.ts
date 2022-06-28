import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { v4 } from 'uuid';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserWithTokens } from './entities/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { join } from 'path';
import { TokensService } from 'src/tokens/tokens.service';
import { UserIncludeRole, userIncludeRole } from '../prisma/prisma.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly tokenService: TokensService,
    private prismaClient: PrismaService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserWithTokens> {
    const { email, password, name } = createUserDto;
    //регистрация нового пользователя
    const candidate = await this.prismaClient.user.findFirst({
      where: { email },
    });

    if (candidate) {
      throw new HttpException(
        `Пользователь с почтовым адресом ${email} уже существует`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashPassword = await bcrypt.hash(password, 3); //создание хеша пароля
    const activationLink = v4(); //генерация случайной строки

    //если пользователь указан админскую почту, то даем ему админские права
    let role = 'user';
    if (email === process.env.DB_ADMINISTRATOR_EMAIL) {
      role = 'administrator';
    }
    const userRole = await this.prismaClient.userRole.findFirst({
      where: { name: role },
    });

    const user = await this.prismaClient.user.create({
      data: {
        email,
        name,
        password: hashPassword,
        activationLink,
        userRoleId: userRole.id,
      },
      ...userIncludeRole,
    }); //сохранение пользователя

    // await this.sendConfirmMail(user, activationLink); //отправка письма с сылкой на активацию

    const tokens = await this.getNewToken(user);

    return {
      ...tokens,
      lifetimeAccessToken: this.tokenService.lifetimeAccessToken,
      ...user,
    };
  }

  async findAll() {
    return await this.prismaClient.user.findMany({ ...userIncludeRole });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  //активация пользователя
  async activate(activationLink: string) {
    const user = await this.prismaClient.user.findFirst({
      where: { activationLink },
    });

    if (!user) {
      throw new HttpException(
        `Некорректная ссылка активации`,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.prismaClient.user.update({
      where: user,
      data: { isActivated: true },
    });
  }

  async login(email: string, password: string) {
    const user = await this.prismaClient.user.findFirst({
      where: { email },
      select: { ...userIncludeRole.select, password: true },
    });

    if (!user) {
      throw new UnauthorizedException({
        message: `Пользователь с таким email не найден`,
      });
    }
    //проверяем пароль
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw new UnauthorizedException(`Не верный пароль`);
    }

    delete user.password;
    const tokens = await this.getNewToken(user);

    return {
      ...tokens,
      lifetimeAccessToken: this.tokenService.lifetimeAccessToken,
      user,
    };
  }

  private async getNewToken(user: UserIncludeRole) {
    const tokens = this.tokenService.generateTokens(user);
    await this.tokenService.saveToken(user.id, tokens.refreshToken);
    return tokens;
  }

  private async sendConfirmMail(user: UserIncludeRole, activationLink: string) {
    const urlConfirmAddress = `${process.env.API_URL}/api/user/activate/${activationLink}`;
    // Отправка почты
    return await this.mailerService
      .sendMail({
        to: user.email,
        subject: 'Подтверждение регистрации',
        template: join(__dirname, '/src/templates', 'confirmReg'),
        context: {
          id: user.id,
          username: user.name,
          urlConfirmAddress,
        },
      })
      .catch((e) => {
        throw new HttpException(
          `Ошибка работы почты: ${JSON.stringify(e)}`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      });
  }
}
