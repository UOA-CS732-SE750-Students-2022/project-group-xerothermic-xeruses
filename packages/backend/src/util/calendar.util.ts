import { UserIntervalDTO } from '@flocker/api-types';
import { BadRequestException, Injectable } from '@nestjs/common';
import { async as icalParser, VEvent } from 'node-ical';
import { UserIntervalInput } from '~/graphql/user/inputs/userInterval.input';

@Injectable()
export class CalendarUtil {
  async convertIcalToIntervals(uris: string[], intervals: UserIntervalInput[]): Promise<UserIntervalDTO[]> {
    const events = (await Promise.all(uris.map((uri) => icalParser.fromURL(uri)))).flatMap((event) =>
      Object.values(event),
    );

    const allOccurences: Date[] = [];
    const availabilityIntervals: boolean[] = new Array(intervals.length).fill(true);
    for (const event of Object.values(events)) {
      if (event.type !== 'VEVENT') {
        continue;
      }

      const vevent = event as VEvent;
      intervals.forEach((interval, index) => {
        const { start, end } = interval;
        // Ensure the start is after the end of the interval. Everything else should be handled since we are receiving valid dates
        if (start >= end) {
          throw new BadRequestException('Invalid interval(s)');
        }

        const eventDuration = event.end.getTime() - event.start.getTime();

        // If the event is date only, it means it is an all day event e.g. Christmas
        if ((event.start as any).dateOnly && this.isOnDay(event.start, start)) {
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
              if (this.isDuringInterval(recurringEvent, start, eventDuration)) {
                availabilityIntervals[index] = false;
              }
            });
          }

          // If the event is not recurring check if it occurs during the interval
        } else {
          if (this.isDuringInterval(event.start, start, eventDuration)) {
            availabilityIntervals[index] = false;
          }
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

  private isDuringInterval(event: Date, intervalStart: Date, eventDuration: number): boolean {
    return event.getTime() <= intervalStart.getTime() && event.getTime() + eventDuration > intervalStart.getTime();
  }

  private isOnDay(event: Date, intervalStart: Date): boolean {
    return (
      event.getUTCFullYear() === intervalStart.getUTCFullYear() &&
      event.getUTCMonth() === intervalStart.getUTCMonth() &&
      event.getUTCDate() === intervalStart.getUTCDate()
    );
  }
}
