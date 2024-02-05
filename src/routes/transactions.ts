import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { checkSessionId } from '../middlewares/check-session-id'

export const transactionsRouter = async (app: FastifyInstance) => {
  app.post(
    '/',

    async (request, reply) => {
      const createSchemaTransaction = z.object({
        title: z.string(),
        amount: z.number(),
        type: z.enum(['credit', 'debit']),
      })

      const { amount, title, type } = createSchemaTransaction.parse(
        request.body,
      )

      let sessionId = request.cookies.sessionId

      if (!sessionId) {
        sessionId = randomUUID()
        reply.cookie('sessionId', sessionId, {
          path: '/',
          maxAge: 100 * 60 * 60 * 24 * 7, // 1 week
        })
      }

      await knex('transactions').insert({
        id: randomUUID(),
        title,
        amount: type === 'credit' ? amount : amount * -1,
        session_id: sessionId,
      })

      return reply.status(201).send()
    },
  )
  app.get(
    '/',
    {
      preHandler: [checkSessionId],
    },
    async (request) => {
      const { sessionId } = request.cookies

      const transactions = await knex('transactions')
        .select('*')
        .where('session_id', sessionId)

      return { transactions }
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkSessionId],
    },
    async (request) => {
      const getTransactionSchema = z.object({
        id: z.string(),
      })
      const { sessionId } = request.cookies
      const { id } = getTransactionSchema.parse(request.params)
      const transactions = await knex('transactions')
        .where({
          id,
          session_id: sessionId,
        })
        .first()

      return { transactions }
    },
  )
  app.get(
    '/summary',
    {
      preHandler: [checkSessionId],
    },
    async (request) => {
      const { sessionId } = request.cookies

      const summary = await knex('transactions')
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount' })
        .first()

      return { summary }
    },
  )
}
