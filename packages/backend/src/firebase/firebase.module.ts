import { Module } from '@nestjs/common';
import { FirebaseConfigModule } from '~/config/firebaseConfig.module';
import { UserDatabaseModule } from '~/database/user/user.module';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import { FirebaseAuthStrategy } from './firebase-auth.strategy';
import { ValidateFirebaseAuthGuard } from './validate-firebase-auth.guard';
import { ValidateFirebaseAuthStrategy } from './validate-firebase-auth.strategy';

@Module({
  imports: [FirebaseConfigModule, UserDatabaseModule],
  providers: [FirebaseAuthStrategy, ValidateFirebaseAuthStrategy, FirebaseAuthGuard, ValidateFirebaseAuthGuard],
})
export class FirebaseModule {}
