import { FlockAvailabilityIntervalDTO, FlockIntervalDTO } from '@flocker/api-types';
import { Field, ObjectType } from '@nestjs/graphql';
import { FlockIntervalGraphQLModel } from './flockUserInterval.model';

@ObjectType()
export class FlockAvailabilityIntervalGraphQLModel implements FlockAvailabilityIntervalDTO {
  @Field({ nullable: false })
  userId!: string;

  @Field(() => [FlockIntervalGraphQLModel], { nullable: false })
  intervals!: FlockIntervalDTO[];
}
