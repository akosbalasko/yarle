import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
  level: 'info',
  format: format.simple(),
  transports: [
    //
    // - Write to all logs with level `info` and below to `quick-start-combined.log`.
    // - Write all logs error (and below) to `quick-start-error.log`.
    //
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'conversion.log', options: { flags: 'w' }})
  ]
});
