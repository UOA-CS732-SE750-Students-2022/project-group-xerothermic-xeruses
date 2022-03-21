import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseConfig, databaseConfig, expressConfig, requireConfig } from '~/config';
import { ExpressConfigModule } from '~/config/expressConfig.module';
import { LoggerModule } from '~/logger/module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // expressConfig is required in main.ts
      validate: requireConfig(expressConfig),
    }),
    MongooseModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          validate: requireConfig(databaseConfig),
        }),
      ],
      useFactory: (configService: ConfigService<DatabaseConfig, true>) => ({
        uri: configService.get('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    ExpressConfigModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
