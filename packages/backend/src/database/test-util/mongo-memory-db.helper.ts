import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoDB: MongoMemoryServer;

export const rootMongooseTestModule = (options: MongooseModuleOptions = {}) =>
  MongooseModule.forRootAsync({
    useFactory: async () => {
      mongoDB = await MongoMemoryServer.create();
      const mongoDBUri = mongoDB.getUri();
      return {
        uri: mongoDBUri,
        ...options,
      };
    },
  });

export const closeMongoDBConnection = async () => {
  if (mongoDB) await mongoDB.stop();
};
