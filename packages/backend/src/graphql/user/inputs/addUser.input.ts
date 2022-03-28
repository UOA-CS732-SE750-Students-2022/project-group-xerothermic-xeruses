import { InputType, Field, ID } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { UserAvailabilityInput } from './common/userAvailability.input';
import { UserSettingsInput } from './common/userSettings.input';
import { User } from '~/database/user/user.schema';
import { UserAvailability } from '~/database/user/userAvailability.schema';
import { UserSettings } from '~/database/user/userSettings.schema';

@InputType()
export class AddUserInput implements User {
  @Field()
  name!: string;

  @Field(() => [ID], { nullable: true })
  flocks!: Types.ObjectId[];

  @Field(() => [ID], { nullable: true })
  flockInvites!: Types.ObjectId[];

  @Field(() => [UserAvailabilityInput], { nullable: true })
  availability!: UserAvailability[];

  @Field(() => UserSettingsInput, { nullable: true })
  settings: UserSettings | undefined;
}
