import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request, Response } from 'express';
import { Roles } from '../auth/rolesAuth.decorator';
import { AuthorizationGuard } from '../auth/authorization.guard';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  UserIncludeRoleEntity,
  UserWithTokensEntity,
} from './entities/user.entity';
import { IdUserParam } from './query/IdUserParam';
import { LoginDto } from './dto/login.dto';

const maxAge = 2592000000; // один месяц

@ApiTags('Пользователи')
@Controller('api/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiOperation({ summary: 'Создать нового пользователя' })
  @ApiResponse({ status: 201, type: UserWithTokensEntity })
  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const userData = await this.userService.create(createUserDto);

    res.cookie('refreshToken', userData.refreshToken, {
      maxAge,
      httpOnly: true,
    });

    return res.status(201).json(userData);
  }

  @ApiOperation({ summary: 'Получить всех пользователей' })
  @ApiResponse({ status: 200, type: [UserIncludeRoleEntity] })
  @ApiBearerAuth('administrator')
  @Roles('administrator')
  @UseGuards(AuthorizationGuard)
  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @ApiOperation({ summary: 'Войти с логином и паролем' })
  @ApiResponse({ status: 200, type: UserWithTokensEntity })
  @Post('login')
  async login(@Body() body: LoginDto, @Res() res: Response) {
    const userData = await this.userService.login(body.email, body.password);
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge,
      httpOnly: true,
    });

    return res.json(userData);
  }

  @ApiOperation({ summary: 'Выйти из системы' })
  @ApiResponse({ status: 200 })
  @Post('logout')
  async logout(@Res() res: Response, @Req() req: Request) {
    const { refreshToken } = req.cookies;
    await this.userService.logout(refreshToken);
    res.clearCookie('refreshToken');

    return res.status(200);
  }

  @ApiOperation({ summary: 'Активировать пользователя' })
  @ApiResponse({ status: 200 })
  @ApiParam({ name: 'link', type: String })
  @Get('activate/:link')
  async activate(@Param('link') link: string, @Res() res: Response) {
    await this.userService.activate(link);
    return res.redirect(process.env.CLIENT_URL);
  }

  @ApiOperation({ summary: 'Обновить токен доступа' })
  @ApiResponse({ status: 200, type: UserWithTokensEntity })
  @ApiCookieAuth('refreshToken')
  @Get('refresh')
  async refresh(@Res() res: Response, @Req() req: Request) {
    const { refreshToken } = req.cookies;

    const userData = await this.userService.refresh(refreshToken);
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge,
      httpOnly: true,
    });
    return res.json(userData);
  }

  @ApiOperation({ summary: 'Получить пользователя по id' })
  @ApiResponse({ status: 200, type: UserIncludeRoleEntity })
  @ApiBearerAuth('administrator')
  @Roles('administrator')
  @UseGuards(AuthorizationGuard)
  @Get(':id')
  async findOne(@Param() params: IdUserParam) {
    return await this.userService.findOne(params.id);
  }

  @ApiOperation({ summary: 'Обновить данные пользователя' })
  @ApiResponse({ status: 200, type: UserIncludeRoleEntity })
  @ApiBearerAuth('administrator')
  @Roles('administrator')
  @UseGuards(AuthorizationGuard)
  @Patch(':id')
  async update(
    @Param() params: IdUserParam,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(params.id, updateUserDto);
  }

  @ApiOperation({ summary: 'Пометить на удаление пользователя' })
  @ApiResponse({ status: 200, type: UserIncludeRoleEntity })
  @ApiBearerAuth('administrator')
  @Roles('administrator')
  @UseGuards(AuthorizationGuard)
  @Delete(':id')
  async remove(@Param() params: IdUserParam) {
    return await this.userService.remove(params.id);
  }
}
