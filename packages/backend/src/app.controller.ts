import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Auth } from './decorators/auth.decorator';

@Controller()
@Auth()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/auth')
  auth(): string {
    return "Hello with Auth"
  }
}
