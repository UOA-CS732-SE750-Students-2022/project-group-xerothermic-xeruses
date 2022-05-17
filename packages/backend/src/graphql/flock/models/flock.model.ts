import type {
  FlockDayDTO,
  FlockDTO,
  UserDTO,
  UserFlockAvailabilityDTO,
  UserManualAvailabilityDTO,
} from '@flocker/api-types';
import { Field, ObjectType } from '@nestjs/graphql';
import { UserGraphQLModel } from '../../user/models/user.model';
import { FlockDayGraphQLModel } from './flockDay.model';
import { UserFlockAvailabilityGraphQLModel } from './userFlockAvailability.model';
import { UserManualAvailabilityGraphQLModel } from './userManualAvailability.model';

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

  @Field(() => [UserFlockAvailabilityGraphQLModel], { nullable: false })
  userFlockAvailability!: UserFlockAvailabilityDTO[];

  @Field(() => [UserManualAvailabilityGraphQLModel], { nullable: false })
  userManualAvailability!: UserManualAvailabilityDTO[];
}
