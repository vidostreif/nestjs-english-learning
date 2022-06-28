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
import { JwtAuthGuard } from '../tokens/jwt-auth.guard';

const maxAge = 2592000000; // один месяц

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const userData = await this.userService.create(createUserDto);
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge,
      httpOnly: true,
    });

    return res.json(userData);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(+id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.userService.remove(+id);
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res() res: Response,
  ) {
    const userData = await this.userService.login(body.email, body.password);
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge,
      httpOnly: true,
    });

    return res.json(userData);
  }

  @Post('logout')
  async logout(
    @Body() body: { email: string; password: string },
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const { refreshToken } = req.cookies;
    const token = await this.userService.logout(refreshToken);
    res.clearCookie('refreshToken');

    return res.json(token);
  }

  @Get('activate/:link')
  async activate(@Param('link') link: string, @Res() res: Response) {
    await this.userService.activate(link);
    return res.redirect(process.env.CLIENT_URL);
  }

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

  // { passthrough: true }
}
