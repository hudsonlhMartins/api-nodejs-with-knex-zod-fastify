import { config } from 'dotenv'

import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else {
  config()
}

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  DATABASE_CLIENT: z.enum(['pg', 'sqlite']).default('pg'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  DATABASE_URL: z.string(),
})

export const env = envSchema.parse(process.env)
