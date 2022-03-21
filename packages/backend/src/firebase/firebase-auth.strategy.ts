import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { cert, Credential, ServiceAccount } from "firebase-admin/app";
import { getAuth } from 'firebase-admin/auth';
import { ExtractJwt, Strategy } from "passport-firebase-jwt";
// Do not destructure imports from firebase-admin otherwise it will break :(
import admin from 'firebase-admin'
import { FirebaseConfig } from "~/config";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(
  Strategy,
  'firebase-auth',
) {
  constructor(private readonly configService: ConfigService<FirebaseConfig, true>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
    admin.initializeApp({
      credential: this.getCredentials(),
    });
  }

  private getCredentials(): Credential {
    return cert(
      JSON.parse(this.configService.get('FIREBASE_SERVICE_ACCOUNT')) as ServiceAccount,
    );
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