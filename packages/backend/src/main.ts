import fs from 'fs';
import { NestApplicationOptions } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import Graceful from 'node-graceful';
import { AppModule } from '~/app.module';
import env from '~/env';
import { LoggerService } from '~/logger/service';

const log = new LoggerService('Main');

process.on('uncaughtException', (err) => log.error('uncaughtException', err));
process.on('unhandledRejection', (err) => log.error('unhandledRejection', err));
Graceful.on('exit', (signal, details) => log.info('Exiting.', { signal, details }));

(async () => {
  const appOpts: NestApplicationOptions = {
    logger: log,
  };

  // Use SSL if enabled.
  if (env.USE_SSL) {
    const key = fs.readFileSync(env.SSL_KEY_FILE, 'utf8');
    const cert = fs.readFileSync(env.SSL_CERT_FILE, 'utf8');
    appOpts.httpsOptions = { key, cert };
  }

  // Create the app.
  const app = await NestFactory.create(AppModule, appOpts);

  // Always stop the server when we exit.
  Graceful.on('exit', async () => {
    await app.close();
    log.info('Closed the app.');
  });

  // Listen on specified port.
  await app.listen(env.PORT);
  log.info('Example app listening on port', env.PORT);
})();
