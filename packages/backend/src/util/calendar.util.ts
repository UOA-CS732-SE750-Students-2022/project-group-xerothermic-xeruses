import { UserIntervalDTO } from '@flocker/api-types';
import { Injectable } from '@nestjs/common';
import { async as icalParser, VEvent } from 'node-ical';

const INTERVAL_DURATION = 15;
const INTERVALS_IN_HOUR = 60 / INTERVAL_DURATION;

@Injectable()
export class CalendarUtil {
  async convertIcalToIntervals(
    uris: string[],
    startDate: Date,
    endDate: Date,
    startHour: number,
    endHour: number,
  ): Promise<UserIntervalDTO[]> {
    const events = (await Promise.all(uris.map((uri) => icalParser.fromURL(uri)))).flatMap((event) =>
      Object.values(event),
    );

    const currentDateStart = this.newDateModifyHours(startDate, startHour);
    const currentDateEnd = this.newDateModifyHours(startDate, endHour);
    const endDateWithHour = this.newDateModifyHours(endDate, endHour);

    const numberOfIntervals = (endHour - startHour) * INTERVALS_IN_HOUR;
    const userIntervals: UserIntervalDTO[] = [];

    while (currentDateStart < endDateWithHour) {
      const availabilityIntervals: boolean[] = new Array(numberOfIntervals).fill(true);
      const allOccurences: Date[] = [];
      for (const event of Object.values(events)) {
        if (event.type !== 'VEVENT') {
          continue;
        }
        const vevent = event as VEvent;

        const intervalStart = new Date(currentDateStart);
        for (let i = 0; i < numberOfIntervals; i++) {
          const intervalEnd = this.newDateModifyMinutes(
            intervalStart,
            intervalStart.getUTCMinutes() + INTERVAL_DURATION,
          );

          const eventDuration = event.end.getTime() - event.start.getTime();

          // If the event is date only, it means it is an all day event e.g. Christmas
          if ((event.start as any).dateOnly) {
            availabilityIntervals[i] = false;

            // If the event is recurring, we need to check if it occurs during the interval
          } else if (vevent.rrule) {
            const eventsAtInterval = vevent.rrule.between(intervalStart, intervalEnd, true);

            // If there are one or more events, then the user is unavailable
            if (eventsAtInterval.length > 0) {
              eventsAtInterval.forEach((recurringEvent) => {
                if (recurringEvent.getTime() !== intervalEnd.getTime()) {
                  availabilityIntervals[i] = false;
                }
              });

              allOccurences.push(...eventsAtInterval);
            } else {
              allOccurences.forEach((recurringEvent) => {
                if (this.isDuringInterval(recurringEvent, intervalStart, eventDuration)) {
                  availabilityIntervals[i] = false;
                }
              });
            }

            // If the event is not recurring check if it occurs during the interval
          } else {
            if (this.isDuringInterval(event.start, intervalStart, eventDuration)) {
              availabilityIntervals[i] = false;
            }
          }
          intervalStart.setMinutes(intervalStart.getUTCMinutes() + INTERVAL_DURATION);
        }
      }

      userIntervals.push({
        date: this.newDateModifyHours(currentDateStart, 0), // We dont want to include time in the date
        intervals: availabilityIntervals,
      });

      currentDateStart.setUTCDate(currentDateStart.getUTCDate() + 1);
      currentDateEnd.setUTCDate(currentDateEnd.getUTCDate() + 1);
    }

    return userIntervals;
  }

  /**
   * Return a new date with the hours set and the rest of the time as 00:00:00.
   */
  private newDateModifyHours(date: Date, hours: number): Date {
    const clearedDate = new Date(date);
    clearedDate.setUTCHours(hours, 0, 0, 0);
    return clearedDate;
  }

  /**
   * Return a new date with the minutes set and the rest of the time as 00:00.
   */
  private newDateModifyMinutes(date: Date, minutes: number): Date {
    const clearedDate = new Date(date);
    clearedDate.setUTCMinutes(minutes, 0, 0);
    return clearedDate;
  }

  private isDuringInterval(event: Date, intervalStart: Date, eventDuration: number): boolean {
    return event.getTime() <= intervalStart.getTime() && event.getTime() + eventDuration > intervalStart.getTime();
  }
}
