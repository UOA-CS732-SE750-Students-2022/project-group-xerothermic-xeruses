import { Injectable } from '@nestjs/common';
import { async as icalParser, VEvent } from 'node-ical';
import { UserInterval } from '~/graphql/user/models/userInterval.model';

const INTERVAL_DURATION = 15;

@Injectable()
export class CalendarUtil {
  async convertIcalToIntervals(
    uri: string,
    startDate: Date,
    endDate: Date,
    startHour: number,
    endHour: number,
  ): Promise<UserInterval[]> {
    const events = await icalParser.fromURL(uri);

    const currentDateStart = this.mutateDate(startDate, startHour);
    const currentDateEnd = this.mutateDate(startDate, endHour);

    const endDateWithHour = this.mutateDate(endDate, endHour);

    const numberOfIntervals = (endHour - startHour) * 4;

    const userIntervals: UserInterval[] = [];

    while (currentDateStart < endDateWithHour) {
      const availabilityIntervals: Boolean[] = new Array(numberOfIntervals).fill(true);

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

            if (vevent.rrule) {
              const eventsAtInterval = vevent.rrule.between(intervalStart, intervalEnd, true);

              // If there are one or more events, then the user is unavailable
              if (eventsAtInterval.length > 0) {
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
    console.log(userIntervals);
    return userIntervals;
  }

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
}
