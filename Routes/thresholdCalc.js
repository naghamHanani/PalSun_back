const mydb = require('../Config/DBconnection'); // Database connection

async function fetchHistoricalData(deviceId, days) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT generatorPower, recordedAt
            FROM device_power_data
            WHERE deviceId = ? AND recordedAt >= NOW() - INTERVAL ? DAY
            ORDER BY recordedAt ASC;
        `;

        mydb.query(query, [deviceId, days], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results); // Return the results as an array
            
        });
    });
}

const ss = require('simple-statistics');

async function analyzeHistoricalData(deviceId, days) {
    const historicalData = await fetchHistoricalData(deviceId, days);

    if (!historicalData.length) {
        return { mean: 0, stdDev: 0, threshold: 0 }; // Return defaults
    }
    // Extract power values
    const powerData = historicalData.map(entry => entry.generatorPower);

    // Calculate statistical metrics
    const mean = ss.mean(powerData);
    const stdDev = ss.standardDeviation(powerData);
    const threshold = mean - 2 * stdDev; // sub 2 standard devition points from mean 

    return { mean, stdDev, threshold };
}
function calculateThreshold(weather, meanPower) {
    let adjustmentFactor = 1;

    if (weather.weatherCondition === 'sunny') adjustmentFactor = 0.8; // 80 % of the mean value
    if (weather.weatherCondition === 'cloudy') adjustmentFactor = 0.6; 

    return meanPower * adjustmentFactor;
}

async function getDynamicThreshold(deviceId, weatherData, days) {
    const { mean } = await analyzeHistoricalData(deviceId, days);
    const adjustedThreshold = calculateThreshold(weatherData, mean);
    console.log("threshhold value for the device is "+adjustedThreshold)
    return adjustedThreshold;
}

module.exports = {
    fetchHistoricalData,
    analyzeHistoricalData,
    calculateThreshold,
    getDynamicThreshold
};