import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { GoogleCalendarService } from '~/googleCalendar/googleCalendar.service';

@Controller('googlecalendar')
export class GoogleCalendarController {
  constructor(private readonly googleCalendarService: GoogleCalendarService) {}

  @Get('/callback')
  async addGoogleCalendar(@Query('code') code: string) {
    if (!code) {
      throw new BadRequestException('Missing `code` query parameter with Google OAuth2 callback code.');
    }
    await this.googleCalendarService.processCodeCallback(code);
    return 'Done! Close this window now :)';
  }
}
