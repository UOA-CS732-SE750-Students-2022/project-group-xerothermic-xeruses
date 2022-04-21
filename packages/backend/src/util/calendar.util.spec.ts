import { sync as icalParser } from 'node-ical';
import { CalendarUtil } from './calendar.util';

interface FakeEvent {
  id: number;
  start: Date;
  durationMinutes: number;
  tz?: string;
  rrule?: string;
}

function createEvent(ev: FakeEvent) {
  const toDateStr = (d: Date) => d.toISOString().replace(/\.\d+|\W/g, '');
  const durationMillisecs = ev.durationMinutes * 60 * 1000;

  return [
    'BEGIN:VEVENT',
    `UID:${ev.id}@test.flocker.us`,
    'DTSTAMP:20191120T012345Z',
    `DESCRIPTION:Description for VEVENT ${ev.id}`,
    `DTSTART${ev.tz ? `;TZID=${ev.tz}` : ''}:${toDateStr(ev.start)}`,
    `DTEND${ev.tz ? `;TZID=${ev.tz}` : ''}:${toDateStr(new Date(ev.start.getTime() + durationMillisecs))}`,
    `${ev.rrule ? `RRULE:${ev.rrule}` : 'X-COMMENT:No rrule'}`,
    `SUMMARY:Summary for VEVENT ${ev.id}`,
    'END:VEVENT',
  ].join('\n');
}

function createIcal(events: Omit<FakeEvent, 'id'>[]) {
  const prefix = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//flocker.us//Flocker TEST//EN'].join('\n');
  const contents = events.map((ev, i) => createEvent({ ...ev, id: i }));
  const suffix = 'END:VCALENDAR';

  return [prefix, ...contents, suffix].join('\n');
}

function createCalendar(events: Omit<FakeEvent, 'id'>[]) {
  return icalParser.parseICS(createIcal(events));
}

function createIntervalWithAvailability(start: Date, available: boolean, durationMinutes = 15) {
  const durationMillisecs = durationMinutes * 60 * 1000;
  return {
    start,
    end: new Date(start.getTime() + durationMillisecs),
    available,
  };
}

function createIntervalsWithAvailability(start: Date, availablility: boolean[], durationMinutes = 15) {
  const durationMillisecs = durationMinutes * 60 * 1000;
  return availablility.map((isAvailable, i) => {
    const offset = i * durationMillisecs;
    return createIntervalWithAvailability(new Date(start.getTime() + offset), isAvailable, durationMinutes);
  });
}

const UTC = (Y: number, M = 1, D = 1, h = 0, m = 0, s = 0, ms = 0) => new Date(Date.UTC(Y, M - 1, D, h, m, s, ms));

