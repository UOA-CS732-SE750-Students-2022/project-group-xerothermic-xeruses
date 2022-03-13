import fs from 'node:fs';
import http from 'node:http';
import https from 'node:https';
import express from 'express';
import env from './env';
import { getLogger } from './logger';
import Graceful from 'node-graceful';

const log = getLogger('index');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Create HTTP/S server.
let server: http.Server | https.Server;
if (env.USE_SSL) {
  const privateKey = fs.readFileSync(env.SSL_KEY_FILE, 'utf8');
  const certificate = fs.readFileSync(env.SSL_CERT_FILE, 'utf8');
  server = https.createServer({ key: privateKey, cert: certificate }, app);
} else {
  server = http.createServer(app);
}

// Listen on specified port.
server.listen(env.PORT, () => {
  log.info('Example app listening on port', env.PORT);
});

// Always stop the server when we exit.
Graceful.on('exit', () => {
  if (server.listening) {
    server.close();
  }
});
