import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Resolver, Args, Query, Parent, ResolveField, Mutation } from '@nestjs/graphql';
import { GraphQLString } from 'graphql';
import { FlockDocument } from '~/database/flock/flock.schema';
import { FlockService } from '~/database/flock/flock.service';
import { UserDocument } from '~/database/user/user.schema';
import { UserService } from '~/database/user/user.service';
import { Auth } from '~/decorators/auth.decorator';
import { User } from '~/decorators/user.decorator';
import { CalendarUtil } from '~/util/calendar.util';
import { AddFlockInput } from './inputs/addFlock.input';
import { FlockAvailabilityIntervalInput } from './inputs/flockAvailabilityInterval.input';
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
      userAvailability.map((document, index) => ({
        user: this.userService.findOne(document.userId),
        userAvailability: document.availabilityDocument,
        enabled: flock.userFlockAvailability[index].enabled,
      })),
    );
  }

  @ResolveField()
  async userManualAvailability(@Parent() flock: FlockDocument) {
    return Promise.all(
      flock.userManualAvailability.map((document) => ({
        intervals: document.intervals,
        user: this.userService.findOne(document.user),
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
    @Args('flockAvailabilityIntervalInput') flockAvailabilityIntervalInput: FlockAvailabilityIntervalInput,
  ) {
    const flock = await this.flockService.findOneByCode(flockCode);

    if (!flock) {
      throw new NotFoundException(`Invalid flock code: ${flockCode}`);
    } else if (!flock.users.includes(user._id)) {
      throw new BadRequestException('User is not in this flock');
    }

    const { intervals } = flockAvailabilityIntervalInput;
    intervals.forEach((interval) => {
      const { start, end } = interval;
      if (start >= end) {
        throw new BadRequestException('Invalid interval(s)');
      }
    });

    for (const userManualAvailability of flock.userManualAvailability) {
      if (userManualAvailability.user.toString() === user._id.toString()) {
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
  ) {
    const flock = await this.flockService.findOneByCode(flockCode);

    if (!flock) {
      throw new NotFoundException(`Invalid flock code: ${flockCode}`);
    }

    const availabilitiesToCheck = flock.userFlockAvailability
      .filter(
        (userFlockAvailability) =>
          userFlockAvailability.user.toString() !== currentUser._id.toString() && userFlockAvailability.enabled,
      )
      .map((userFlockAvailability) => userFlockAvailability.userAvailabilityId);

    const userAvailabilities = await this.userService.findManyUserAvailability(availabilitiesToCheck);

    const availabilities = [];
    for (const availability of userAvailabilities) {
      const { userId, availabilityDocument } = availability;
      if (availabilityDocument.type !== 'ical') {
        continue;
      }

      let availabilityIntervals = await this.calendarUtil.convertIcalToIntervalsFromUris(
        [availabilityDocument.uri],
        flockAvailabilityIntervalInput.intervals,
      );

      for (const manualAvailability of flock.userManualAvailability) {
        if (manualAvailability.user.toString() === userId.toString()) {
          availabilityIntervals = this.calendarUtil.calculateManualAvailability(
            manualAvailability.intervals,
            availabilityIntervals,
          );
        }
      }

      availabilities.push({
        userId,
        intervals: availabilityIntervals,
      });
    }

    return { availabilities };
  }
}
