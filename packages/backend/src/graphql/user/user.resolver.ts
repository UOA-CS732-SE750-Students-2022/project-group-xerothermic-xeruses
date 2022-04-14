import { BadRequestException } from '@nestjs/common';
import { Resolver, Args, Query, Mutation } from '@nestjs/graphql';
// eslint-disable-next-line import/no-unresolved
import { DecodedIdToken } from 'firebase-admin/auth';
import { GraphQLString } from 'graphql';
import { UserService } from '~/database/user/user.service';
import { UserAvailability } from '~/database/user/userAvailability.schema';
import { Auth } from '~/decorators/auth.decorator';
import { User } from '~/decorators/user.decorator';
import { CalendarUtil } from '~/util/calendar.util';
import { AddUserInput } from './inputs/addUser.input';
import { UserIntervalInput } from './inputs/userInterval.input';
import { UserGraphQLModel } from './models/user.model';
import { UserAvailabilityIntervalGraphQLModel } from './models/userAvailabilityInterval.model';
import { UserInterval } from './models/userInterval.model';

@Resolver(() => UserGraphQLModel)
export class UserResolver {
  constructor(private userService: UserService, private calendarUtil: CalendarUtil) {}

  @Query(() => UserGraphQLModel)
  async getUser(@Args('id', { type: () => GraphQLString }) id: string) {
    return this.userService.findOne(id);
  }

  @Query(() => [UserGraphQLModel])
  async getUsers() {
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
  async getUserIntervals(
    @Args('id', { type: () => GraphQLString }) id: string,
    @Args('userIntervalInput', { type: () => UserIntervalInput }) userIntervalInput: UserIntervalInput,
  ) {
    const { startDate, endDate, availabilityStartHour, availabilityEndHour } = userIntervalInput;
    if (
      startDate > endDate ||
      availabilityStartHour >= availabilityEndHour ||
      availabilityStartHour < 0 ||
      availabilityEndHour > 24
    ) {
      return new BadRequestException('Invalid date/time');
    }

    const user = await this.userService.findOne(id);

    if (user?.availability.length) {
      const calendarUris: string[] = [];
      user.availability.forEach((availability) => {
        if (availability.type === 'ical') {
          calendarUris.push(availability.uri);
        }
      });

      return {
        intervals: this.calendarUtil.convertIcalToIntervals(
          calendarUris,
          startDate,
          endDate,
          availabilityStartHour,
          availabilityEndHour,
        ),
      };
    }

    return {
      intervals: [],
    };
  }
}
