import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
// eslint-disable-next-line import/no-unresolved
import { DecodedIdToken, getAuth } from 'firebase-admin/auth';
import { ExtractJwt, Strategy } from 'passport-firebase-jwt';

@Injectable()
export class ValidateUserFirebaseAuthStrategy extends PassportStrategy(Strategy, 'validate-user-firebase-auth') {
  constructor() {
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
