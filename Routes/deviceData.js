
const mydb = require('../Config/DBconnection'); // Database connection
const { fetchWeatherData } = require('./weather'); // Weather API handler
const { predictError } = require('./erorrDetect'); // Error prediction logic
const { populateDataForDevices } = require('./populateDeviceData')

const { setupWebSocket } = require('./socketServer');
let io;

function setSocketInstance(socketInstance) {
    io = socketInstance;
    console.log('WebSocket instance set.');
    if (io) {
        io.emit('serverReady', 'WebSocket server is ready');
    }

}

//store random data in the table 
//populateDataForDevices()

//  fetch device data from MySQL
async function fetchDeviceData() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM devices WHERE isActive = 0'; // Query for active devices
    mydb.query(query, (error, results) => {
      if (error) {
        return reject(error); // Handle query errors
      }
      resolve(results); // Return the results as an array of rows
     // console.log(results)
    });
  });
}

//  poll data periodically
async function pollData() {
  setInterval(async () => {
    try {
      console.log('Polling data...');
      const deviceData = await fetchDeviceData(); // Fetch device data from MySQL
      
      //console.log(deviceData)

       for (const device of deviceData) {
        const city = device.timezone.split('/')[1]; // get the city from timezone

        const weatherData = await fetchWeatherData(city).catch(err => {
          console.error(`Failed to fetch weather data for ${city}:`, err);
          return null;
      });
      
      if (!weatherData) continue;

        // console.log("weather at"+device.timezone+"="+weatherData)

         const prediction = await predictError(device, weatherData); // Predict device error based on data

         //console.log(`Prediction for Device ${device.deviceId}:`, prediction);

         if ( prediction.length > 0) {
          console.log(`Device ${device.deviceId}:`, prediction); // Log the prediction

            if (io) {
              console.log('Emitted errorDetected:', `Prediction for Device ${device.deviceId}:`, prediction );
            io.emit('errorDetected', 
              {message: `Device ${device.deviceId}: ${prediction}` },
            );
            io.emit('errorDetected', {message: `Device ${device.deviceId}:`, prediction});
           
            }
            else {console.warn('Socket instance not available.');}
        
          }}
          
    } catch (error) {
      console.error('Error during polling:', error); // Handle errors during polling
    }
  },10000 ); // Poll every 5 minutes = 300000
}

// Export the functions for reuse in other parts of the application
module.exports = {
  fetchDeviceData,
  pollData,
  setSocketInstance
};
