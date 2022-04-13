import type { FlockDTO, UserDTO } from '@flocker/api-types';
import { Field, ObjectType } from '@nestjs/graphql';
import { UserGraphQLModel } from '../../user/models/user.model';

@ObjectType()
export class FlockGraphQLModel implements FlockDTO {
  @Field({ nullable: false })
  id!: string;

  @Field({ nullable: false })
  name!: string;

  @Field(() => [UserGraphQLModel], { nullable: false })
  users!: UserDTO[];
}
