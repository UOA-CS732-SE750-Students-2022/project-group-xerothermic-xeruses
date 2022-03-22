import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
// eslint-disable-next-line import/no-unresolved
import admin from 'firebase-admin';
// eslint-disable-next-line import/no-unresolved
import { cert, Credential, ServiceAccount } from 'firebase-admin/app';
// eslint-disable-next-line import/no-unresolved
import { getAuth } from 'firebase-admin/auth';
import { ExtractJwt, Strategy } from 'passport-firebase-jwt';
// Do not destructure imports from firebase-admin otherwise it will break :(
import { FirebaseConfig } from '~/config/firebaseConfig.schema';

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(Strategy, 'firebase-auth') {
  constructor(private readonly configService: ConfigService<FirebaseConfig, true>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
    admin.initializeApp({
      credential: this.getCredentials(),
    });
  }

  private getCredentials(): Credential {
    return cert(JSON.parse(this.configService.get('FIREBASE_SERVICE_ACCOUNT')) as ServiceAccount);
  }

  async validate(token: string) {
    const firebaseUser: any = await getAuth()
      .verifyIdToken(token, true)
      .catch((error: Error) => {
        throw new UnauthorizedException(error.message);
      });

    if (!firebaseUser) {
      throw new UnauthorizedException();
    }

    return firebaseUser;
  }
}
