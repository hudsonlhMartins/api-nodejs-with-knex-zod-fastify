import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'

export const transactionsRouter = async (app: FastifyInstance) => {
  app.post('/', async (request, reply) => {
    const createSchemaTransaction = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })
    const { amount, title, type } = createSchemaTransaction.parse(request.body)

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
    })

    return reply.status(201).send()
  })
  app.get('/', async () => {
    const transactions = await knex('transactions').select('*')

    return { transactions }
  })

  app.get('/:id', async (request) => {
    const getTransactionSchema = z.object({
      id: z.string(),
    })

    const { id } = getTransactionSchema.parse(request.params)
    const transactions = await knex('transactions').where('id', id).first()

    return { transactions }
  })
}
