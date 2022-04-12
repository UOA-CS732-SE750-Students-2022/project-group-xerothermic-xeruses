import { Resolver, Args, Query, Parent, ResolveField, Mutation } from '@nestjs/graphql';
// eslint-disable-next-line import/no-unresolved
import { DecodedIdToken } from 'firebase-admin/auth';
import { GraphQLString } from 'graphql';
import { FlockDocument } from '~/database/flock/flock.schema';
import { FlockService } from '~/database/flock/flock.service';
import { UserService } from '~/database/user/user.service';
import { Auth } from '~/decorators/auth.decorator';
import { User } from '~/decorators/user.decorator';
import { AddFlockInput } from './inputs/addFlock.input';
import { FlockGraphQLModel } from './models/flock.model';

@Resolver(() => FlockGraphQLModel)
export class FlockResolver {
  constructor(private flockService: FlockService, private userService: UserService) {}

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
    return this.flockService.create(addFlockInput);
  }

  @Auth()
  @Query(() => GraphQLString)
  getFirebaseId(@User() user: DecodedIdToken) {
    return user.uid;
  }
}
