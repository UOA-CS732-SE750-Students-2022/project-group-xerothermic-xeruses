import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, signInWithCredential, GoogleAuthProvider, AuthErrorCodes } from 'firebase/auth';
import { FirebaseConfig } from '~/config/firebaseConfig.schema';
import { UserDocument } from '~/database/user/user.schema';
import { UserService } from '~/database/user/user.service';

@Injectable()
export class FirebaseService {
  private app: FirebaseApp;

  public constructor(
    private readonly configService: ConfigService<FirebaseConfig, true>,
    private readonly userService: UserService,
  ) {
    const conf = JSON.parse(this.configService.get('FIREBASE_CLIENT_CONFIG'));
    if (
      !conf?.apiKey ||
      !conf.authDomain ||
      !conf.projectId ||
      !conf.storageBucket ||
      !conf.messagingSenderId ||
      !conf.appId ||
      !conf.measurementId
    ) {
      throw new Error('Missing fields in FIREBASE_CLIENT_CONFIG credentials');
    }

    this.app = initializeApp(conf);
  }

  public async getUserFromGoogleIdToken(googleIdToken: string): Promise<UserDocument> {
    const transformError = (err: Error & { code: string }) => {
      const unauthorized: string[] = [AuthErrorCodes.INVALID_IDP_RESPONSE, AuthErrorCodes.NEED_CONFIRMATION];
      if (unauthorized.includes(err.code)) {
        throw new UnauthorizedException(err.message);
      }

      const notFound: string[] = [AuthErrorCodes.USER_DISABLED, AuthErrorCodes.USER_DELETED];
      if (notFound.includes(err.code)) {
        throw new NotFoundException("User doesn't exist in Firebase");
      }

      throw err;
    };

    const credential = GoogleAuthProvider.credential(googleIdToken);
    const firebaseUser = await signInWithCredential(getAuth(this.app), credential).catch(transformError);

    const user = await this.userService.findOneByFirebaseId(firebaseUser.user.uid);
    if (!user) {
      throw new NotFoundException("User doesn't exist in Mongo");
    }

    return user;
  }
}
