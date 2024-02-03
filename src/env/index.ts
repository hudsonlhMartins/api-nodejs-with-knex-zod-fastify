import 'dotenv/config'

import { z } from 'zod'

const envSchema = z.object({
  PORT: z.string().default('3333'),
  NODE_ENV: z
    .enum(['development', 'production', 'tesr'])
    .default('development'),
  DATABASE_URL: z.string(),
})

export const env = envSchema.parse(process.env)
