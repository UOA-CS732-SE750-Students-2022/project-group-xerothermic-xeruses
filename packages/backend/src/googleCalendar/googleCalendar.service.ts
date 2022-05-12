import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Credentials } from 'google-auth-library';
import { google } from 'googleapis';
import { OAuth2Client } from 'googleapis-common';
import { GoogleConfig } from '~/config/googleConfig.schema';
import { UserService } from '~/database/user/user.service';
import { UserAvailabilityGoogleCalendar } from '~/database/user/userAvailabilityGoogleCalendar.schema';
import { FirebaseService } from '~/firebase/firebase.service';

@Injectable()
export class GoogleCalendarService {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUris: string[];

  public constructor(
    private readonly configService: ConfigService<GoogleConfig, true>,
    private readonly firebaseService: FirebaseService,
    private readonly userService: UserService,
  ) {
    const creds = JSON.parse(this.configService.get('GOOGLE_OAUTH2'));

    if (!creds?.web?.client_id || !creds.web.client_secret || !creds.web.redirect_uris?.[0]) {
      throw new Error('Missing fields in GOOGLE_OAUTH2 credentials');
    }

    this.clientId = creds.web.client_id;
    this.clientSecret = creds.web.client_secret;
    this.redirectUris = creds.web.redirect_uris;
  }

  public createOAuth2Client() {
    return new google.auth.OAuth2(this.clientId, this.clientSecret, this.redirectUris[0]);
  }

  public async generateAuthUrl() {
    return this.createOAuth2Client().generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/calendar.readonly',
      ],
    });
  }

  public async processCodeCallback(code: string) {
    const { tokens } = await this.createOAuth2Client().getToken(code);
    await this.saveCredentialsToDatabase(tokens);
  }

  private async saveCredentialsToDatabase(creds: Credentials) {
    const oAuth2Client = this.createOAuth2Client();
    oAuth2Client.setCredentials(creds);
    const { token } = await oAuth2Client.getAccessToken();
    if (!token) {
      throw new Error(`Failed fetching access token with credentials: ${JSON.stringify(creds)}`);
    }

    const { refresh_token: refreshToken, id_token: idToken } = creds;

    if (!refreshToken) {
      throw new Error(`Missing refresh token in credentials: ${JSON.stringify(creds)}`);
    }
    if (!idToken) {
      throw new Error(`Missing id token in credentials: ${JSON.stringify(creds)}`);
    }

    const [user, calendars] = await Promise.all([
      this.firebaseService.getUserFromGoogleIdToken(idToken),
      this.listCalendars(oAuth2Client),
    ]);

    const userAvailabilities: UserAvailabilityGoogleCalendar[] = calendars.map((calendar) => ({
      type: 'googlecalendar',
      name: calendar.summaryOverride || calendar.summary || 'Google Calendar',
      refreshToken,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      calendarId: calendar.id!,
    }));

    await this.userService.addUserAvailability(user._id, userAvailabilities);
  }

  public async listCalendars(oAuth2Client: OAuth2Client, filterSelected = true) {
    const gcalendar = google.calendar({ version: 'v3', auth: oAuth2Client });
    const result = await gcalendar.calendarList.list();
    const calendars = result.data.items ?? [];
    return calendars.filter((calendar) => !filterSelected || calendar.selected);
  }

  public async getCalendarEvents(oAuth2Client: OAuth2Client, calendarId: string, timeMin: Date, timeMax: Date) {
    const gcalendar = google.calendar({ version: 'v3', auth: oAuth2Client });
    const [calendar, events] = await Promise.all([
      gcalendar.calendars.get({ calendarId }),
      gcalendar.events.list({
        calendarId,
        maxAttendees: 1, // Only return the participant in event.
        maxResults: 2500, // TODO: paginate results.
        singleEvents: true, // Convert recurring events to multiple events.
        timeZone: 'UTC',
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
      }),
    ]);

    if (events.data.items == null) {
      throw new Error('Calendar event items should not be null.');
    }

    if (calendar.data.timeZone == null) {
      throw new Error('Calendar timezone should not be null.');
    }

    return {
      calendarId,
      timeMin,
      timeMax,
      defaultTimeZone: calendar.data.timeZone,
      events: events.data.items,
    };
  }
}
