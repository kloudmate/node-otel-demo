const express = require('express')
const { metrics, trace } = require('@opentelemetry/api');
const { SeverityNumber } = require('@opentelemetry/api-logs');
const {  loggerProvider } = require('./instrumentation');

const logger = loggerProvider.getLogger('order-service', '1.0.0');
const app = express()
const PORT = process.env.PORT || 7000

app.use(express.json())

app.get('/', (req, res) => {
  logger.emit({
    severityNumber: SeverityNumber.INFO,
    severityText: 'info',
    body: 'this is a log body',
    attributes: { 'log.type': 'custom', success: true },
  });
  const tracer = trace.getTracer('tracer')
  const span = tracer.startSpan('order-span')
  const attributes = {}
  try {
    if (req.query.error === '1') {
      const shouldThrowError = parseInt(Math.random() * 4) === 1
      if (shouldThrowError) {
        throw new Error('Unhandled exception')
      }
    }
    const meter = metrics.getMeter('meter')
    const orderCounter = meter.createCounter('order.count', {
      description: 'Number of orders',
    })
    orderCounter.add(1, attributes)
    span.setAttributes(attributes)

    res.status(200).json({ msg: 'success' })
    span.end()
  } catch (error) {
    let errMsg = `${error.message} ${error.stack}`
    span.recordException(error)
    span.setStatus({
      code: 2,
    })
    logger.emit('Some error', {
      severityNumber: SeverityNumber.ERROR,
      severityText: 'error',
      body: errMsg,
    });
    res.status(500).json({ msg: 'error' })
  }
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})

