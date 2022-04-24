import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
// eslint-disable-next-line import/no-unresolved
import { DecodedIdToken, getAuth } from 'firebase-admin/auth';
import { ExtractJwt, Strategy } from 'passport-firebase-jwt';
import { FirebaseConfig } from '~/config/firebaseConfig.schema';

@Injectable()
export class ValidateFirebaseAuthStrategy extends PassportStrategy(Strategy, 'validate-firebase-auth') {
  constructor(private readonly configService: ConfigService<FirebaseConfig, true>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(token: string): Promise<DecodedIdToken> {
    const firebaseUser = await getAuth()
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
