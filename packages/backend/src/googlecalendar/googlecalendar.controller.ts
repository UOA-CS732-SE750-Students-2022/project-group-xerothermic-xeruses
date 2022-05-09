import { Controller, Get, Query } from '@nestjs/common';
import { GoogleCalendarService } from './googlecalendar.service';

@Controller('googlecalendar')
export class GoogleCalendarController {
  constructor(private readonly googlecalendarService: GoogleCalendarService) {}

  @Get()
  getAuthUrl() {
    return this.googlecalendarService.generateAuthUrl();
  }

  @Get('/callback')
  addGoogleCalendar(@Query('code') code: string) {
    this.googlecalendarService.processCodeCallback(code);
  }
}
