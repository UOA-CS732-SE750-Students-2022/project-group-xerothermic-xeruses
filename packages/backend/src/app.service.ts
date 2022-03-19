import { Injectable } from '@nestjs/common';
import { LoggerService } from '~/logger/service';

@Injectable()
export class AppService {
  constructor(private logger: LoggerService) {
    this.logger.setContext(AppService.name);
  }

  getHello(): string {
    return 'Hello World!';
  }
}
