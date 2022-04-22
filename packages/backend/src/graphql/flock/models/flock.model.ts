import type { FlockDTO, UserDTO } from '@flocker/api-types';
import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { UserGraphQLModel } from '../../user/models/user.model';

@ObjectType()
export class FlockGraphQLModel implements FlockDTO {
  @Field({ nullable: false })
  id!: string;

  @Field({ nullable: false })
  name!: string;

  @Field(() => GraphQLISODateTime, { nullable: false })
  startDate!: Date;

  @Field(() => GraphQLISODateTime, { nullable: false })
  endDate!: Date;

  @Field({ nullable: false })
  startHour!: number;

  @Field({ nullable: false })
  endHour!: number;

  @Field({ nullable: false })
  flockCode!: string;

  @Field(() => [UserGraphQLModel], { nullable: false })
  users!: UserDTO[];
}
