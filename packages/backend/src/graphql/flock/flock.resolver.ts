import { UserIntervalDTO } from '@flocker/api-types';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Resolver, Args, Query, Parent, ResolveField, Mutation } from '@nestjs/graphql';
import { GraphQLString } from 'graphql';
import { Types } from 'mongoose';
import { FlockDocument } from '~/database/flock/flock.schema';
import { FlockService } from '~/database/flock/flock.service';
import { UserDocument } from '~/database/user/user.schema';
import { UserService } from '~/database/user/user.service';
import { UserAvailability } from '~/database/user/userAvailability.schema';
import { Auth } from '~/decorators/auth.decorator';
import { User } from '~/decorators/user.decorator';
import { CalendarUtil } from '~/util/calendar.util';
import { AddFlockInput } from './inputs/addFlock.input';
import { FlockAvailabilityIntervalInput } from './inputs/flockAvailabilityInterval.input';
import { ManualAvailabilityIntervalInput } from './inputs/manualAvailabilityInterval.input';
import { UserFlockAvailabilityInput } from './inputs/userFlockAvailability.input';
import { FlockGraphQLModel } from './models/flock.model';
import { FlockAvailabilityGraphQLModel } from './models/flockAvailability.model';

@Resolver(() => FlockGraphQLModel)
export class FlockResolver {
  constructor(
    private flockService: FlockService,
    private userService: UserService,
    private calendarUtil: CalendarUtil,
  ) {}

  @ResolveField()
  async users(@Parent() flock: FlockDocument) {
    return this.userService.findMany(flock.users);
  }

  @ResolveField()
  async userFlockAvailability(@Parent() flock: FlockDocument) {
    const userFlockAvailabilityIds = flock.userFlockAvailability.map((userFlockAvailability) => {
      return userFlockAvailability.userAvailabilityId;
    });

    const userAvailability = await this.userService.findManyUserAvailability(userFlockAvailabilityIds);

    return Promise.all(
      userAvailability.map(async (document, index) => ({
        user: await this.userService.findOne(document.userId),
        userAvailability: document.availabilityDocument,
        enabled: flock.userFlockAvailability[index].enabled,
      })),
    );
  }

  @ResolveField()
  async userManualAvailability(@Parent() flock: FlockDocument) {
    return Promise.all(
      flock.userManualAvailability.map(async (document) => ({
        intervals: document.intervals,
        user: await this.userService.findOne(document.user),
      })),
    );
  }

  @Query(() => FlockGraphQLModel)
  async getFlock(@Args('id', { type: () => GraphQLString }) id: string) {
    return this.flockService.findOne(id);
  }

  @Query(() => FlockGraphQLModel)
  async getFlockByCode(@Args('flockCode', { type: () => GraphQLString }) flockCode: string) {
    const flock = await this.flockService.findOneByCode(flockCode);

    if (!flock) {
      throw new NotFoundException(`Invalid flock code: ${flockCode}`);
    }

    return flock;
  }

  @Query(() => [FlockGraphQLModel])
  async getFlocks() {
    return this.flockService.findAll();
  }

  @Mutation(() => FlockGraphQLModel)
  async addFlock(@Args('addFlockInput') addFlockInput: AddFlockInput) {
    for (const flockDay of addFlockInput.flockDays) {
      const { start, end } = flockDay;

      if (start >= end) {
        return new BadRequestException('Invalid start and end date(s)');
      }
    }
    return this.flockService.create(addFlockInput);
  }

  @Auth()
  @Mutation(() => FlockGraphQLModel)
  async joinFlock(@Args('flockCode', { type: () => GraphQLString }) flockCode: string, @User() user: UserDocument) {
    const flock = await this.flockService.findOneByCode(flockCode);

    if (!flock) {
      throw new NotFoundException(`Invalid flock code: ${flockCode}`);
    }

    if (flock.users.includes(user._id)) {
      throw new BadRequestException(`User is already in this flock: ${flockCode}`);
    }

    const userFlockAvailabilities = user.availability.map((availability) => ({
      user: user._id,
      userAvailabilityId: availability._id,
      enabled: true,
    }));

    await this.flockService.addManyUserFlockAvailability(flock._id, userFlockAvailabilities);
    await this.userService.addFlockToUser(user._id, flock._id);
    return this.flockService.addUserToFlock(flock._id, user._id);
  }

