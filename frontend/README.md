# TODO Frontend

## 🌐 Instrument Frontend Application

### Step 1: Create Frontend Instrumentation

Create `instrumentation.ts` inside frontend folder with the following configuration:

```typescript
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
```

**Important:** Replace `YOUR_PUBLIC_KEY` with your actual Kloudmate public key.

### Step 2: Add this script in index.html inside body tag
```bash
<script type="module" src="./instrumentation.ts"></script>
```

### Step 3: Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Step 4: Configure Frontend Environment

```bash
cp .env.example .env
```

Edit the `.env` file with your frontend-specific configuration.

### Step 5: Start Frontend Development Server

```bash
npm run dev
```

## 📦 Required Dependencies

### Frontend Dependencies
```bash
npm install @opentelemetry/sdk-trace-web @opentelemetry/exporter-trace-otlp-http @opentelemetry/instrumentation @opentelemetry/auto-instrumentations-web @opentelemetry/context-zone @opentelemetry/resources @opentelemetry/auto-configuration-propagators
```

