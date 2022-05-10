import { Module } from '@nestjs/common';
import { FirebaseConfigModule } from '~/config/firebaseConfig.module';
import { UserDatabaseModule } from '~/database/user/user.module';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import { FirebaseAuthStrategy } from './firebase-auth.strategy';
import { FirebaseService } from './firebase.service';
import { ValidateUserFirebaseAuthGuard } from './validate-user-firebase-auth.guard';
import { ValidateUserFirebaseAuthStrategy } from './validate-user-firebase-auth.strategy';

@Module({
  imports: [FirebaseConfigModule, UserDatabaseModule],
  providers: [
    FirebaseAuthStrategy,
    ValidateUserFirebaseAuthStrategy,
    FirebaseAuthGuard,
    ValidateUserFirebaseAuthGuard,
    FirebaseService,
  ],
  exports: [FirebaseService],
})
export class FirebaseModule {}
