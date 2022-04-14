import { BadRequestException } from '@nestjs/common';
import { Resolver, Args, Query, Mutation, Parent, ResolveField } from '@nestjs/graphql';
// eslint-disable-next-line import/no-unresolved
import { DecodedIdToken } from 'firebase-admin/auth';
import { GraphQLString } from 'graphql';
import { FlockService } from '~/database/flock/flock.service';
import { UserDocument } from '~/database/user/user.schema';
import { UserService } from '~/database/user/user.service';
import { UserAvailabilityICal, USER_AVAILABILITY_ICAL } from '~/database/user/userAvailabilityICal.schema';
import { Auth } from '~/decorators/auth.decorator';
import { User } from '~/decorators/user.decorator';
import { CalendarUtil } from '~/util/calendar.util';
import { AddUserInput } from './inputs/addUser.input';
import { UserIntervalInput } from './inputs/userInterval.input';
import { UserGraphQLModel } from './models/user.model';
import { UserAvailabilityIntervalGraphQLModel } from './models/userAvailabilityInterval.model';

const MIN_HOUR = 0;
const MAX_HOUR = 24;

@Resolver(() => UserGraphQLModel)
export class UserResolver {
  constructor(
    private flockService: FlockService,
    private userService: UserService,
    private calendarUtil: CalendarUtil,
  ) {}

  @ResolveField()
  async flocks(@Parent() user: UserDocument) {
    return this.flockService.findMany(user.flocks);
  }

  @ResolveField()
  async flockInvites(@Parent() user: UserDocument) {
    return this.flockService.findMany(user.flockInvites);
  }

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
    const { startDate, endDate, startHour, endHour } = userIntervalInput;
    if (startDate > endDate || startHour >= endHour || startHour < MIN_HOUR || endHour > MAX_HOUR) {
      return new BadRequestException('Invalid date/time');
    }

    const user = await this.userService.findOne(id);

    if (user?.availability.length) {
      const calendarUris: string[] = user.availability
        .filter((availability) => availability.type === USER_AVAILABILITY_ICAL)
        .map((availability) => (availability as UserAvailabilityICal).uri);

      return {
        availability: this.calendarUtil.convertIcalToIntervals(calendarUris, startDate, endDate, startHour, endHour),
      };
    }

    return {
      availability: [],
    };
  }
}
