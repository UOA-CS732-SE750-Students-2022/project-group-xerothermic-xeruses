import env from './env';
import { getLogger } from './logger';

const log = getLogger('index');
log.debug('env', Object.entries(env));
