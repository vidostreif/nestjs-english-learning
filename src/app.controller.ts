import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Тест работы')
@Controller('test')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Тест должен вернуть строку Hellow World!' })
  @ApiResponse({
    status: 200,
    type: String,
    description: 'Hellow World!',
  })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
