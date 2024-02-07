import fastify from 'fastify'

import { transactionsRouter } from './routes/transactions'
import cookie from '@fastify/cookie'
const app = fastify()

app.register(cookie)
app.register(transactionsRouter, {
  prefix: '/transactions',
})

export { app }
