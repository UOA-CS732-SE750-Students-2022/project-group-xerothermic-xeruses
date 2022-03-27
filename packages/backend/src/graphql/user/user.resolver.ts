import { Resolver, Int, Args, Query } from '@nestjs/graphql';
import { UserGraphQLModel } from './models/user.model';
import { UserService } from '~/database/user/user.service';

@Resolver(() => UserGraphQLModel)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => UserGraphQLModel, { name: 'user' })
  async getUser(@Args('id', { type: () => Int }) _id: number) {
    throw new Error('Stub');
  }

  @Query(() => [UserGraphQLModel])
  async users() {
    throw new Error('Stub');
  }
}
