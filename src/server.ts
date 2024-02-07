import { app } from './app'
import { env } from './env'

app.listen(env.PORT).then(() => {
  console.log('App is running on port 3333')
})
