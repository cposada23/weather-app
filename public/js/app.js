console.log('works')

function getWeather (location) {
  return fetch('http://localhost:4000/weather?address=' + encodeURI(location))
}

const weatherForm = document.querySelector('#weather-form')
const addressInput = document.querySelector('#weather-search-input')
const loading = document.querySelector('#loading')
const address = document.querySelector('#address')
const temperature = document.querySelector('#temperature')
const locationResult = document.querySelector('#location')
const errorResults = document.querySelector('#error-results')

weatherForm.addEventListener('submit', (event) => {
  event.preventDefault()
  const location = addressInput.value
  console.log('Location: ', location)
  loading.textContent = 'Loading weather info for: ' + location + '....'
  address.textContent = ''
  temperature.textContent = ''
  locationResult.textContent = ''
  errorResults.textContent = ''
  getWeather(location).then((response) => {
    response.json().then((data) => {
      loading.textContent = ''
      if (data.error) {
        errorResults.textContent = data.error
        console.error(data.error)
      } else {
        address.textContent = 'Addres: ' + data.address
        temperature.textContent = 'Temperature: ' + data.temperature
        locationResult.textContent = 'Location ' + data.location
        console.log(data)
      }
    }).catch((error) => {
      loading.textContent = ''
      errorResults.textContent = error
      console.log(error)
    })
  })
})
