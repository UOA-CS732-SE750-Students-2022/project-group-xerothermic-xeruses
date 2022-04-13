import { Module } from '@nestjs/common';
import { UserDatabaseModule } from '~/database/user/user.module';
import { UtilModule } from '~/util/util.module';
import { UserResolver } from './user.resolver';

@Module({
  imports: [UserDatabaseModule, UtilModule],
  providers: [UserResolver],
})
export class UserGraphqlModule {}
