import winston from 'winston';
import { OpenTelemetryTransportV3 } from '@opentelemetry/winston-transport';

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new OpenTelemetryTransportV3()
  ],
});

export { logger };