describe(CalendarUtil.name, () => {
  let calUtil: CalendarUtil;

  beforeAll(() => {
    calUtil = new CalendarUtil();
  });

  it('0_calendars_0events_0intervals', () => {
    const response = calUtil.convertIcalToIntervals([], []);
    expect(response.length).toBe(0);
  });

  it('1_calendar_0events_1interval', () => {
    const calendar = createCalendar([]);
    const interval = createIntervalWithAvailability(new Date(0), true);

    const response = calUtil.convertIcalToIntervals([calendar], [interval]);
    expect(response.length).toBe(1);
    expect(response).toEqual([interval]);
  });

  it('1event_1interval_1available', () => {
    const calendar = createCalendar([{ start: UTC(2021, 11, 1, 13), durationMinutes: 60 }]);
    const interval = createIntervalWithAvailability(UTC(2023, 0), true);

    const response = calUtil.convertIcalToIntervals([calendar], [interval]);
    expect(response).toEqual([interval]);
  });

  it('1event_1interval_0available_startsBeforeInterval', () => {
    const calendar = createCalendar([{ start: UTC(2021, 11, 1, 12, 59), durationMinutes: 5 }]);
    const interval = createIntervalWithAvailability(UTC(2021, 11, 1, 13), false);

    const response = calUtil.convertIcalToIntervals([calendar], [interval]);
    expect(response).toEqual([interval]);
  });

  it('1event_1interval_0available_startsAtInterval', () => {
    const calendar = createCalendar([{ start: UTC(2021, 11, 1, 13), durationMinutes: 1 }]);
    const interval = createIntervalWithAvailability(UTC(2021, 11, 1, 13), false);

    const response = calUtil.convertIcalToIntervals([calendar], [interval]);
    expect(response).toEqual([interval]);
  });

  it('1event_1interval_0available_startsDuringInterval', () => {
    const calendar = createCalendar([{ start: UTC(2021, 11, 1, 13, 2), durationMinutes: 60 }]);
    const interval = createIntervalWithAvailability(UTC(2021, 11, 1, 13), false);

    const response = calUtil.convertIcalToIntervals([calendar], [interval]);
    expect(response).toEqual([interval]);
  });

  it('1event_1interval_1available_startsAfterInterval', () => {
    const calendar = createCalendar([{ start: UTC(2021, 11, 1, 13, 20), durationMinutes: 1 }]);
    const interval = createIntervalWithAvailability(UTC(2021, 11, 1, 13), true);

    const response = calUtil.convertIcalToIntervals([calendar], [interval]);
    expect(response).toEqual([interval]);
  });

  it('1event_1interval_0available_startsAndEndsDuringInterval', () => {
    const calendar = createCalendar([{ start: UTC(2021, 11, 1, 13, 2), durationMinutes: 1 }]);
    const interval = createIntervalWithAvailability(UTC(2021, 11, 1, 13), false);

    const response = calUtil.convertIcalToIntervals([calendar], [interval]);
    expect(response).toEqual([interval]);
  });

  it('1event_1interval_0available_startsBeforeAndEndsAfterInterval', () => {
    const calendar = createCalendar([{ start: UTC(2021, 11, 1, 12, 59), durationMinutes: 60 }]);
    const interval = createIntervalWithAvailability(UTC(2021, 11, 1, 13), false);

    const response = calUtil.convertIcalToIntervals([calendar], [interval]);
    expect(response).toEqual([interval]);
  });

  it('1event_1interval_1available_endsBeforeInterval', () => {
    const calendar = createCalendar([{ start: UTC(2021, 11, 1, 12), durationMinutes: 5 }]);
    const interval = createIntervalWithAvailability(UTC(2021, 11, 1, 13), true);

    const response = calUtil.convertIcalToIntervals([calendar], [interval]);
    expect(response).toEqual([interval]);
  });

  it('1event_1interval_1available_endsAtInterval', () => {
    const calendar = createCalendar([{ start: UTC(2021, 11, 1, 12, 59), durationMinutes: 1 }]);
    const interval = createIntervalWithAvailability(UTC(2021, 11, 1, 13), true);

    const response = calUtil.convertIcalToIntervals([calendar], [interval]);
    expect(response).toEqual([interval]);
  });

  it('1event_1interval_0available_endsDuringInterval', () => {
    const calendar = createCalendar([{ start: UTC(2021, 11, 1, 12, 59), durationMinutes: 5 }]);
    const interval = createIntervalWithAvailability(UTC(2021, 11, 1, 13), false);

    const response = calUtil.convertIcalToIntervals([calendar], [interval]);
    expect(response).toEqual([interval]);
  });

  /**
   * |-------------------------EVENT_1--------------------------|
   *                |-INTERVAL_1--||-INTERVAL_2--|
   */
  it('1event_2intervals_0available_longEvent', () => {
    const calendar = createCalendar([{ start: UTC(2021, 11, 1, 12, 45), durationMinutes: 60 }]);
    const intervals = createIntervalsWithAvailability(UTC(2021, 11, 1, 13), [false, false]);

    const response = calUtil.convertIcalToIntervals([calendar], intervals);
    expect(response).toEqual(intervals);
  });

  /**
   *           |EVENT_1-|
   * |-INTERVAL_1--||-INTERVAL_2--|
   */
  it('1event_2intervals_0available', () => {
    const calendar = createCalendar([{ start: UTC(2021, 11, 1, 13, 10), durationMinutes: 10 }]);
    const intervals = createIntervalsWithAvailability(UTC(2021, 11, 1, 13), [false, false]);

    const response = calUtil.convertIcalToIntervals([calendar], intervals);
    expect(response).toEqual(intervals);
  });

  /**
   *                          |EVENT_1-|
   * |-INTERVAL_1--||-INTERVAL_2--|
   */
  it('1event_2intervals_1available', () => {
    const calendar = createCalendar([{ start: UTC(2021, 11, 1, 13, 25), durationMinutes: 10 }]);
    const intervals = createIntervalsWithAvailability(UTC(2021, 11, 1, 13), [true, false]);

    const response = calUtil.convertIcalToIntervals([calendar], intervals);
    expect(response).toEqual(intervals);
  });

  /**
   * |EVENT_1-|                              |EVENT_1-|
   *           |-INTERVAL_1--||-INTERVAL_2--|
   */
  it('2event_2intervals_2available', () => {
    const calendar = createCalendar([
      { start: UTC(2021, 11, 1, 12, 50), durationMinutes: 10 },
      { start: UTC(2021, 11, 1, 13, 30), durationMinutes: 10 },
    ]);
    const intervals = createIntervalsWithAvailability(UTC(2021, 11, 1, 13), [true, true]);

    const response = calUtil.convertIcalToIntervals([calendar], intervals);
    expect(response).toEqual(intervals);
  });
});
