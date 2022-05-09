import { BadRequestException, Controller, Get, Headers, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { GoogleCalendarService } from './googlecalendar.service';

@Controller('googlecalendar')
export class GoogleCalendarController {
  constructor(private readonly googlecalendarService: GoogleCalendarService) {}

  @Get()
  async getAuthUrl(@Res() res: Response, @Headers('accept') acceptContentType: string) {
    const url = await this.googlecalendarService.generateAuthUrl();
    if (acceptContentType === 'application/json') {
      return res.json({ url });
    }
    if (acceptContentType === 'text/plain') {
      res.header('Content-Type', 'text/plain');
      return res.end(url);
    }
    return res.redirect(url);
  }

  @Get('/callback')
  addGoogleCalendar(@Query('code') code: string) {
    if (!code) {
      throw new BadRequestException('Missing `code` query parameter with Google OAuth2 callback code.');
    }
    this.googlecalendarService.processCodeCallback(code);
  }
}
