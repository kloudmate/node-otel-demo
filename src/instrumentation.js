require('dotenv').config()
const opentelemetry = require('@opentelemetry/api')
const {
  MeterProvider,
  PeriodicExportingMetricReader,
} = require('@opentelemetry/sdk-metrics')
const {
  OTLPMetricExporter,
} = require('@opentelemetry/exporter-metrics-otlp-http')
const { Resource } = require('@opentelemetry/resources')
const {
  SemanticResourceAttributes,
} = require('@opentelemetry/semantic-conventions')

const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node')
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base')
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http')

const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http')
const {
  LoggerProvider,
  SimpleLogRecordProcessor,
} = require('@opentelemetry/sdk-logs')

const COLLECTOR_OPTIONS = (type) => ({
  url: `https://otel.kloudmate.com:4318/v1/${type}`,
  headers: {
    Authorization: process.env.PRIVATE_KEY,
  },
})

const resource = Resource.default().merge(
  new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'test-service',
    [SemanticResourceAttributes.SERVICE_VERSION]: '0.1.0',
  })
)

// ---------------------------Metrics--------------------
const metricReader = new PeriodicExportingMetricReader({
  exporter: new OTLPMetricExporter({
    ...COLLECTOR_OPTIONS('metrics'),
    temporalityPreference: 1,
  }),
  exportIntervalMillis: 1000,
})

const myServiceMeterProvider = new MeterProvider({
  resource: resource,
})

myServiceMeterProvider.addMetricReader(metricReader)
opentelemetry.metrics.setGlobalMeterProvider(myServiceMeterProvider)

// --------------------------------Tracing--------------------
const provider = new NodeTracerProvider({
  resource: resource,
})
const exporter = new OTLPTraceExporter(COLLECTOR_OPTIONS('traces'))
const processor = new SimpleSpanProcessor(exporter)
provider.addSpanProcessor(processor)

provider.register()

// -----------------------------------Logging--------------------------
const loggerProvider = new LoggerProvider({
  resource: resource,
})
const logExporter = new OTLPLogExporter(COLLECTOR_OPTIONS('logs'))
const logProcessor = new SimpleLogRecordProcessor(logExporter)
loggerProvider.addLogRecordProcessor(logProcessor)
exports.loggerProvider = loggerProvider

