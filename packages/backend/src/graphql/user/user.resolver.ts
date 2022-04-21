import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Resolver, Args, Query, Mutation, Parent, ResolveField } from '@nestjs/graphql';
// eslint-disable-next-line import/no-unresolved
import { DecodedIdToken } from 'firebase-admin/auth';
import { GraphQLString } from 'graphql';
import { FlockService } from '~/database/flock/flock.service';
import { UserDocument } from '~/database/user/user.schema';
import { UserService } from '~/database/user/user.service';
import { Auth } from '~/decorators/auth.decorator';
import { User } from '~/decorators/user.decorator';
import { CalendarUtil } from '~/util/calendar.util';
import { AddUserInput } from './inputs/addUser.input';
import { UserAvailabilityIntervalInput } from './inputs/userAvailabilityInterval.input';
import { UserGraphQLModel } from './models/user.model';
import { UserAvailabilityIntervalGraphQLModel } from './models/userAvailabilityInterval.model';

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
  async getUserById(@Args('id', { type: () => GraphQLString }) id: string) {
    return this.userService.findOne(id);
  }

  @Query(() => [UserGraphQLModel])
  async getUsers() {
    return this.userService.findAll();
  }

  @Auth()
  @Query(() => UserGraphQLModel)
  async getCurrentUser(@User() user: DecodedIdToken) {
    return this.userService.findOneByFirebaseId(user.uid);
  }

  @Auth()
  @Mutation(() => UserGraphQLModel)
  async addUser(@User() user: DecodedIdToken, @Args('addUserInput') addUserInput: AddUserInput) {
    return this.userService.create({ ...addUserInput, firebaseId: user.uid });
  }

  @Auth()
  @Query(() => UserAvailabilityIntervalGraphQLModel)
  async getUserIntervals(
    @User() user: DecodedIdToken,
    @Args('availabilityIds', { type: () => [GraphQLString] }) availabilityIds: string[],
    @Args('userIntervalInput', { type: () => UserAvailabilityIntervalInput })
    userAvailabilityIntervalInput: UserAvailabilityIntervalInput,
  ) {
    const firebaseId = user.uid;
    const userDocument = await this.userService.findOneByFirebaseId(firebaseId);

    if (!userDocument) {
      throw new NotFoundException('Invalid user id');
    }

    const calendarUris = (
      await Promise.all(
        availabilityIds.map((availabilityId) => this.userService.findUserAvailability(firebaseId, availabilityId)),
      )
    )
      .flatMap((userDoc) => (userDoc ? userDoc.availability : []))
      .flatMap((availability) => {
        if (availability.type === 'ical') {
          return availability.uri;
        }
        return [];
      });

    const { intervals } = userAvailabilityIntervalInput;
    intervals.forEach((interval) => {
      const { start, end } = interval;
      // Ensure the start is after the end of the interval. Everything else should be handled since we are receiving valid dates
      if (start >= end) {
        throw new BadRequestException('Invalid interval(s)');
      }
    });

    return {
      availability: this.calendarUtil.convertIcalToIntervalsFromUris(calendarUris, intervals),
    };
  }
}
