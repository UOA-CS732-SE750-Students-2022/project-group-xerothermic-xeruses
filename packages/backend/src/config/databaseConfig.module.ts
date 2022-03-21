import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig } from './databaseConfig.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => {
        const result = databaseConfig.validate(env, { abortEarly: false, allowUnknown: true });
        if (result.error) throw result.error;
        return result.value;
      },
    }),
  ],
  providers: [],
  exports: [ConfigModule],
})
export class DatabaseConfigModule {}
