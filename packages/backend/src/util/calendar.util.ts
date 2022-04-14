import { Injectable } from '@nestjs/common';
import { async as icalParser, VEvent, CalendarComponent } from 'node-ical';
import { UserInterval } from '~/graphql/user/models/userInterval.model';

const INTERVAL_DURATION = 15;

@Injectable()
export class CalendarUtil {
  async convertIcalToIntervals(
    uris: string[],
    startDate: Date,
    endDate: Date,
    startHour: number,
    endHour: number,
  ): Promise<UserInterval[]> {
    const events = [];
    for (const uri of uris) {
      const parsedIcal = await icalParser.fromURL(uri);
      events.push(...Object.values(parsedIcal));
    }

    const currentDateStart = this.mutateDate(startDate, startHour);
    const currentDateEnd = this.mutateDate(startDate, endHour);

    const endDateWithHour = this.mutateDate(endDate, endHour);

    const numberOfIntervals = (endHour - startHour) * 4;

    const userIntervals: UserInterval[] = [];

    while (currentDateStart < endDateWithHour) {
      const availabilityIntervals: Boolean[] = new Array(numberOfIntervals).fill(true);

      const allOccurences: Date[] = [];
      for (const event of Object.values(events)) {
        if (event.type === 'VEVENT') {
          const vevent = event as VEvent;

          console.log(event.summary);
          const intervalStart = this.mutateDate(currentDateStart);
          for (let i = 0; i < numberOfIntervals; i++) {
            const intervalEnd = this.mutateDate(
              intervalStart,
              undefined,
              intervalStart.getUTCMinutes() + INTERVAL_DURATION,
            );
            const eventDuration = event.end.getTime() - event.start.getTime();
            if (vevent.rrule) {
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
                  if (availabilityIntervals[i]) {
                    if (
                      event.getTime() <= intervalStart.getTime() &&
                      event.getTime() + eventDuration > intervalStart.getTime()
                    ) {
                      availabilityIntervals[i] = false;
                      console.log(' From all ', allOccurences, intervalStart, availabilityIntervals[i], eventDuration);
                    }
                  }
                });
              }
            } else {
              if (
                event.start.getTime() <= intervalStart.getTime() &&
                event.start.getTime() + eventDuration > intervalStart.getTime()
              ) {
                availabilityIntervals[i] = false;
                console.log(' From all ', allOccurences, intervalStart, intervalEnd, availabilityIntervals[i]);
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
