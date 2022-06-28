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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
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
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
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

  @Get('activate/:link')
  async activate(@Param('link') link: string, @Res() res: Response) {
    await this.userService.activate(link);
    return res.redirect(process.env.CLIENT_URL);
  }

  // { passthrough: true }
}
