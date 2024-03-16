import productionLogger from './productionLogger.js'
import devLogger from './devLogger.js'

function initLogger() {
  return process.env.NODE_ENV === 'production' ? productionLogger() : devLogger()
}

export default initLogger
