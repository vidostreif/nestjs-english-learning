import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'ivan@mail.ru',
    description: 'Адрес электронной почты пользователя',
  })
  @IsEmail({
    message: 'Некорректный адрес почты',
  })
  email: string;

  @ApiProperty({
    example: 'fkIS83[w',
    description: 'Пароль',
  })
  password: string;
}
