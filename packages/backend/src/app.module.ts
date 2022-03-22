import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseConfigModule } from '~/config/firebaseConfig.module';
import { FirebaseAuthStrategy } from '~/firebase/firebase-auth.strategy';
import { expressConfig, requireConfig } from '~/config';
import { LoggerService } from '~/logger/service';

@Module({
  imports: [
    ConfigModule.forRoot({
      // expressConfig is required in main.ts
      validate: requireConfig(expressConfig),
    }),
    FirebaseConfigModule,
    PassportModule,
  ],
  controllers: [AppController],
  providers: [AppService, LoggerService, FirebaseAuthStrategy],
})
export class AppModule {}
