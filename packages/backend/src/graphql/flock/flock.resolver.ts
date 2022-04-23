import { BadRequestException } from '@nestjs/common';
import { Resolver, Args, Query, Parent, ResolveField, Mutation } from '@nestjs/graphql';
// eslint-disable-next-line import/no-unresolved
import { DecodedIdToken } from 'firebase-admin/auth';
import { GraphQLString } from 'graphql';
import { FlockDocument } from '~/database/flock/flock.schema';
import { FlockService } from '~/database/flock/flock.service';
import { UserService } from '~/database/user/user.service';
import { Auth } from '~/decorators/auth.decorator';
import { User } from '~/decorators/user.decorator';
import { CalendarUtil } from '~/util/calendar.util';
import { FlockUtil } from '~/util/flock.util';
import { AddFlockInput } from './inputs/addFlock.input';
import { FlockGraphQLModel } from './models/flock.model';

const FLOCK_CODE_LENGTH = 8;

@Resolver(() => FlockGraphQLModel)
export class FlockResolver {
  constructor(
    private flockService: FlockService,
    private userService: UserService,
    private flockUtil: FlockUtil,
    private calendarUtil: CalendarUtil,
  ) {}

  @ResolveField()
  async users(@Parent() flock: FlockDocument) {
    return this.userService.findMany(flock.users);
  }

  @Query(() => FlockGraphQLModel)
  async getFlock(@Args('id', { type: () => GraphQLString }) id: string) {
    return this.flockService.findOne(id);
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

    const flockCode = this.flockUtil.generateFlockCode(FLOCK_CODE_LENGTH);
    return this.flockService.create({ ...addFlockInput, flockCode });
  }

  @Auth()
  @Query(() => GraphQLString)
  getFirebaseId(@User() user: DecodedIdToken) {
    return user.uid;
  }
}
