import {initServer} from './server'

let mode: string

process.env.NODE_ENV === 'production' ? mode = 'prod' : mode = 'dev'

initServer(mode, mode)
