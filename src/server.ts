import fastify from 'fastify'
import { knex } from './database'
import { env } from './env'

const app = fastify()

app.get('/', async (request, reply) => {
  const tables = await knex('sqlite_schema').select('*')
  return tables
})

app.listen(env.PORT).then(() => {
  console.log('App is running on port 3333')
})