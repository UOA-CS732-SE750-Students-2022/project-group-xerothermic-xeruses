import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { expressConfig, firebaseConfig, requireConfig } from '~/config';
import { LoggerService } from '~/logger/service';
import { PassportModule } from '@nestjs/passport';
import { FirebaseAuthStrategy } from './firebase/firebase-auth.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      // expressConfig is required in main.ts
      validate: requireConfig(expressConfig),
    }),
    ConfigModule.forRoot({
      validate: requireConfig(firebaseConfig),
    }),
    PassportModule
  ],
  controllers: [AppController],
  providers: [AppService, LoggerService, FirebaseAuthStrategy],
})
export class AppModule {}
