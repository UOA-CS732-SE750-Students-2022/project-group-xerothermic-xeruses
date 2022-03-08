import env from './env.js';
import { getLogger } from './logger.js';

const log = getLogger('index');
log.debug('env', Object.entries(env));
