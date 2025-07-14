import { SimpleSpanProcessor, WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { getPropagator } from "@opentelemetry/auto-configuration-propagators"

const provider = new WebTracerProvider({
  spanProcessors: [new SimpleSpanProcessor(new OTLPTraceExporter({
    url: 'https://otel.kloudmate.com:4318/v1/traces',
    headers: {
      authorization: "YOUR_PUBLIC_KEY"
    }
  }))],
  resource: resourceFromAttributes({
    'service.name': 'TODO-Frontend',
    'service.version': '1.0',
  }),
})

const propagator = getPropagator()
provider.register({
  contextManager: new ZoneContextManager(),
  propagator
});

// Auto-instrumentations
registerInstrumentations({
  instrumentations: [
    getWebAutoInstrumentations({
      '@opentelemetry/instrumentation-user-interaction': {
        enabled: false
      },
      '@opentelemetry/instrumentation-document-load': {
        enabled: false
      },
    }),
  ],
  tracerProvider: provider,
});