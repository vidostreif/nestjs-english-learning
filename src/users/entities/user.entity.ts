// import { UserRole, User as UserPrisma } from '@prisma/client';
// import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserIncludeRole } from 'src/prisma/prisma.dto';

export class UserIncludeRoleEntity implements UserIncludeRole {
  @ApiProperty({ example: '1', description: 'Id ползователя' })
  id: number;
  @ApiProperty({ example: 'Иван', description: 'Наименование пользователя' })
  name: string;
  @ApiProperty({
    example: 'ivan@mail.ru',
    description: 'Адрес электронной почты пользователя',
  })
  email: string;
  @ApiProperty({
    example: 'true',
    description: 'Признак активации пользователя',
  })
  isActivated: boolean;

  @ApiProperty({
    example: `{ "name": "user" }`,
    description: 'Роль пользователя',
  })
  userRole: { name: string };
}

export class UserWithTokensEntity {
  @ApiProperty()
  user: UserIncludeRoleEntity;
  @ApiProperty({ example: '1800', description: 'Время жизни токена доступа' })
  lifetimeAccessToken: number;
  @ApiProperty({
    example:
      'eyJpZCI6MSwibmFtZSI6bnVsbCwiZW1haWwiOiJ2aWRvMUB5YW5kZXgucnUiLCJpc0FjdGl2YXRlZCI6ZmFsc2UsInVzZXJSb2xlIjp7Im5hbWUiOiJhZG1pbmlzdHJhdG9yIn0sIml',
    description: 'Токен доступа',
  })
  accessToken: string;
  @ApiProperty({
    example:
      'eyJpZCI6MSwibmFtZSI6bnVsbCwiZW1haWwiOiJ2aWRvMUB5YW5kZXgucnUiLCJpc0FjdGl2YXRlZCI6ZmFsc2UsInVzZXJSb2xlIjp7Im5hbWUiOiJhZG1pbmlzdHJhdG9yIn0sIml',
    description: 'Токен обновления',
  })
  refreshToken: string;
}
