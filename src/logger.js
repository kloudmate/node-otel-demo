const winston = require('winston');

// TODO Implement custom transport using opentelemetry loggerProvider to send logs to otel backend
const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
});

module.exports = logger;