const mydb = require('../Config/DBconnection');
const { faker } = require('@faker-js/faker');

// Helper function to format the date in ISO 8601
function formatDate(hours, minutes = 0) {
    const today = new Date();
    today.setHours(hours);
    today.setMinutes(minutes);
    today.setSeconds(0);
    today.setMilliseconds(0);
    return today.toISOString();
}

// Function to generate random sensor data
function generateSensorData() {
    return {
        batteryCharging: faker.number.int({ min: 1000, max: 5000 }),
        batteryDischarging: faker.number.int({ min: 1000, max: 5000 }),
        batteryStateOfCharge: faker.number.float({ min: 0, max: 100 }),
        batteryStateOfHealth: faker.number.float({ min: 0, max: 100 }),
        batteryStateOfChargeArray: [{
            index: "A",
            value: faker.number.float({ min: 0, max: 100 })
        }],
        batteryStateOfHealthArray: [{
            index: "A",
            value: faker.number.float({ min: 0, max: 100 })
        }],
        batteryVoltage: [{
            index: "A",
            value: faker.number.float({ min: 20, max: 60 })
        }],
        batteryCurrent: [{
            index: "A",
            value: faker.number.float({ min: 1, max: 10 })
        }],
        batteryTemperature: [{
            index: "A",
            value: faker.number.float({ min: 20, max: 40 })
        }],
        currentBatteryChargingSetVoltage: [{
            index: "A",
            value: faker.number.float({ min: 30, max: 60 })
        }],
        consumption: faker.number.float({ min: 5000, max: 10000 }),
        gridFeedIn: faker.number.float({ min: 100000, max: 500000 }),
        gridConsumption: faker.number.float({ min: 100000, max: 500000 }),
        pvGeneration: faker.number.float({ min: 5000, max: 10000 }),
        pvConsumptionRate: faker.number.float({ min: 0, max: 1 }),
        batteryConsumptionRate: faker.number.float({ min: 0, max: 1 }),
        gridConsumptionRate: faker.number.float({ min: 0, max: 1 }),
        totalConsumption: faker.number.float({ min: 20, max: 50 }),
        voltagePhaseA2B: faker.number.float({ min: 100, max: 250 }),
        voltagePhaseB2C: faker.number.float({ min: 100, max: 250 }),
        voltagePhaseC2A: faker.number.float({ min: 100, max: 250 }),
        voltagePhaseA: faker.number.float({ min: 100, max: 250 }),
        voltagePhaseB: faker.number.float({ min: 100, max: 250 }),
        voltagePhaseC: faker.number.float({ min: 100, max: 250 }),
        currentPhaseA: faker.number.float({ min: 0, max: 10 }),
        currentPhaseB: faker.number.float({ min: 0, max: 10 }),
        currentPhaseC: faker.number.float({ min: 0, max: 10 }),
        activePowerPhaseA: faker.number.float({ min: 0, max: 100 }),
        activePowerPhaseB: faker.number.float({ min: 0, max: 100 }),
        activePowerPhaseC: faker.number.float({ min: 0, max: 100 }),
        activePower: faker.number.float({ min: 0, max: 500 }),
        reactivePowerPhaseA: faker.number.float({ min: 0, max: 100 }),
        reactivePowerPhaseB: faker.number.float({ min: 0, max: 100 }),
        reactivePowerPhaseC: faker.number.float({ min: 0, max: 100 }),
        reactivePower: faker.number.float({ min: 0, max: 100 }),
        apparentPowerPhaseA: faker.number.float({ min: 0, max: 100 }),
        apparentPowerPhaseB: faker.number.float({ min: 0, max: 100 }),
        apparentPowerPhaseC: faker.number.float({ min: 0, max: 100 }),
        apparentPower: faker.number.float({ min: 0, max: 500 }),
        gridFrequency: faker.number.float({ min: 49, max: 50 }),
        displacementPowerFactor: faker.number.float({ min: 1, max: 3 }),
    };
}

// Function to generate data for all plants
async function generateDataForPlants() {
    return new Promise((resolve, reject) => {
        // Get the plant IDs from the plants table
        const plantQuery = 'SELECT plantId FROM plants';
        mydb.query(plantQuery, (error, results) => {
            if (error) {
                return reject(error);
            }

            const plantIds = results.map(plant => plant.plantId);

            const insertData = [];

            // For each plantId, generate 2 records: one at 00:00 and one at 12:00
            plantIds.forEach(plantId => {
                // Generate data for the first record (00:00 today)
                const data1 = generateSensorData();
                insertData.push([
                    null, plantId, JSON.stringify(data1), JSON.stringify({}) // Empty object for total (can be replaced with actual total data)
                ]);

                // Generate data for the second record (12:00 today)
                const data2 = generateSensorData();
                insertData.push([
                    null, plantId, JSON.stringify(data2), JSON.stringify({}) // Empty object for total (can be replaced with actual total data)
                ]);
            });

            const query = 'INSERT INTO plants_data (id, plantId, setData, total) VALUES ?';
            mydb.query(query, [insertData], (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    });
}

async function populatePlantData() {
    try {
        const results = await generateDataForPlants();
        console.log(`Inserted ${results.affectedRows} records into the table.`);
    } catch (error) {
        console.error('Error populating data:', error);
    }
}

module.exports = { populatePlantData };
