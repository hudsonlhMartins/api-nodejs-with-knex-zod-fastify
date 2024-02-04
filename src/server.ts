import fastify from 'fastify'
import { env } from './env'
import { transactionsRouter } from './routes/transactions'

const app = fastify()

app.register(transactionsRouter, {
  prefix: '/transactions',
})

app.listen(env.PORT).then(() => {
  console.log('App is running on port 3333')
})
