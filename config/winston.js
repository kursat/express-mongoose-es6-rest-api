import winston from 'winston';

const winstonLogger = winston.createLogger({
  transports: [
    new (winston.transports.Console)({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.simple()
      ),
      json: true,
      colorize: true
    })
  ]
});

export default winstonLogger;
