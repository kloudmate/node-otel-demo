const express = require('express')
const { loggerProvider } = require('./instrumentation')
const { SeverityNumber } = require('@opentelemetry/api-logs')
const { metrics, trace } = require('@opentelemetry/api')

const app = express()
const PORT = process.env.PORT || 7000

app.use(express.json())

app.get('/', (req, res) => {
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
    loggerProvider.getLogger().emit({ body: 'This is a log', attributes })
    res.status(200).json({ msg: 'success' })
    span.end()
  } catch (error) {
    let errMsg = `${error.message} ${error.stack}`
    span.recordException(error)
    span.setStatus({
      code: 2,
    })
    loggerProvider.getLogger().emit({
      body: errMsg,
      attributes,
      severityNumber: SeverityNumber.ERROR,
    })
    res.status(500).json({ msg: 'error' })
  }
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})

