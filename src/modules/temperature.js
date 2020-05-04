const request = require('postman-request')
const chalk = require('chalk')
const debug = require('debug')('app:temperature')
const util = require('util')

function getTemperature ({ latitud, longitud }, callback) {
  const location = [latitud, longitud].join(',')
  const BASE_URL = `http://api.weatherstack.com//current?access_key=${process.env.API_KEY}&query=${location}`
  debug(`${chalk.blue(BASE_URL)}`)

  request({ url: BASE_URL, json: true }, (error, response) => {
    if (error) return callback(error, null)
    else if (response.body.error) {
      return callback(response.body.error, null)
    } else {
      const data = response.body.current
      return callback(null, data.temperature)
    }
  })
}

module.exports = {
  getTemperature,
  getTemperaturePromise: util.promisify(getTemperature)
}
