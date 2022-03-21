import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseConfigModule } from '~/config/databaseConfig.module';
import { type DatabaseConfig } from '~/config/databaseConfig.schema';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [DatabaseConfigModule],
      useFactory: (configService: ConfigService<DatabaseConfig, true>) => ({
        uri: configService.get('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [MongooseModule],
})
export class BaseDatabaseModule {}
