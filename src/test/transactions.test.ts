import { expect, it, beforeAll, afterAll, describe, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../app'
import { execSync } from 'node:child_process'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex -- migrate:rollback --all')
    execSync('npm run knex -- migrate:latest')
  })

  it('user can create new transaction', async () => {
    const res = await request(app.server)
      .post('/transactions')
      .send({ amount: 100, title: 'test', type: 'credit' })

    expect(res.status).toBe(201)
  })
  it('should be able to list all transactions', async () => {
    const mockData = { amount: 100, title: 'test', type: 'credit' }
    const res = await request(app.server).post('/transactions').send(mockData)

    const cookie = res.get('Set-Cookie')

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookie)

    expect(listTransactionsResponse.status).toBe(200)
    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({ amount: 100, title: 'test' }),
    ])
  })

  it('should be able to specifiction transactions', async () => {
    const mockData = { amount: 100, title: 'test', type: 'credit' }
    const res = await request(app.server).post('/transactions').send(mockData)

    const cookie = res.get('Set-Cookie')

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookie)

    const specificationTransactionId =
      listTransactionsResponse.body.transactions[0].id

    const specificationTransactionResponse = await request(app.server)
      .get(`/transactions/${specificationTransactionId}`)
      .set('Cookie', cookie)

    expect(specificationTransactionResponse.status).toBe(200)
    expect(specificationTransactionResponse.body.transactions).toEqual(
      expect.objectContaining({ amount: 100, title: 'test' }),
    )
  })

  it('should be able to specifiction transactions', async () => {
    const mockData = { amount: 5000, title: 'test', type: 'credit' }
    const res = await request(app.server).post('/transactions').send(mockData)
    const cookie = res.get('Set-Cookie')
    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookie)
      .send(Object.assign(mockData, { type: 'debit', amount: 1000 }))

    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookie)
    expect(summaryResponse.status).toBe(200)
    expect(summaryResponse.body.summary).toEqual({
      amount: 4000,
    })
  })
})
