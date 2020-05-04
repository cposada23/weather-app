const debug = require('debug')('app')
const express = require('express')
const chalk = require('chalk')
const path = require('path')
const hbs = require('hbs')
const getCoordinatesPromise = require('./src/modules/coordinades').getCoordinatesPromise
const getTemperaturePromise = require('./src/modules/temperature').getTemperaturePromise

require('dotenv').config()

const app = express()

const port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, '/public')))
app.set('views', './src/views')
app.set('view engine', 'hbs')
hbs.registerPartials(path.join(__dirname, '/src/views/partials'))

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Weather',
    creator: 'Camilo Posada'
  })
})

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help',
    creator: 'Camilo Posada'
  })
})

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About',
    creator: 'Camilo Posada'
  })
})

app.get('/weather', (req, res) => {
  (async () => {
    const { address } = req.query

    if (!address) {
      return res.status(400).send({ error: 'You must provide an address' })
    }

    try {
      const coordinates = await getCoordinatesPromise(address)
      debug(`coodinates for location ${address}`)
      debug(coordinates)
      const temperature = await getTemperaturePromise(coordinates)
      // return res.status(200).send(`The temperature for the location: ${location} is ${temperature}`)
      return res.status(200).send({ address, temperature, location: coordinates.location })
    } catch (error) {
      debug('An error ocurred')
      return res.status(404).send({ error })
    }
  })()
})

app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    creator: 'Camilo Posada'
  })
})

app.listen(port, () => { debug(`app listenting on port ${chalk.greenBright(port)}`) })
