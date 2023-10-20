require('dotenv').config()

/*tracing.js*/
const opentelemetry = require('@opentelemetry/sdk-node');
const {
  getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');
const {
  OTLPTraceExporter,
} = require('@opentelemetry/exporter-trace-otlp-http');
const {
  OTLPMetricExporter,
} = require('@opentelemetry/exporter-metrics-otlp-http');
const {
  OTLPLogExporter
} = require('@opentelemetry/exporter-logs-otlp-http');
const { PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');
const { Resource } = require('@opentelemetry/resources');
const {
  SemanticResourceAttributes,
} = require('@opentelemetry/semantic-conventions');
const { WinstonInstrumentation } = require('@opentelemetry/instrumentation-winston');
const {
  LoggerProvider,
  BatchLogRecordProcessor,
  ConsoleLogRecordExporter,
  SimpleLogRecordProcessor,
} = require('@opentelemetry/sdk-logs');

const resource = new Resource({
  [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.1',
  [SemanticResourceAttributes.SERVICE_NAME]: process.env.OTEL_SERVICE_NAME,
});

const logExporter = new OTLPLogExporter({
  url: `${process.env.OTEL_EXPORTER_ENDPOINT}/v1/logs`,
  headers: {
    Authorization: process.env.PRIVATE_KEY,
  }
});

const traceExporter = new OTLPTraceExporter({
  url: `${process.env.OTEL_EXPORTER_ENDPOINT}/v1/traces`,
  headers: {
    Authorization: process.env.PRIVATE_KEY,
  }
});

const metricExporter = new OTLPMetricExporter({
  url: `${process.env.OTEL_EXPORTER_ENDPOINT}/v1/metrics`,
  headers: {
    Authorization: process.env.PRIVATE_KEY,
  }
});

const loggerProvider = new LoggerProvider({
  resource
});

loggerProvider.addLogRecordProcessor(
  new BatchLogRecordProcessor(logExporter)
);

loggerProvider.addLogRecordProcessor(
  new SimpleLogRecordProcessor(new ConsoleLogRecordExporter())
);

const sdk = new opentelemetry.NodeSDK({
  traceExporter,
  metricReader: new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 5000,
  }),
  instrumentations: [
    getNodeAutoInstrumentations(),
    new WinstonInstrumentation({
      // Optional hook to insert additional context to log metadata.
      // Called after trace context is injected to metadata.
      logHook: (span, record) => {
        record['resource.service.name'] = span.resource.attributes[SemanticResourceAttributes.SERVICE_NAME];
      },
    }),
  ],
  resource,
});
sdk.start();

exports.loggerProvider = loggerProvider;