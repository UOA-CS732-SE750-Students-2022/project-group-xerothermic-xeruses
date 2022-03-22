import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExpressConfigModule } from '~/config/expressConfig.module';
import { FirebaseConfigModule } from '~/config/firebaseConfig.module';
import { FirebaseAuthStrategy } from '~/firebase/firebase-auth.strategy';
import { LoggerModule } from '~/logger/module';

@Module({
  imports: [ExpressConfigModule, LoggerModule, FirebaseConfigModule, PassportModule],
  controllers: [AppController],
  providers: [AppService, FirebaseAuthStrategy],
})
export class AppModule {}
