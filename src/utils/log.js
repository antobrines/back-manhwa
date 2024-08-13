const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const myFormat = winston.format.printf(
  ({ level, message, timestamp, body }) => {
    const date = new Date(timestamp);
    const formattedDate = `${date.getDate()}-${
      date.getMonth() + 1
    }-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    let logMessage = `${formattedDate} ${level}: ${message}`;

    if (body) {
      logMessage += ` ${JSON.stringify(body)}`;
    }

    return logMessage;
  }
);

const createTransports = (folderName) => {
  const transports = [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ];
  if (folderName) {
    transports.push(
      new DailyRotateFile({
        filename: `logs/${folderName}/%DATE%.log`,
        datePattern: 'DD-MM-YYYY',
        zippedArchive: true,
        format: winston.format.combine(winston.format.timestamp(), myFormat),
      })
    );
  }

  return transports;
};

const createLogger = (logPath) => {
  const logger = winston.createLogger({
    transports: createTransports(logPath),
  });

  return logger;
};

module.exports = { createLogger };
