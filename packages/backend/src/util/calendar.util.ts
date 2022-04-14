import { UserIntervalDTO } from '@flocker/api-types';
import { Injectable } from '@nestjs/common';
import { async as icalParser, VEvent } from 'node-ical';

const INTERVAL_DURATION = 15;

@Injectable()
export class CalendarUtil {
  async convertIcalToIntervals(
    uris: string[],
    startDate: Date,
    endDate: Date,
    startHour: number,
    endHour: number,
  ): Promise<UserIntervalDTO[]> {
    const events = [];
    for (const uri of uris) {
      const parsedIcal = await icalParser.fromURL(uri);
      events.push(...Object.values(parsedIcal));
    }

    const currentDateStart = this.mutateDate(startDate, startHour);
    const currentDateEnd = this.mutateDate(startDate, endHour);
    const endDateWithHour = this.mutateDate(endDate, endHour);

    const numberOfIntervals = (endHour - startHour) * 4;
    const userIntervals: UserIntervalDTO[] = [];

    while (currentDateStart < endDateWithHour) {
      const availabilityIntervals: boolean[] = new Array(numberOfIntervals).fill(true);

      const allOccurences: Date[] = [];
      for (const event of Object.values(events)) {
        if (event.type === 'VEVENT') {
          const vevent = event as VEvent;

          const intervalStart = this.mutateDate(currentDateStart);
          for (let i = 0; i < numberOfIntervals; i++) {
            const intervalEnd = this.mutateDate(
              intervalStart,
              undefined,
              intervalStart.getUTCMinutes() + INTERVAL_DURATION,
            );

            const eventDuration = event.end.getTime() - event.start.getTime();

            // If the event is date only, it means it is an all day event e.g. Christmas
            if ((event.start as any).dateOnly) {
              availabilityIntervals[i] = false;
            } else if (vevent.rrule) {
              const eventsAtInterval = vevent.rrule.between(intervalStart, intervalEnd, true);

              // If there are one or more events, then the user is unavailable
              if (eventsAtInterval.length > 0) {
                eventsAtInterval.forEach((event) => {
                  if (event.getTime() !== intervalEnd.getTime()) {
                    availabilityIntervals[i] = false;
                  }
                });

                allOccurences.push(...eventsAtInterval);
              } else {
                allOccurences.forEach((event) => {
                  if (availabilityIntervals[i] && this.isDuringInterval(event, intervalStart, eventDuration)) {
                    availabilityIntervals[i] = false;
                  }
                });
              }
            } else {
              if (this.isDuringInterval(event.start, intervalStart, eventDuration)) {
                availabilityIntervals[i] = false;
              }
            }
            intervalStart.setMinutes(intervalStart.getUTCMinutes() + INTERVAL_DURATION);
          }
        }
      }

      userIntervals.push({
        date: this.mutateDate(currentDateStart, 0), // We dont want to include time in the date
        availability: availabilityIntervals,
      });

      currentDateStart.setUTCDate(currentDateStart.getUTCDate() + 1);
      currentDateEnd.setUTCDate(currentDateEnd.getUTCDate() + 1);
    }
    return userIntervals;
  }

  /**
   * Used to return a new date of an existing date, preserving UTC format, additionally with hours or minutes if supplied
   */
  private mutateDate(date: Date, hours?: number, minutes?: number): Date {
    if (hours) {
      return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), hours));
    } else if (minutes) {
      return new Date(
        Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), minutes),
      );
    }

    return new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes()),
    );
  }

  private isDuringInterval(event: Date, intervalStart: Date, eventDuration: number): boolean {
    return event.getTime() <= intervalStart.getTime() && event.getTime() + eventDuration > intervalStart.getTime();
  }
}
