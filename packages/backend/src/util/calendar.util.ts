import { Injectable } from '@nestjs/common';
import dayjs, { extend as extendDayjs } from 'dayjs';
import dayjsTimezonePlugin from 'dayjs/plugin/timezone';
import dayjsUtcPlugin from 'dayjs/plugin/utc';
import { async as icalParser, type CalendarResponse, type VEvent } from 'node-ical';
import { GoogleCalendarService } from '~/googleCalendar/googleCalendar.service';
import { AvailabilityInterval, Interval } from './models';

// Timezone handling, see https://day.js.org/docs/en/plugin/timezone.
extendDayjs(dayjsUtcPlugin);
extendDayjs(dayjsTimezonePlugin);

const MILLISECONDS_IN_ONE_DAY = 86400000;

@Injectable()
export class CalendarUtil {
  public constructor(private readonly googleCalendarService: GoogleCalendarService) {}

  async convertIcalToIntervalsFromUris(uris: string[], intervals: Interval[]): Promise<AvailabilityInterval[]> {
    const calendars = await Promise.all(uris.map((uri) => icalParser.fromURL(uri)));
    return this.convertIcalToIntervals(calendars, intervals);
  }

  convertIcalToIntervals(calendars: CalendarResponse[], intervals: Interval[]): AvailabilityInterval[] {
    const events = calendars.flatMap((event) => Object.values(event));

    const availabilityIntervals: boolean[] = new Array(intervals.length).fill(true);
    for (const event of events) {
      if (event.type !== 'VEVENT') {
        continue;
      }

      const vevent = event as VEvent;

      const allOccurences: Date[] = [];
      intervals.forEach((interval, index) => {
        const { start, end } = interval;

        const eventDuration = vevent.end.getTime() - vevent.start.getTime();

        // If the event is date only, it means it is an all day event e.g. Christmas
        if (event.datetype === 'date' && this.isDuringInterval(vevent.start, start, end, MILLISECONDS_IN_ONE_DAY)) {
          availabilityIntervals[index] = false;
          // If the event is recurring, we need to check if it occurs during the interval
        } else if (vevent.rrule) {
          const eventsAtInterval = vevent.rrule.between(start, end, true);

          // If there are one or more events, then the user is unavailable
          if (eventsAtInterval.length > 0) {
            eventsAtInterval.forEach((recurringEvent) => {
              if (recurringEvent.getTime() !== end.getTime()) {
                availabilityIntervals[index] = false;
              }
            });

            allOccurences.push(...eventsAtInterval);
          } else {
            allOccurences.forEach((recurringEvent) => {
              if (this.startsBeforeOrAtInterval(recurringEvent, start, eventDuration)) {
                availabilityIntervals[index] = false;
              }
            });
          }
          // If the event is not recurring check if it occurs during the interval
        } else if (this.isDuringInterval(vevent.start, start, end, eventDuration)) {
          availabilityIntervals[index] = false;
        }
      });
    }

    return intervals.map((interval, index) => {
      return {
        ...interval,
        available: availabilityIntervals[index],
      };
    });
  }

  private startsBeforeOrAtInterval(event: Date, intervalStart: Date, eventDuration: number): boolean {
    return event.getTime() <= intervalStart.getTime() && event.getTime() + eventDuration > intervalStart.getTime();
  }

  private isDuringInterval(event: Date, intervalStart: Date, intervalEnd: Date, eventDuration: number): boolean {
    return event.getTime() < intervalEnd.getTime() && event.getTime() + eventDuration > intervalStart.getTime();
  }

  public async convertGoogleCalendarToIntervals(
    calendarIdWithRefreshTokens: [string, string][],
    intervals: Interval[],
  ): Promise<AvailabilityInterval[]> {
    if (intervals.length === 0) {
      return [];
    }

    // Find earliest start & latest interval end time.
    let timeMin = intervals[0].start;
    let timeMax = intervals[0].end;
    for (const interval of intervals) {
      if (interval.start < timeMin) {
        timeMin = interval.start;
      }
      if (interval.end > timeMax) {
        timeMax = interval.end;
      }
    }

    // Fetch events 1 day before / after the intervals.
    timeMin = new Date(timeMin);
    timeMin.setDate(timeMin.getDate() - 1);
    timeMax = new Date(timeMax);
    timeMax.setDate(timeMax.getDate() + 1);

    const oAuth2Client = this.googleCalendarService.createOAuth2Client();
    const availabilities = intervals.map((interval) => ({ ...interval, available: true }));

    for (const [calendarId, refreshToken] of calendarIdWithRefreshTokens) {
      oAuth2Client.setCredentials({ refresh_token: refreshToken });
      const { events, defaultTimeZone } = await this.googleCalendarService.getCalendarEvents(
        oAuth2Client,
        calendarId,
        timeMin,
        timeMax,
      );
      for (const event of events) {
        // Ignore cancelled events.
        if (event.status && event.status === 'cancelled') {
          continue;
        }
        // Ignore events that the user has specified they are "Show me as Available" during.
        if (event.transparency && event.transparency === 'transparent') {
          continue;
        }

        // These errors should never occur.
        if (event.start == null || (event.start?.date == null && event.start?.dateTime == null)) {
          throw new Error(`Missing start date for calendar: ${calendarId}, event: ${event.id}, start: ${event.start}`);
        }
        if (event.end == null || (event.end?.date == null && event.end?.dateTime == null)) {
          throw new Error(`Missing end date for calendar: ${calendarId}, event: ${event.id}, start: ${event.end}`);
        }

        const start = event.start.dateTime
          ? dayjs(event.start.dateTime)
          : dayjs.tz(event.start.date, event.start.timeZone ?? defaultTimeZone);
        const end = event.end.dateTime
          ? dayjs(event.end.dateTime)
          : dayjs.tz(event.end.date, event.end.timeZone ?? defaultTimeZone);

        for (const availability of availabilities) {
          if (start.isBefore(availability.end) && end.isAfter(availability.start)) {
            availability.available = false;
          }
        }
      }
    }

    return availabilities;
  }
}
