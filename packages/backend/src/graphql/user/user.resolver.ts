import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Resolver, Args, Query, Mutation, Parent, ResolveField } from '@nestjs/graphql';
// eslint-disable-next-line import/no-unresolved
import { DecodedIdToken } from 'firebase-admin/auth';
import { GraphQLBoolean, GraphQLString } from 'graphql';
import { FlockService } from '~/database/flock/flock.service';
import { UserDocument } from '~/database/user/user.schema';
import { UserService } from '~/database/user/user.service';
import { UserAvailability } from '~/database/user/userAvailability.schema';
import { UserAvailabilityGoogleCalendarDocument } from '~/database/user/userAvailabilityGoogleCalendar.schema';
import { UserAvailabilityICalDocument } from '~/database/user/userAvailabilityICal.schema';
import { UserAvailabilityUtil } from '~/database/user/util/userAvailability.util';
import { Auth } from '~/decorators/auth.decorator';
import { User } from '~/decorators/user.decorator';
import { ValidateUser } from '~/decorators/validate-user-auth.decorator';
import { CalendarUtil } from '~/util/calendar.util';
import { ManualAvailabilityInterval } from '~/util/models';
import { AddUserInput } from './inputs/addUser.input';
import { UserAvailabilityInput } from './inputs/common/userAvailability.input';
import { UserAvailabilityIntervalInput } from './inputs/userAvailabilityInterval.input';
import { UserGraphQLModel } from './models/user.model';
import { UserAvailabilityIntervalGraphQLModel } from './models/userAvailabilityInterval.model';

@Resolver(() => UserGraphQLModel)
export class UserResolver {
  constructor(
    private flockService: FlockService,
    private userService: UserService,
    private calendarUtil: CalendarUtil,
    private userAvailabilityValidation: UserAvailabilityUtil,
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
  async getCurrentUser(@User() user: UserDocument) {
    return user;
  }

  @ValidateUser()
  @Mutation(() => UserGraphQLModel)
  async addUser(@User() user: DecodedIdToken, @Args('addUserInput') addUserInput: AddUserInput) {
    return this.userService.create({ ...addUserInput, firebaseId: user.uid });
  }

  @Auth()
  @Mutation(() => UserGraphQLModel)
  async addUserAvailabilitySources(
    @User() user: UserDocument,
    @Args({ name: 'userAvailabilitySources', type: () => [UserAvailabilityInput] })
    userAvailabilitySources: UserAvailabilityInput[],
  ) {
    // Check that input is valid - special checks because UserAvailability is a union type.
    const invalidSources = userAvailabilitySources.filter(
      (mightBeAvailabilitySource) => !this.userAvailabilityValidation.isUserAvailability(mightBeAvailabilitySource),
    );
    if (invalidSources.length > 0) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Bad Request',
        invalidSources,
      });
    }

    // Strip any other fields off the userAvailability (e.g. uri should not be on a Google Calendar source).
    const sources = userAvailabilitySources.map((validSource) =>
      this.userAvailabilityValidation.toUserAvailability(validSource as UserAvailability),
    );

    return this.userService.addUserAvailability(user._id, sources);
  }

  @Auth()
  @Query(() => UserAvailabilityIntervalGraphQLModel)
  async getUserIntervals(
    @User() user: UserDocument,
    @Args('availabilityIds', { type: () => [GraphQLString] }) availabilityIds: string[],
    @Args('flockCode', { type: () => [GraphQLString] }) flockCode: string,
    @Args('userIntervalInput', { type: () => UserAvailabilityIntervalInput })
    userAvailabilityIntervalInput: UserAvailabilityIntervalInput,
  ) {
    const flock = await this.flockService.findOneByCode(flockCode);

    if (!flock) {
      throw new NotFoundException(`Invalid flock code: ${flockCode}`);
    } else if (!flock.users.includes(user._id)) {
      throw new BadRequestException('User is not in this flock');
    }

    const { intervals } = userAvailabilityIntervalInput;
    intervals.forEach((interval) => {
      const { start, end } = interval;
      // Ensure the start is after the end of the interval. Everything else should be handled since we are receiving valid dates
      if (start >= end) {
        throw new BadRequestException('Invalid interval(s)');
      }
    });

    const results = await Promise.all(
      availabilityIds.map((availabilityId) => this.userService.findUserAvailability(user._id, availabilityId)),
    );
    const userAvailabilities = results.flatMap((userDocument) => userDocument?.availability ?? []);

    // ICal URIs.
    const calendarUris = userAvailabilities
      .filter((availability): availability is UserAvailabilityICalDocument => availability.type === 'ical')
      .map((availability) => availability.uri);
    const icalAvailability = await this.calendarUtil.convertIcalToIntervalsFromUris(calendarUris, intervals);

    // Google Calendar.
    const calendarIdWithRefreshTokens: [string, string][] = userAvailabilities
      .filter(
        (availability): availability is UserAvailabilityGoogleCalendarDocument =>
          availability.type === 'googlecalendar',
      )
      .map((availability) => [availability.calendarId, availability.refreshToken]);
    const googleAvailability = await this.calendarUtil.convertGoogleCalendarToIntervals(
      calendarIdWithRefreshTokens,
      intervals,
    );

    // Manual availability.
    let manualAvailability: ManualAvailabilityInterval[] | null = null;
    for (const mAvailability of flock.userManualAvailability) {
      if (mAvailability.user.equals(user._id)) {
        manualAvailability = this.calendarUtil.calculateManualAvailability(mAvailability.intervals, intervals);
      }
    }

    return {
      availability: intervals.map((interval, i) => ({
        ...interval,
        available:
          manualAvailability?.[i].available ?? (icalAvailability[i].available && googleAvailability[i].available),
      })),
    };
  }

  @Auth()
  @Mutation(() => GraphQLBoolean)
  async inviteToFlock(
    @User() user: UserDocument,
    @Args('flockCode', { type: () => GraphQLString }) flockCode: string,
    @Args('userToInvite', { type: () => GraphQLString }) userIdToInvite: string,
  ) {
    const flock = await this.flockService.findOneByCode(flockCode);
    if (!flock) {
      throw new NotFoundException(`Invalid flock code: ${flockCode}`);
    }

    // TODO: Check that `user` has permission to invite people to the flock.

    const userToInvite = await this.userService.findOne(userIdToInvite);
    if (!userToInvite) {
      throw new NotFoundException(`Invalid userToInvite: ${userToInvite}`);
    }

    if (flock.users.includes(userToInvite._id)) {
      throw new BadRequestException('User is already in this flock');
    }

    if (userToInvite.flockInvites.includes(flock._id)) {
      throw new BadRequestException('User has already been invited to this flock');
    }

    userToInvite.flockInvites.push(flock._id);
    await userToInvite.save();

    // Can't return null, might as well give it a happy boolean.
    return true;
  }

  @Auth()
  @Mutation(() => UserGraphQLModel)
  async leaveFlock(@User() user: UserDocument, @Args('flockCode', { type: () => GraphQLString }) flockCode: string) {
    const flock = await this.flockService.findOneByCode(flockCode);
    if (!flock) {
      throw new NotFoundException(`Invalid flock code: ${flockCode}`);
    } else if (!flock.users.includes(user._id)) {
      throw new BadRequestException('User is not in this flock');
    }

    this.userService.removeFlock(user._id, flock._id);
    this.flockService.removeUserFromFlock(flock._id, user._id);
    this.flockService.removeUserAvailability(flock._id, user._id);
    return this.flockService.removeUserManualAvailability(flock._id, user._id);
  }
}
