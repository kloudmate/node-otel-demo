import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from "@opentelemetry/semantic-conventions";
import { SimpleLogRecordProcessor } from "@opentelemetry/sdk-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'node-backend',
    [ATTR_SERVICE_VERSION]: '1.0',
  }),
  traceExporter: new OTLPTraceExporter({
    url: `https://otel.kloudmate.com:4318/v1/traces`,
    headers: {
      Authorization: "Your_API_Key",
    },
  }),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: `https://otel.kloudmate.com:4318/v1/metrics`,
      headers: {
        Authorization: "Your_API_Key",
      },
    }),
  }),
  logRecordProcessors: [new SimpleLogRecordProcessor(new OTLPLogExporter({
    url: `https://otel.kloudmate.com:4318/v1/logs`,
    headers: {
      Authorization: "Your_API_Key",
    },
  }))],
  instrumentations: [
    getNodeAutoInstrumentations(),
  ],
});

sdk.start();
