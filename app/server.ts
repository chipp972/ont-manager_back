import * as express from 'express'
import {getServerConfig} from 'app/config'

async function startServer(): Promise<void> {
  try {
    let config = await getServerConfig('api')
    let app = express()

    app.get('/', (request, response) => {
      response.send('Hello World!')
    })

    app.get('/ont', (request, response) => {
      response.send('nono')
    })

    app.get('/ont/:id', (request, response) => {
      response.send('haha' + request.params.id)
    })

    app.listen(config.port, config.host, () => {
      console.log(`App listening on http://${config.host}:${config.port}`)
    })
  } catch (err) {
    throw err
  }
}

startServer()
