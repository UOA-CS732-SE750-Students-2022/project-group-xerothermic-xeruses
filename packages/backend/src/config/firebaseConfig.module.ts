import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { firebaseConfig } from './firebaseConfig.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => {
        const result = firebaseConfig.validate(env, { abortEarly: false, allowUnknown: true });
        if (result.error) throw result.error;
        return result.value;
      },
    }),
  ],
  providers: [],
  exports: [ConfigModule],
})
export class FirebaseConfigModule {}
