import fs from 'fs';
import path from 'path';
import pino from 'pino';

const isDev = process.env.NODE_ENV !== 'production';

const logsDir = path.resolve('logs');

fs.mkdirSync(logsDir, { recursive: true });

export const pinoLogger = pino({
  level: process.env.LOG_LEVEL ?? (isDev ? 'debug' : 'info'),

  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'body.password',
      'body.token',
      'body.accessToken',
      'body.refreshToken',
    ],
    censor: '[HIDDEN]',
  },

  transport: {
    targets: [
      {
        target: isDev ? 'pino/file' : 'pino-roll',

        options: isDev
          ? {
            destination: path.join(logsDir, 'app.log'),
            mkdir: true,
          }
          : {
            file: path.join(logsDir, 'app.log'),
            size: '5m',
            limit: {
              count: 10,
            },
            mkdir: true,
          },
      },

      ...(isDev
        ? [
          {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:standard',
              ignore: 'pid,hostname',
            },
          },
        ]
        : []),
    ],
  },
});
