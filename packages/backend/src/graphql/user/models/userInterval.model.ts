import { UserIntervalDTO } from '@flocker/api-types';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserIntervalGraphQLModel implements UserIntervalDTO {
  @Field({ nullable: false })
  id!: string;

  @Field(() => Boolean, { nullable: false })
  available!: boolean;

  @Field(() => Boolean, { nullable: false })
  manual!: boolean;
}
