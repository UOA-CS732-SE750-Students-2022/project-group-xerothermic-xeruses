import fs from 'fs';
import http from 'http';
import https from 'https';
import { NestApplicationOptions } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import Graceful from 'node-graceful';
import { ExpressConfig } from '~/config/expressConfig.schema';
import { LoggerService } from '~/logger/service';
import { AppModule } from './app.module';

const log = new LoggerService('Main');

process.on('uncaughtException', (err) => log.error('uncaughtException', err));
process.on('unhandledRejection', (err) => log.error('unhandledRejection', err));
Graceful.on('exit', (signal, details) => log.info('Exiting.', { signal, details }));

(async () => {
  const appOpts: NestApplicationOptions = {
    logger: log,
  };

  // Create the app.
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), appOpts);
  await app.init();

  // Always stop the server when we exit.
  Graceful.on('exit', async () => {
    await app.close();
    log.info('Closed the app.');
  });

  const config = app.get<ConfigService<ExpressConfig, true>>(ConfigService);

  if (config.get('PORT') != null) {
    // Listen on specified HTTP port.
    http.createServer(server).listen(config.get('PORT'));
    log.info('HTTP listening on port', config.get('PORT'));
  }

  if (config.get('SSL_PORT') != null) {
    // Listen on specified HTTPS port.
    const key = fs.readFileSync(config.get('SSL_KEY_FILE'), 'utf8');
    const cert = fs.readFileSync(config.get('SSL_CERT_FILE'), 'utf8');
    https.createServer({ key, cert }, server).listen(config.get('SSL_PORT'));
    log.info('HTTPS listening on port', config.get('SSL_PORT'));
  }
})();
