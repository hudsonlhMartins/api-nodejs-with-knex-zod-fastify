import fastify from 'fastify'
import { env } from './env'
import { transactionsRouter } from './routes/transactions'
import cookie from '@fastify/cookie'
const app = fastify()

app.register(cookie)
app.register(transactionsRouter, {
  prefix: '/transactions',
})

app.listen(env.PORT).then(() => {
  console.log('App is running on port 3333')
})
