import { FlockDayDTO } from '@flocker/api-types';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FlockDayGraphQLModel implements FlockDayDTO {
  @Field({ nullable: false })
  start!: string;

  @Field({ nullable: false })
  end!: string;
}
