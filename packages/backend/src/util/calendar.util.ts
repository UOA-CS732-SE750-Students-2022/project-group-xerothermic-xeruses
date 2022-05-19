import { Injectable } from '@nestjs/common';
import dayjs, { extend as extendDayjs } from 'dayjs';
import dayjsTimezonePlugin from 'dayjs/plugin/timezone';
import dayjsUtcPlugin from 'dayjs/plugin/utc';
import { async as icalParser, type CalendarResponse, type VEvent } from 'node-ical';
import { UserManualAvailabilityDocument } from '~/database/flock/userManualAvailability.schema';
import { UserAvailability, UserAvailabilityDocument } from '~/database/user/userAvailability.schema';
import { UserAvailabilityGoogleCalendarDocument } from '~/database/user/userAvailabilityGoogleCalendar.schema';
import { UserAvailabilityICalDocument } from '~/database/user/userAvailabilityICal.schema';
import { GoogleCalendarService } from '~/googleCalendar/googleCalendar.service';
import { Availability, AvailabilityInterval, Interval, ManualAvailabilityInterval } from './models';
import { Types } from 'mongoose';

// Timezone handling, see https://day.js.org/docs/en/plugin/timezone.
extendDayjs(dayjsUtcPlugin);
extendDayjs(dayjsTimezonePlugin);

const MILLISECONDS_IN_ONE_DAY = 86400000;

@Injectable()
export class CalendarUtil {
  public constructor(private readonly googleCalendarService: GoogleCalendarService) {}

  async convertIcalToIntervalsFromUris(
    icalIdUris: [Types.ObjectId, string][],
    intervals: Interval[],
  ): Promise<AvailabilityInterval[]> {
    const calendars = await Promise.all(icalIdUris.map(([_id, uri]) => icalParser.fromURL(uri)));
    const icalCalendars = icalIdUris.map(([_id], index) => ({ _id, calendar: calendars[index] }));
    return this.convertIcalToIntervals(icalCalendars, intervals);
  }

