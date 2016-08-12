import {Logger, LoggerInstance, transports} from 'winston'

export function getLogger (file: string): LoggerInstance {
  let logger = new Logger({
    exitOnError: false,
    transports: [
      new transports.Console({
        colorize: true,
        handleExceptions: true,
        json: false,
        level: 'error'
      })
    ]
  })

  // second logger for all logs on files daily rotated
  logger.add(require('winston-daily-rotate-file'), {
    colorize: true,
    filename: file,
    handleExceptions: true,
    json: false,
    level: 'silly',
    maxFiles: 10,
    maxsize: 100000000,
    prepend: true
  })

  // stream to pipe with morgan
  // logger.stream = {
  //   write: (message, encoding) => {
  //     logger.info(message)
  //   }
  // }
  return logger
}
