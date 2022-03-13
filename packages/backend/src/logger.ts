import chalk, { Chalk } from 'chalk';
import { createLogger, format, transports } from 'winston';
import { TransformableInfo } from 'logform';
import { inspect } from 'node:util';
import jsonStringify_ from 'fast-safe-stringify';
import 'winston-daily-rotate-file';

const logLevels = ['debug', 'verbose', 'info', 'warn', 'error'];

type LogLevel = 'debug' | 'verbose' | 'info' | 'warn' | 'error';

const colors: { [K in LogLevel]: Chalk } = {
  error: chalk.bold.redBright,
  warn: chalk.bold.yellowBright,
  info: chalk.bold.greenBright,
  verbose: chalk.bold.cyanBright,
  debug: chalk.bold.whiteBright,
};

const isPrimitive = (val: any) => val === null || (typeof val !== 'object' && typeof val !== 'function');

const formatWithInspect = (val: any): string => {
  if (typeof val === 'string') {
    return val;
  }
  const newLine = isPrimitive(val) ? '' : '\n';
  return newLine + inspect(val, { depth: null, colors: true });
};

export const colorize = (color: string, s: string): string => {
  if (!color) {
    return s;
  }
  // Chalk is designed to be indexed by a string
  const bold = chalk.bold as unknown as Record<string, (s: string) => string>;
  if (typeof bold[color] !== 'function') {
    throw new Error(`Invalid console text color: '${color}'`);
  }
  return bold[color](s);
};

const jsonStringifyErrors = (_key: string, value: any) => {
  if (value instanceof Error) {
    const { name, message, stack } = value;
    return { name, message, stack };
  }
  return value;
};

const jsonStringify = (obj: any) => jsonStringify_(obj, jsonStringifyErrors);

const MESSAGES = Symbol('MESSAGES');

const extractInfo = (info: TransformableInfo) => {
  const moreMessages: any[] = info[MESSAGES as any] || [];

  return {
    label: info.label as string,
    level: info.level as LogLevel,
    timestamp: info.timestamp as string,
    messages: [info.message, ...moreMessages],
  };
};

const log = createLogger({
  transports: [
    new transports.DailyRotateFile({
      level: 'info',
      filename: '%DATE%.log',
      maxFiles: '14d',
      format: format.combine(
        format.timestamp(),
        format.printf((info) => jsonStringify(extractInfo(info))),
      ),
    }),
    new transports.Console({
      level: 'debug',
      format: format.combine(
        format.timestamp({ format: 'MMM DD, HH:mm:ss' }),
        format.printf((info) => {
          const { label, level, timestamp, messages } = extractInfo(info);
          const coloredLabelLevel = colors[level](`${label}:${level}`);
          const formattedMessages = messages.map(formatWithInspect).join(' ');
          return `${timestamp}  ${coloredLabelLevel}  ${formattedMessages}`;
        }),
      ),
    }),
  ],
});

const getLoggerLevel =
  (label: string, level: string) =>
  (message: string, ...more: any[]) => {
    log.log(level, message, { label, [MESSAGES]: more });
  };

export const getLogger = (label: string) =>
  Object.freeze(Object.fromEntries(logLevels.map((lvl) => [lvl, getLoggerLevel(label, lvl)])));
