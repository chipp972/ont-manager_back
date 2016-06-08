import * as Sequelize from 'sequelize'
import {getDatabaseConfig} from 'app/config'

async function getOntList (): Promise<void> {
  let config = await getDatabaseConfig('ont_db')
  let uri = `${config.type}:${config.user}:${config.password}
             @${config.host}:${config.port}/${config.database}`
  let sequelize = new Sequelize(uri)

  let Ont = sequelize.define('ont', {
    fsan: { field: 'fsan', type: Sequelize.STRING },
    model: { field: 'model', type: Sequelize.STRING },
    serial: { field: 'serial', type: Sequelize.STRING },
    state: { field: 'state', type: Sequelize.STRING }
  })
}

getOntList()
