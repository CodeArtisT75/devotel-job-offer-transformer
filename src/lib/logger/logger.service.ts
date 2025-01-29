import { Injectable } from '@nestjs/common';
import * as path from 'node:path';
import * as process from 'node:process';
import * as winston from 'winston';

@Injectable()
export class LoggerService {
  private logger: winston.Logger;

  constructor() {
    const logFile = path.join(process.cwd(), 'logs', 'app.log');

    const transports: winston.transport[] = [
      new winston.transports.File({
        filename: logFile,
      }),
    ];

    this.logger = winston.createLogger({
      format: winston.format.json(),
      transports,
    });
  }

  info(msg: string, ...meta: unknown[]) {
    this.logger.info(msg, ...meta);
  }

  error(msg: string, ...meta: unknown[]) {
    this.logger.error(msg, ...meta);
  }
}
