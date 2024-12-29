
const mydb = require('../Config/DBconnection'); // Database connection
const { fetchWeatherData } = require('./weather'); // Weather API handler
const { predictError } = require('./erorrDetect'); // Error prediction logic

//  fetch device data from MySQL
async function fetchDeviceData() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM devices WHERE isActive = 0'; // Query for active devices
    mydb.query(query, (error, results) => {
      if (error) {
        return reject(error); // Handle query errors
      }
      resolve(results); // Return the results as an array of rows
      console.log(results)
    });
  });
}

//  poll data periodically
async function pollData() {
  setInterval(async () => {
    try {
      const deviceData = await fetchDeviceData(); // Fetch device data from MySQL
      
      console.log(deviceData)

       for (const device of deviceData) {
        const city = device.timezone.split('/')[1]; // get the city from timezone

        const weatherData = await fetchWeatherData(city); // Fetch weather data for the device's location
         console.log("weather at"+device.timezone+"="+weatherData)
         const prediction = predictError(device, weatherData); // Predict device error based on data
        console.log(`Device ${device.deviceId}:`, prediction); // Log the prediction
       }
    } catch (error) {
      console.error('Error during polling:', error); // Handle errors during polling
    }
  },1000 ); // Poll every 5 minutes = 300000
}

// Export the functions for reuse in other parts of the application
module.exports = {
  fetchDeviceData,
  pollData,
};
