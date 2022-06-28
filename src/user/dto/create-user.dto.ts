import { UserRole, User } from '@prisma/client';
// import { Exclude } from 'class-transformer';
import {
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsUppercase,
  Length,
} from 'class-validator';
import { IsHasUppercase } from 'src/validators/isHasUppercase';

export class CreateUserDto {
  @IsOptional()
  name: string | null;

  @IsEmail({
    message: 'Некорректный адрес почты',
  })
  email: string;

  @Length(8, 32, {
    message: 'Пароль должен быть от 8 до 32 символов',
  })
  @IsHasUppercase()
  password: string;
}
