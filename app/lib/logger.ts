import {Logger, LoggerInstance, transports} from 'winston'

export function getLogger (file: string): LoggerInstance {
  return new Logger({
    exitOnError: false,
    transports: [
      new transports.File({
        colorize: true,
        filename: file,
        handleExceptions: true,
        json: false,
        level: 'silly',
        maxFiles: 5,
        maxsize: 5242880
      }),
      new transports.Console({
        colorize: true,
        handleExceptions: true,
        json: false,
        level: 'error'
      })
    ]
  })
}
