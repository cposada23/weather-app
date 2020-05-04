const debug = require('debug')('app:coodinates')
const request = require('postman-request')
const chalk = require('chalk')
const util = require('util')

// Para el llamado sin librerias de npm solo con el core de node js
const https = require('https')

const limit = 1

function getCoordinates (place, callback) {
  const MAP_BOX_API = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURI(place)}.json?access_token=${process.env.MAP_BOX_TOKEN}&limit=${limit}`
  debug(`MAPBOX url = ${chalk.blue(MAP_BOX_API)}`)
  request({ url: MAP_BOX_API, json: true }, (error, response) => {
    if (error) {
      return callback(error, null)
    } else if (response.body.message) {
      return callback(response.body.message, null)
    } else {
      const data = response.body
      if (!data.features.length > 0) {
        const error = 'Could not find location, pleas enter a valid address'
        return callback(error, null)
      } else {
        const location = data.features[0].place_name
        const [longitud, latitud] = data.features[0].center
        return callback(null, { latitud, longitud, location })
      }
    }
  })
}

function getCoordinatesHttps (place, callback) {
  const MAP_BOX_API = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURI(place)}.json?access_token=${process.env.MAP_BOX_TOKfEN}&limit=${limit}`
  debug(`MAP_BOX_API: ${MAP_BOX_API}`)
  const request = https.request(MAP_BOX_API, (response) => {
    let data = ''
    response.on('data', (chunk) => {
      data = data + chunk.toString()
      debug('Chunk')
      debug(chunk)
    })

    response.on('end', () => {
      const body = JSON.parse(data)
      debug('body en coordinates', body)
      if (body.message) {
        callback(body.message, undefined)
      } else {
        callback(undefined, body)
      }
    })
  })

  request.on('error', (error) => {
    callback(error, undefined)
  })

  request.end()
}

module.exports = {
  getCoordinates,
  getCoordinatesPromise: util.promisify(getCoordinates),
  getCoordinatesHttps
}
