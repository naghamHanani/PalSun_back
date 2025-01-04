const mydb = require('../Config/DBconnection'); // Database connection
const { faker } = require( '@faker-js/faker'); // A library to generate random data

// Function to insert random data into `device_power_data`
async function insertDeviceData(deviceId, numberOfRecords) {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO device_power_data (deviceId, recordedAt, generatorPower, weatherCondition)
            VALUES ?
        `;

        const weatherConditions = ['sunny', 'cloudy', 'rainy', 'stormy'];
        const now = new Date();

        // Generate records
        const data = [];
        for (let i = 0; i < numberOfRecords; i++) {
            const recordedAt = new Date(now.getTime() - i * 3600000); // Gradually older timestamps (1 hour apart)
            const generatorPower = faker.number.float({ min: 20, max: 30 }) // Random power generation value
            const weatherCondition =
                weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
            data.push([deviceId, recordedAt, generatorPower, weatherCondition]);
        }

        // Insert data
        mydb.query(query, [data], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
}

// Function to populate data for multiple devices
async function populateDataForDevices() {
    try {
        // Example device IDs (replace with your actual device IDs from the `devices` table)
        const deviceIds = [302453, 2, 3];

        for (const deviceId of deviceIds) {
            console.log(`Populating data for deviceId: ${deviceId}`);
            const results = await insertDeviceData(deviceId, 50); // 50 records per device
            console.log(`Inserted ${results.affectedRows} records for deviceId: ${deviceId}`);
        }
    } catch (error) {
        console.error('Error populating data:', error);
    }
}

module.exports={
    populateDataForDevices
}

