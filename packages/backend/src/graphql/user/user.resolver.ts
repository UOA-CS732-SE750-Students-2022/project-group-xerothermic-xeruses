import { Resolver, Args, Query, Mutation } from '@nestjs/graphql';
import { GraphQLString } from 'graphql';
import { UserService } from '~/database/user/user.service';
import { AddUserInput } from './inputs/addUser.input';
import { UserGraphQLModel } from './models/user.model';

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

  @Mutation(() => UserGraphQLModel)
  async addUser(@Args('addUserInput') addUserInput: AddUserInput) {
    return this.userService.create(addUserInput);
  }
}
