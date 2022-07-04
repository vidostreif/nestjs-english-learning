import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, Length } from 'class-validator';
import { IsHasLowercase } from '../../validators/is-has-lowercase';
import { IsHasNumeric } from '../../validators/is-has-numeric';
import { IsHasSpecial } from '../../validators/is-has-special';
import { IsHasUppercase } from '../../validators/is-has-uppercase';

export class CreateUserDto {
  @ApiProperty({ example: 'иван', description: 'Наименование пользователя' })
  @IsOptional()
  name!: string | null;

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
  @IsHasLowercase({
    message: 'В пароле должена быть строчная буква',
  })
  @IsHasNumeric({
    message: 'В пароле должена быть цифра',
  })
  @IsHasSpecial({
    message: 'В пароле должен быть специальный символ',
  })
  password: string;
}
