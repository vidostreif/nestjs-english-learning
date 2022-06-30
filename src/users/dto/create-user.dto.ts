import { ApiProperty } from '@nestjs/swagger';
import { UserRole, User } from '@prisma/client';
// import { Exclude } from 'class-transformer';
import { IsEmail, IsOptional, Length } from 'class-validator';
import { IsHasUppercase } from 'src/validators/isHasUppercase';

export class CreateUserDto {
  @ApiProperty({ example: 'иван', description: 'Наименование пользователя' })
  @IsOptional()
  name: string | null;

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
  @Length(8, 32, {
    message: 'Пароль должен быть от 8 до 32 символов',
  })
  @IsHasUppercase({
    message: 'В пароле должена быть заглавная буква',
  })
  password: string;
}
