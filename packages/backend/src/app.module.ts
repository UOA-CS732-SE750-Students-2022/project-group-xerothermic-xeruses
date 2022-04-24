import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { PassportModule } from '@nestjs/passport';
import { ExpressConfigModule } from '~/config/expressConfig.module';
import { FirebaseConfigModule } from '~/config/firebaseConfig.module';
import { FlockGraphQLModule } from '~/graphql/flock/flock.module';
import { UserGraphQLModule } from '~/graphql/user/user.module';
import { LoggerModule } from '~/logger/module';
import { FirebaseModule } from './firebase/firebase.module';

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
    FlockGraphQLModule,
    UserGraphQLModule,
    FirebaseModule,
  ],
})
export class AppModule {}
