import { Resolver, Args, Query } from '@nestjs/graphql';
import { GraphQLString } from 'graphql';
import { UserGraphQLModel } from './models/user.model';
import { UserService } from '~/database/user/user.service';

@Resolver(() => UserGraphQLModel)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => UserGraphQLModel)
  async getUser(@Args('id', { type: () => GraphQLString }) id: string) {
    return this.userService.findOne(id);
  }

  @Query(() => [UserGraphQLModel])
  async getUsers() {
    return this.userService.findAll();
  }
}
