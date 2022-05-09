import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Credentials } from 'google-auth-library';
import { google } from 'googleapis';
import { OAuth2Client } from 'googleapis-common';
import { GoogleConfig } from '~/config/googleConfig.schema';
import { UserService } from '~/database/user/user.service';
import { FirebaseService } from '~/firebase/firebase.service';

@Injectable()
export class GoogleCalendarService {
  private oAuth2Client: OAuth2Client;

  public constructor(
    private readonly configService: ConfigService<GoogleConfig, true>,
    private readonly firebaseService: FirebaseService,
    private readonly userService: UserService,
  ) {
    const creds = JSON.parse(this.configService.get('GOOGLE_OAUTH2'));

    if (!creds?.web?.client_id || !creds.web.client_secret || !creds.web.redirect_uris?.[0]) {
      throw new Error('Missing fields in GOOGLE_OAUTH2 credentials');
    }

    this.oAuth2Client = new google.auth.OAuth2(
      creds.web.client_id,
      creds.web.client_secret,
      creds.web.redirect_uris[0],
    );
  }

  public async generateAuthUrl() {
    return this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/calendar.readonly',
      ],
    });
  }

  public async processCodeCallback(code: string) {
    const { tokens } = await this.oAuth2Client.getToken(code);
    await this.saveCredentialsToDatabase(tokens);
  }

  private async saveCredentialsToDatabase(creds: Credentials) {
    this.oAuth2Client.setCredentials(creds);
    const { token } = await this.oAuth2Client.getAccessToken();
    if (!token) {
      throw new Error(`Failed fetching access token with credentials: ${JSON.stringify(creds)}`);
    }

    if (!creds.refresh_token) {
      throw new Error(`Missing refresh token in credentials: ${JSON.stringify(creds)}`);
    }
    if (!creds.id_token) {
      throw new Error(`Missing id token in credentials: ${JSON.stringify(creds)}`);
    }
    if (!creds.expiry_date) {
      throw new Error(`Missing expiry date in credentials: ${JSON.stringify(creds)}`);
    }

    const user = await this.firebaseService.getUserFromGoogleIdToken(creds.id_token);
    await this.userService.addUserAvailability(user._id, [
      {
        type: 'googlecalendar',
        name: 'Google Calendar', // user will update this name later
        refreshToken: creds.refresh_token,
        accessToken: token,
        accessTokenExpiration: new Date(creds.expiry_date),
      },
    ]);
  }
}
