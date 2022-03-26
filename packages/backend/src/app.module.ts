import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ExpressConfigModule } from '~/config/expressConfig.module';
import { FirebaseConfigModule } from '~/config/firebaseConfig.module';
import { FirebaseAuthStrategy } from '~/firebase/firebase-auth.strategy';
import { LoggerModule } from '~/logger/module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserModule } from './user/user.module';

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
    UserModule,
  ],
  providers: [FirebaseAuthStrategy],
})
export class AppModule {}
