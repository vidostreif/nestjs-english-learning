import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenDTO } from 'src/prisma/prisma.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TokenService {
  lifetimeAccessToken = 1800; //30 минут в секундах
  lifetimeRefreshToken = '30d'; //30 дней

  constructor(private jwt: JwtService, private prismaClient: PrismaService) {}

  // генерация новой пары токенов
  generateTokens(payload: string | object | Buffer): {
    accessToken: string;
    refreshToken: string;
  } {
    const accessToken: string = this.jwt.sign(
      payload,
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: this.lifetimeAccessToken,
      },
      // process.env.JWT_ACCESS_SECRET,
      // {
      //   expiresIn: this.lifetimeAccessToken,
      // },
    );
    const refreshToken: string = this.jwt.sign(
      payload,
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: this.lifetimeRefreshToken,
      },
      // process.env.JWT_REFRESH_SECRET,
      // {
      //   expiresIn: this.lifetimeRefreshToken,
      // },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  //проверка валидности токена доступа
  validateAccessToken(token: string) {
    try {
      const userData = this.jwt.verify(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      return userData;
    } catch (error) {
      return null;
    }
  }

  //проверка валидности токена обновления
  validateRefreshToken(token: any) {
    try {
      const userData = this.jwt.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      return userData;
    } catch (error) {
      return null;
    }
  }

  // сохранение refreshToken в БД
  async saveToken(userId: any, refreshToken: any): Promise<TokenDTO> {
    const tokenData = await this.prismaClient.token.findFirst({
      where: { userId: userId },
    });

    //если нашли токен пользователя, то перезаписываем
    if (tokenData) {
      return await this.prismaClient.token.update({
        where: { id: tokenData.id },
        data: { refreshToken },
      });
    }
    //если не нашли, то создаем новый
    return await this.prismaClient.token.create({
      data: { userId, refreshToken },
    });
  }

  // удаление токена из БД
  async removeToken(refreshToken: any) {
    return await this.prismaClient.token.deleteMany({
      where: { refreshToken },
    });
  }

  async findToken(refreshToken: any): Promise<TokenDTO> {
    return await this.prismaClient.token.findFirst({
      where: { refreshToken },
    });
  }
}
