import { Resolver, Args, Query, Mutation } from '@nestjs/graphql';
// eslint-disable-next-line import/no-unresolved
import { DecodedIdToken } from 'firebase-admin/auth';
import { GraphQLString } from 'graphql';
import { async as icalParser, VEvent } from 'node-ical';
import { UserService } from '~/database/user/user.service';
import { Auth } from '~/decorators/auth.decorator';
import { User } from '~/decorators/user.decorator';
import { AddUserInput } from './inputs/addUser.input';
import { UserIntervalInput } from './inputs/userInterval.input';
import { UserGraphQLModel } from './models/user.model';
import { UserAvailabilityIntervalGraphQLModel } from './models/userAvailabilityInterval.model';

@Resolver(() => UserGraphQLModel)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => UserGraphQLModel)
  async getUser(@Args('id', { type: () => GraphQLString }) id: string) {
    return this.userService.findOne(id);
  }

  @Query(() => [UserGraphQLModel])
  async getUsers() {
    icalConverter(
      'https://uoacal.auckland.ac.nz/calendar/9929cd053ae1b4460709d83892ba6c9a54ed82462b9a57a42175e4108153db82347dc343b606f36ccfbc39461655af724244990173293d57a8d786a002fc4904',
      new Date(Date.UTC(2022, 9, 3)),
      new Date(Date.UTC(2022, 9, 6)),
      0,
      5,
    );
    return this.userService.findAll();
  }

  @Mutation(() => UserGraphQLModel)
  async addUser(@Args('addUserInput') addUserInput: AddUserInput) {
    return this.userService.create(addUserInput);
  }

  @Auth()
  @Query(() => GraphQLString)
  getFirebaseId(@User() user: DecodedIdToken) {
    return user.uid;
  }

  @Query(() => UserAvailabilityIntervalGraphQLModel)
  async getUserIntervals(@Args('userInterval') userInterval: UserIntervalInput) {
    console.log(userInterval);
    icalConverter(
      'https://uoacal.auckland.ac.nz/calendar/9929cd053ae1b4460709d83892ba6c9a54ed82462b9a57a42175e4108153db82347dc343b606f36ccfbc39461655af724244990173293d57a8d786a002fc4904',
      new Date(Date.UTC(2022, 9, 1)),
      new Date(Date.UTC(2022, 9, 15)),
      10,
      18,
    );
    return {
      intervals: [
        {
          date: new Date(),
          availability: [true],
        },
      ],
    };
  }
}

// we get all the events
// iterating over each day in the range
// iterate over each 15min interval in the range specified
// check if any event is occuring at that time
// and store result in an array for that day
const INTERVAL_DURATION = 15;

const icalConverter = async (uri: string, startDate: Date, endDate: Date, startHour: number, endHour: number) => {
  const events = await icalParser.fromURL(uri);

  const currentDateStart = convertToUtc(startDate, startHour);
  const currentDateEnd = convertToUtc(startDate, endHour);
  console.log('Intial:', currentDateStart, currentDateEnd);

  const startDateWithHour = convertToUtc(startDate, startHour);
  const endDateWithHour = convertToUtc(endDate, endHour);

  const hoursForEvents = endHour - startHour;
  const numberOfIntervals = hoursForEvents * 4;

  while (currentDateStart < endDateWithHour) {
    for (const event of Object.values(events)) {
      if (event.type === 'VEVENT') {
        const vevent = event as VEvent;
        console.log('Summary:', vevent.summary);

        for (
          const intervalStart = convertToUtc(currentDateStart);
          intervalStart < currentDateEnd;
          intervalStart.setMinutes(intervalStart.getUTCMinutes() + INTERVAL_DURATION)
        ) {
          const intervalEnd = convertToUtc(intervalStart, undefined, intervalStart.getUTCMinutes() + INTERVAL_DURATION);
          if (vevent.rrule) {
            const dates = vevent.rrule.between(intervalStart, intervalEnd, true);

            dates.forEach((date) => {
              console.log('Recurrence start:', date.toUTCString() + '\n');
            });
          }
        }
      }
    }
    console.log('Before:', currentDateStart, currentDateEnd);
    currentDateStart.setUTCDate(currentDateStart.getUTCDate() + 1);
    currentDateEnd.setUTCDate(currentDateEnd.getUTCDate() + 1);
    console.log('Dates:', currentDateStart, currentDateEnd);
  }
};

const convertToUtc = (date: Date, hours?: number, minutes?: number): Date => {
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
};
