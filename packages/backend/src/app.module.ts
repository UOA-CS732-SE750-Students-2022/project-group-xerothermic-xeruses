import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { PassportModule } from '@nestjs/passport';
import { UserGraphqlModule } from '~/graphql/user/user.module';
import { ExpressConfigModule } from '~/config/expressConfig.module';
import { FirebaseConfigModule } from '~/config/firebaseConfig.module';
import { FirebaseAuthStrategy } from '~/firebase/firebase-auth.strategy';
import { LoggerModule } from '~/logger/module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    ExpressConfigModule,
    LoggerModule,
    FirebaseConfigModule,
    PassportModule,
    UserGraphqlModule,
  ],
  providers: [FirebaseAuthStrategy],
})
export class AppModule {}
