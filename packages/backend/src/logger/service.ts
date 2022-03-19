import { inspect } from 'util';
import { Injectable, LoggerService as NestLoggerService, Optional, Scope } from '@nestjs/common';
import chalk, { type Chalk } from 'chalk';
import dayjs, { Dayjs } from 'dayjs';
import fastSafeStringify from 'fast-safe-stringify';
import { type TransformableInfo } from 'logform';
import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

export type LogLevel = 'info' | 'error' | 'warn' | 'debug' | 'verbose';

interface ExtraData {
  moreObjects: any[];
  timestamp: Dayjs;
}

interface LogEntryData {
  context: string;
  level: LogLevel;
  timestamp: Dayjs;
  message: string;
  moreObjects: any[];
}

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements NestLoggerService {
  private static COLORS: { [K in LogLevel]: Chalk } = {
    error: chalk.bold.redBright,
    warn: chalk.bold.yellowBright,
    info: chalk.bold.greenBright,
    verbose: chalk.bold.cyanBright,
    debug: chalk.bold.whiteBright,
  };

  private static EXTRA_DATA = Symbol('EXTRA_DATA');

  private backingLogger = createLogger({
    transports: [
      new transports.DailyRotateFile({
        level: 'info',
        filename: '%DATE%.log',
        maxFiles: '14d',
        format: format.printf((info) => LoggerService.formatForFile(this.extractData(info))),
      }),
      new transports.Console({
        level: 'debug',
        format: format.printf((info) => LoggerService.formatForConsole(this.extractData(info))),
      }),
    ],
  });

  constructor(@Optional() private context = '') {}

  private static isPrimitive(val: any) {
    return val === null || (typeof val !== 'object' && typeof val !== 'function');
  }

  private static formatWithInspect(val: any): string {
    if (typeof val === 'string') {
      return val;
    }
    const newLine = LoggerService.isPrimitive(val) ? '' : '\n';
    return newLine + inspect(val, { depth: null, colors: true });
  }

  private static jsonStringifyErrors(_key: string, value: any) {
    if (value instanceof Error) {
      const { name, message, stack } = value;
      return { name, message, stack };
    }
    return value;
  }

  private static formatForConsole({ context, level, timestamp, message, moreObjects }: LogEntryData): string {
    const timeStr = timestamp.format('MMM DD, HH:mm:ss');
    const coloredContextLevel = LoggerService.COLORS[level](`${context}:${level}`);
    const formattedObjs = moreObjects.map(LoggerService.formatWithInspect).join(' ');
    return [timeStr, coloredContextLevel, message, formattedObjs].join('  ');
  }

  private static formatForFile({ timestamp, ...rest }: LogEntryData): string {
    return fastSafeStringify({ timestamp: timestamp.format(), ...rest }, LoggerService.jsonStringifyErrors);
  }

  private extractData(info: TransformableInfo): LogEntryData {
    const data: ExtraData = info[LoggerService.EXTRA_DATA as any];
    return {
      context: this.context,
      level: info.level as LogLevel,
      timestamp: data.timestamp,
      message: info.message,
      moreObjects: data.moreObjects,
    };
  }

  private baseLog(level: LogLevel, message: string, moreObjects: any[]): void {
    const extraData: ExtraData = {
      moreObjects,
      timestamp: dayjs(),
    };
    this.backingLogger.log(level, message, { [LoggerService.EXTRA_DATA]: extraData });
  }

  public log(message: string, ...moreObjects: any[]): void {
    this.info(message, ...moreObjects);
  }

  public info(message: string, ...moreObjects: any[]): void {
    this.baseLog('info', message, moreObjects);
  }

  public error(message: string, ...moreObjects: any[]): void {
    this.baseLog('error', message, moreObjects);
  }

  public warn(message: string, ...moreObjects: any[]): void {
    this.baseLog('warn', message, moreObjects);
  }

  public debug(message: string, ...moreObjects: any[]): void {
    this.baseLog('debug', message, moreObjects);
  }

  public verbose(message: string, ...moreObjects: any[]): void {
    this.baseLog('verbose', message, moreObjects);
  }

  public setContext(context: string): void {
    this.context = context;
  }

  public setLogLevels(): void {
    throw new Error('Method not implemented.');
  }
}