  @Auth()
  @Mutation(() => FlockGraphQLModel)
  async updateAvailabilityEnablement(
    @Args('flockCode', { type: () => GraphQLString }) flockCode: string,
    @Args('userFlockAvailabilityInput') userFlockAvailabilityInput: UserFlockAvailabilityInput,
    @User() user: UserDocument,
  ) {
    const flock = await this.flockService.findOneByCode(flockCode);

    if (!flock) {
      throw new NotFoundException(`Invalid flock code: ${flockCode}`);
    } else if (!flock.users.includes(user._id)) {
      throw new BadRequestException('User is not in this flock');
    }

    const userAvailability = await this.userService.findUserAvailability(
      user._id,
      userFlockAvailabilityInput.userAvailabilityId,
    );

    if (!userAvailability) {
      throw new NotFoundException(`Invalid user availability id: ${userFlockAvailabilityInput.userAvailabilityId}`);
    }

    for (const userFlockAvailability of flock.userFlockAvailability) {
      if (userFlockAvailability.userAvailabilityId.toString() === userFlockAvailabilityInput.userAvailabilityId) {
        userFlockAvailability.enabled = userFlockAvailabilityInput.enabled;
        await flock.save();
        return flock;
      }
    }

    return this.flockService.addUserFlockAvailability(flock._id, {
      user: user._id,
      userAvailabilityId: userAvailability.availability[0]._id,
      enabled: userFlockAvailabilityInput.enabled,
    });
  }

  @Auth()
  @Mutation(() => FlockGraphQLModel)
  async setManualAvailabilityForFlock(
    @User() user: UserDocument,
    @Args('flockCode', { type: () => GraphQLString }) flockCode: string,
    @Args('manualAvailabilityIntervalInput') manualAvailabilityIntervalInput: ManualAvailabilityIntervalInput,
  ) {
    const flock = await this.flockService.findOneByCode(flockCode);

    if (!flock) {
      throw new NotFoundException(`Invalid flock code: ${flockCode}`);
    } else if (!flock.users.includes(user._id)) {
      throw new BadRequestException('User is not in this flock');
    }

    const { intervals } = manualAvailabilityIntervalInput;
    intervals.forEach((interval) => {
      const { start, end } = interval;
      if (start >= end) {
        throw new BadRequestException('Invalid interval(s)');
      }
    });

    for (const userManualAvailability of flock.userManualAvailability) {
      if (userManualAvailability.user.equals(user._id)) {
        return this.flockService.updateManualAvailability(flock._id, user._id, intervals);
      }
    }

    return this.flockService.addManualAvailability(flock._id, {
      user: user._id,
      intervals,
    });
  }

  @Auth()
  @Query(() => FlockAvailabilityGraphQLModel)
  async getUserIntervalsForFlock(
    @User() currentUser: UserDocument,
    @Args('flockCode', { type: () => GraphQLString }) flockCode: string,
    @Args('flockAvailabilityIntervalInput') flockAvailabilityIntervalInput: FlockAvailabilityIntervalInput,
  ): Promise<{
    availabilities: {
      userId: Types.ObjectId;
      intervals: UserIntervalDTO[];
    }[];
  }> {
    const flock = await this.flockService.findOneByCode(flockCode);
    if (!flock) {
      throw new NotFoundException(`Invalid flock code: ${flockCode}`);
    }

    const availabilitiesToCheck = flock.userFlockAvailability
      .filter((availability) => !availability.user.equals(currentUser._id) && availability.enabled)
      .map((userFlockAvailability) => userFlockAvailability.userAvailabilityId);

    const userAvailabilities = await this.userService.findManyUserAvailability(availabilitiesToCheck);

    // Create map of userId => userAvailabilities.
    const availabilitiesByUser = new Map<Types.ObjectId, UserAvailability[]>();
    for (const { userId, availabilityDocument } of userAvailabilities) {
      const availabilities = availabilitiesByUser.get(userId) || [];
      availabilities.push(availabilityDocument);
      availabilitiesByUser.set(userId, availabilities);
    }

    const { intervals } = flockAvailabilityIntervalInput;

    // Given a user's id & availability sources, return the user's calculated availability after applying manual overrides.
    const getUserAvailability = async ([userId, availabilityDocuments]: [Types.ObjectId, UserAvailability[]]) => {
      const manualAvailability = flock.userManualAvailability.find((availability) => availability.user.equals(userId));
      return {
        userId,
        intervals: await this.calendarUtil.getAvailabilityIntervals(
          intervals,
          availabilityDocuments,
          manualAvailability?.intervals,
        ),
      };
    };

    return {
      availabilities: await Promise.all([...availabilitiesByUser.entries()].map(getUserAvailability)),
    };
  }
}
