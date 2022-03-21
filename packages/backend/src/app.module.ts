import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { expressConfig, requireConfig } from '~/config';
import { LoggerService } from '~/logger/service';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ConfigModule.forRoot({
      // expressConfig is required in main.ts
      validate: requireConfig(expressConfig),
    }),
    PassportModule
  ],
  controllers: [AppController],
  providers: [AppService, LoggerService],
})
export class AppModule {}
