import { FlockAvailabilityDTO, FlockAvailabilityIntervalDTO } from '@flocker/api-types';
import { Field, ObjectType } from '@nestjs/graphql';
import { FlockAvailabilityIntervalGraphQLModel } from './flockAvailabilityInterval.model';

@ObjectType()
export class FlockAvailabilityGraphQLModel implements FlockAvailabilityDTO {
  @Field(() => [FlockAvailabilityIntervalGraphQLModel], { nullable: false })
  availabilities!: FlockAvailabilityIntervalDTO[];
}
