import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const maxAge = 2592000000; // один месяц

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res) {
    const userData = await this.userService.create(createUserDto);
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge,
      httpOnly: true,
    });

    return res.json(userData);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }, @Res() res) {
    const userData = await this.userService.login(body.email, body.password);
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge,
      httpOnly: true,
    });

    return res.json(userData);
  }
}
