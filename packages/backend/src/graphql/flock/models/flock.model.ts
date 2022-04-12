import type { Flock, User } from '@flocker/api-types';
import { Field, ObjectType } from '@nestjs/graphql';
import { UserGraphQLModel } from '../../user/models/user.model';

@ObjectType()
export class FlockGraphQLModel implements Flock {
  @Field({ nullable: false })
  id!: string;

  @Field({ nullable: false })
  name!: string;

  @Field(() => [UserGraphQLModel], { nullable: false })
  users!: User[];
}
