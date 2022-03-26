import { Resolver, Int, Args, Query } from '@nestjs/graphql';
import { UserService } from '~/database/user/user.service';
import { UserGraphqlSchema } from './models/user.model';

@Resolver(() => UserGraphqlSchema)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => UserGraphqlSchema, { name: 'user' })
  async getUser(@Args('id', { type: () => Int }) id: number) {
    throw new Error('Stub');
  }

  @Query(() => [UserGraphqlSchema])
  async users() {
    throw new Error('Stub');
  }
}
