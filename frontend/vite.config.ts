import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    define: {
      'process.env': {
        OTEL_PROPAGATORS: JSON.stringify(env.VITE_OTEL_PROPAGATORS || 'tracecontext,baggage'),
      }
    }
  };
});