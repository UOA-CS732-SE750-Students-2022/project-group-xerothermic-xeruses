import { Resolver, Int, Args, Parent, Mutation, Query } from '@nestjs/graphql';
import { UpdateUserInput } from './inputs/user.input';
import { User } from './models/user.model';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => User, { name: 'user' })
  async getUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.findOneById(id);
  }

  @Mutation((returns) => User)
  async changeName(@Args('updateUserData') updateUserData: UpdateUserInput) {
    return this.userService.changeNameById(updateUserData.id, updateUserData.name);
  }
}