  convertIcalToIntervals(
    calendars: { _id: Types.ObjectId; calendar: CalendarResponse }[],
    intervals: Interval[],
  ): AvailabilityInterval[] {
    const calendarEvents = calendars.map(({ _id, calendar }) => ({ events: Object.values(calendar), _id }));

    const availability: AvailabilityInterval[] = intervals.map((interval) => ({
      ...interval,
      availability: calendars.map(({ _id }) => ({ id: _id, available: true, manual: false })),
    }));

    let i = 0;
    for (const calendarEvent of calendarEvents) {
      const { events } = calendarEvent;

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
            availability[index].availability[i].available = false;
            // If the event is recurring, we need to check if it occurs during the interval
          } else if (vevent.rrule) {
            const eventsAtInterval = vevent.rrule.between(start, end, true);

            // If there are one or more events, then the user is unavailable
            if (eventsAtInterval.length > 0) {
              eventsAtInterval.forEach((recurringEvent) => {
                if (recurringEvent.getTime() !== end.getTime()) {
                  availability[index].availability[i].available = false;
                }
              });

              allOccurences.push(...eventsAtInterval);
            } else {
              allOccurences.forEach((recurringEvent) => {
                if (this.startsBeforeOrAtInterval(recurringEvent, start, eventDuration)) {
                  availability[index].availability[i].available = false;
                }
              });
            }
            // If the event is not recurring check if it occurs during the interval
          } else if (this.isDuringInterval(vevent.start, start, end, eventDuration)) {
            availability[index].availability[i].available = false;
          }
        });
      }
      i++;
    }

    return availability;
  }

  private startsBeforeOrAtInterval(event: Date, intervalStart: Date, eventDuration: number): boolean {
    return event.getTime() <= intervalStart.getTime() && event.getTime() + eventDuration > intervalStart.getTime();
  }

  private isDuringInterval(event: Date, intervalStart: Date, intervalEnd: Date, eventDuration: number): boolean {
    return event.getTime() < intervalEnd.getTime() && event.getTime() + eventDuration > intervalStart.getTime();
  }

  calculateManualAvailability(
    manualAvailability: UserManualAvailabilityDocument[],
    intervals: Interval[],
  ): ManualAvailabilityInterval[] {
    const availabilities: ManualAvailabilityInterval[] = intervals.map((interval) => ({
      ...interval,
      available: null,
    }));

    const availability: AvailabilityInterval[] = intervals.map((interval) => ({
      ...interval,
      availability: calendars.map(({ _id }) => ({ id: _id, available: true, manual: false })),
    }));

    for (const mAvailability of manualAvailability) {
      const { start, end, available } = mAvailability;

      for (const availability of availabilities) {
        const eventDuration = end.getTime() - start.getTime();

        // Check if the event occurs during the interval
        if (this.isDuringInterval(start, availability.start, availability.end, eventDuration)) {
          availability.available = available;
        }
      }
    }
    return availabilities;
  }

  public async getAvailabilityIntervals(
    intervals: Interval[],
    availabilities: UserAvailabilityDocument[],
    availabilityOverrideIntervals: UserManualAvailabilityDocument | undefined = undefined,
  ): Promise<AvailabilityInterval[]> {
    // Every interval must have a positive duration..
    for (const interval of intervals) {
      if (interval.start >= interval.end) {
        throw new Error(`Invalid interval: ${JSON.stringify(interval)}`);
      }
    }

    const isUserAvailabilityICalDocument = (
      availability: UserAvailability,
    ): availability is UserAvailabilityICalDocument => availability.type === 'ical';
    const isUserAvailabilityGoogleCalendarDocument = (
      availability: UserAvailability,
    ): availability is UserAvailabilityGoogleCalendarDocument => availability.type === 'googlecalendar';

    // ICal URIs.
    const calendarUris: [Types.ObjectId, string][] = availabilities //
      .filter(isUserAvailabilityICalDocument)
      .map((availability) => [availability._id, availability.uri]);
    const icalAvailability = await this.convertIcalToIntervalsFromUris(calendarUris, intervals);

    // Google Calendar.
    const calendarIdWithRefreshTokens: [Types.ObjectId, string, string][] = availabilities
      .filter(isUserAvailabilityGoogleCalendarDocument)
      .map((availability) => [availability._id, availability.calendarId, availability.refreshToken]);
    const googleAvailability = await this.convertGoogleCalendarToIntervals(calendarIdWithRefreshTokens, intervals);

    // Manual availability.
    const overrideAvailability =
      availabilityOverrideIntervals && this.calculateManualAvailability(availabilityOverrideIntervals, intervals);

    // We rely on the convert/calculate functions returning an array in the same order as
    // `intervals`. Check that the calculated intervals returned match the expected intervals.
    for (let i = 0; i < intervals.length; i++) {
      const { start, end } = intervals[i];
      if (
        start !== icalAvailability[i].start ||
        start !== googleAvailability[i].start ||
        (overrideAvailability && start !== overrideAvailability[i].start) ||
        end !== icalAvailability[i].end ||
        end !== googleAvailability[i].end ||
        (overrideAvailability && end !== overrideAvailability[i].end)
      ) {
        throw new Error('Received invalid intervals when calculating availability.');
      }
    }

    return intervals.map((interval, i) => {
      const intervalAvailability = { ...interval, availability: [] };
      const icalAvailabilityInterval = icalAvailability[i];
      const googleAvailabilityInterval = googleAvailability[i];
      const manualAvailabilityInterval = overrideAvailability && overrideAvailability[i];

      if (overrideAvailability?.[i]) {
        intervalAvailability.availability.push({
          ...overrideAvailability[i],
        });
      }

      return {
        ...interval,
        available:
          overrideAvailability?.[i].available ?? (icalAvailability[i].available && googleAvailability[i].available),
      };
    });
  }

  public async convertGoogleCalendarToIntervals(
    idCalendarIdWithRefreshTokens: [Types.ObjectId, string, string][],
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
    const availabilities = intervals.map((interval) => ({
      ...interval,
      availability: idCalendarIdWithRefreshTokens.map(([id]) => ({
        id,
        available: true,
        manual: false,
      })),
    }));

    let i = 0;
    for (const [_id, calendarId, refreshToken] of idCalendarIdWithRefreshTokens) {
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
            availability.availability[i].available = false;
          }
        }
      }
      i++;
    }

    return availabilities;
  }
}
