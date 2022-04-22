import type { FlockDayDTO, FlockDTO, UserDTO } from '@flocker/api-types';
import { Field, ObjectType } from '@nestjs/graphql';
import { UserGraphQLModel } from '../../user/models/user.model';
import { FlockDayGraphQLModel } from './flockDay.model';

@ObjectType()
export class FlockGraphQLModel implements FlockDTO {
  @Field({ nullable: false })
  id!: string;

  @Field({ nullable: false })
  name!: string;

  @Field(() => [FlockDayGraphQLModel], { nullable: false })
  flockDays!: FlockDayDTO[];

  @Field({ nullable: false })
  flockCode!: string;

  @Field(() => [UserGraphQLModel], { nullable: false })
  users!: UserDTO[];
}
