import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseConfigModule } from '~/config/databaseConfig.module';
import { DatabaseConfig } from '~/config/databaseConfig.schema';
import { ExpressConfigModule } from '~/config/expressConfig.module';
import { LoggerModule } from '~/logger/module';

@Module({
  imports: [
    LoggerModule,
    ExpressConfigModule,
    MongooseModule.forRootAsync({
      imports: [DatabaseConfigModule],
      useFactory: (configService: ConfigService<DatabaseConfig, true>) => ({
        uri: configService.get('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
