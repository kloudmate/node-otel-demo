import { SimpleSpanProcessor, WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { W3CTraceContextPropagator } from "@opentelemetry/core";
import api from "@opentelemetry/api";
const provider = new WebTracerProvider({
  spanProcessors: [new SimpleSpanProcessor(new OTLPTraceExporter({
    url: 'https://otel.kloudmate.com:4318/v1/traces',
    headers: {
      authorization: "sk_Zt1rsTxryhipgPMkB2SCldrF"
    }
  }))],
  resource: resourceFromAttributes({
    'service.name': 'TODO-Frontend',
    'service.version': '1.0',
  }),
})
api.propagation.setGlobalPropagator(new W3CTraceContextPropagator());
provider.register({
  contextManager: new ZoneContextManager(),
});

// Auto-instrumentations
registerInstrumentations({
  instrumentations: [
    getWebAutoInstrumentations({
      '@opentelemetry/instrumentation-fetch': {
        propagateTraceHeaderCorsUrls: [/^http:\/\/localhost:3000\/.*$/],
      },
      '@opentelemetry/instrumentation-xml-http-request': {
        propagateTraceHeaderCorsUrls: [/^http:\/\/localhost:3000\/.*$/],
      },
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