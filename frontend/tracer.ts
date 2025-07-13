import { SimpleSpanProcessor, WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
import { resourceFromAttributes } from '@opentelemetry/resources';

const provider = new WebTracerProvider({
  spanProcessors: [new SimpleSpanProcessor(new OTLPTraceExporter({
    url: 'https://otel.kloudmate.com:4318/v1/traces',
    headers: {
      authorization: "Your_API_KEY"
    }
  }))],
  resource: resourceFromAttributes({
    'service.name': 'TODO-Frontend',
    'service.version': '1.0',
  }),
})
provider.register({
  contextManager: new ZoneContextManager()
});

// Auto-instrumentations
registerInstrumentations({
  instrumentations: [
    new DocumentLoadInstrumentation(),
    getWebAutoInstrumentations(),
  ],
  tracerProvider: provider,
});