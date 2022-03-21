import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { initializeApp } from "firebase-admin";
import { cert, Credential, ServiceAccount } from "firebase-admin/app";
import { ExtractJwt, Strategy } from "passport-firebase-jwt";

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(
  Strategy,
  'firebase-auth',
) {
  private defaultApp: any;
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
    this.defaultApp = initializeApp({
      credential: FirebaseAuthStrategy.getCredentials(),
    });
  }

  private static getCredentials(): Credential {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) { // this will be needed when we deploy
      return cert(
        JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) as ServiceAccount,
      );
    } else {
      return cert('../../../keys/firebase.json');
    }
  }
  
  async validate(token: string) {
    const firebaseUser: any = await this.defaultApp
      .auth()
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