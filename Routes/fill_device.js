const mydb = require('../Config/DBconnection'); // Database connection
const { faker } = require('@faker-js/faker'); // A library to generate random data

async function generateUniqueDeviceId() {
    let deviceId;
    let isUnique = false;
    
    while (!isUnique) {
        deviceId = faker.number.int({ min: 100000, max: 999999 }); // Generate random deviceId
        
        // Check if deviceId already exists in the database
        const query = 'SELECT COUNT(*) AS count FROM devices WHERE deviceId = ?';
        const result = await new Promise((resolve, reject) => {
            mydb.query(query, [deviceId], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });

        // If count is 0, it means the deviceId is unique
        if (result[0].count === 0) {
            isUnique = true;
        }
    }
    
    return deviceId;
}


// Function to insert random data into `devices` table
async function insertDeviceData(numberOfRecords) {
    return new Promise(async (resolve, reject) => {
        const query = `
            INSERT INTO devices 
            (deviceId, name, plantId, timezone, type, product, productId, serial, vendor, generatorPower, isActive, deactivatedAt, 
            batteryCapacity, ipAddress, firmwareVersion, communicationProtocol, startUpUtc, isResetted, termOfGuarantee, 
            isSmartConnectedReady, status, operationStatus, sets, subPlantID, setType, resolution, setData, total, logs)
            VALUES ?
        `;

        const timezoneList = ['Europe/Berlin', 'Asia/Kolkata', 'America/New_York', 'Australia/Sydney', 'Africa/Tunis'];
        const communicationProtocols = ['Speedwire', 'Modbus', 'Wi-Fi', 'Ethernet'];
        const statuses = ['Ok', 'Error', 'Warning'];
        const operationStatuses = ['Auto', 'Manual'];
        const resolutions = ['OneMinute', 'FiveMinutes', 'TenMinutes'];
        const setTypes = ['TypeA', 'TypeB', 'TypeC'];

        // SMA-specific products
        const productList = [
            'Sunny Boy 3.0',
            'Sunny Tripower CORE1',
            'Sunny Island 6.0H',
            'Sunny Central 1000CP XT',
            'Sunny Highpower PEAK3'
        ];

        // SMA-specific types
        const typeList = [
            'Inverter',
            'Battery Inverter',
            'Hybrid Inverter',
            'Central Inverter',
            'String Inverter'
        ];

        const now = new Date();

        // Generate records
        const data = [];
        for (let i = 0; i < numberOfRecords; i++) {
            const usedDeviceIds = new Set(); // Track used device IDs

            const deviceId = await generateUniqueDeviceId(); // Unique deviceId
            
            usedDeviceIds.add(deviceId); // Store the generated ID

            const product = productList[Math.floor(Math.random() * productList.length)]; // Select a product from the SMA product list
            const type = typeList[Math.floor(Math.random() * typeList.length)]; // Select a type from the SMA type list
            const setType= "String";
            const name = `${product} - ${faker.number.int({ min: 1000, max: 9999 })}`; 
            const plantId = faker.number.int({ min: 10000, max: 30000 }); // Random plantId
            const subPlantID= faker.number.int({ min: 10000, max: 30000 }); 
            const timezone = timezoneList[Math.floor(Math.random() * timezoneList.length)]; // Random timezone
            const productId = faker.number.int({ min: 1000, max: 10000 }); // Random productId
            const serial = faker.number.int({ min: 10000000, max: 99999999 }); // Random serial number
            const vendor = faker.company.name(); // Random vendor name
            const generatorPower = faker.number.int({ min: 1000, max: 5000 }); // Random generator power (between 1000 and 5000)
            const isActive = faker.datatype.boolean() ? 1 : 0; // Random isActive flag
            const deactivatedAt = isActive ? null : faker.date.recent(); // If active, no deactivation time
            const batteryCapacity = faker.number.int({ min: 500, max: 2000 }); // Random battery capacity
            const ipAddress = faker.internet.ip(); // Random IP address
            const firmwareVersion = faker.system.semver(); // Random firmware version (e.g., "1.0.0")
            const communicationProtocol = communicationProtocols[Math.floor(Math.random() * communicationProtocols.length)];
            const startUpUtc = faker.date.past(); // Random startUpUtc timestamp
            const isResetted = faker.datatype.boolean() ? 1 : 0; // Random reset status
            const termOfGuarantee = faker.date.future(); // Random term of guarantee (future date)
            const isSmartConnectedReady = faker.datatype.boolean() ? 1 : 0; // Random smart connectivity status
            const status = statuses[Math.floor(Math.random() * statuses.length)]; // Random status
            const operationStatus = operationStatuses[Math.floor(Math.random() * operationStatuses.length)]; // Random operation status

            const logs = JSON.stringify([
                {
                    level: faker.helpers.arrayElement(["Error", "Warning", "Info"]),
                    logId: faker.number.int({ min: 1000, max: 9999 }),
                    counter: faker.number.int({ min: 1, max: 10 }),
                    message: faker.lorem.sentence(),
                    plantId: faker.number.int({ min: 10000, max: 30000 }),
                    deviceId: deviceId,
                    timestamp: faker.date.recent().toISOString(),
                    occurrence: faker.helpers.arrayElement(["Unsolved", "Resolved"]),
                    subPlantId: faker.number.int({ min: 1000, max: 5000 }),
                    messageTagId: faker.number.int({ min: 100, max: 500 })
                }
            ]);
            
            // Generate random resolution
            const resolution = faker.helpers.arrayElement(["FiveMinutes", "OneMinute", "TenMinutes"]);

            // Generate random JSON for 'sets' field with specific fields
            const sets = JSON.stringify({
                sets: {
                    energyAndPowerBattery: {
                        energy: faker.number.int({ min: 100, max: 500 }), // Random energy value
                        power: faker.number.int({ min: 500, max: 3000 }), // Random power value
                        batteryLevel: faker.number.int({ min: 0, max: 100 }), // Random battery level percentage
                    },
                    inverterStatus: {
                        voltage: faker.number.int({ min: 100, max: 500 }), // Random voltage value
                        current: faker.number.float({ min: 0, max: 20, precision: 0.01 }), // Random current value
                        efficiency: faker.number.float({ min: 80, max: 99, precision: 0.01 }), // Random efficiency percentage
                    },
                    temperature: {
                        temperatureCelsius: faker.number.int({ min: -10, max: 50 }), // Random temperature in Celsius
                    },
                }
            });

            // Modify the setDataTime to span from February of last year to January of this year
            const startOfLastYear = new Date(now.getFullYear() - 1, 1, 1); // February 1st of last year
            const endOfJanuaryThisYear = new Date(now.getFullYear(), 0, 31); // January 31st of this year

            const setDataTime = new Date(faker.date.between({ from: startOfLastYear, to: endOfJanuaryThisYear }));
setDataTime.setHours(faker.number.int({ min: 0, max: 23 })); // Assign a random hour each day
setDataTime.setMinutes(faker.number.int({ min: 0, max: 59 })); // Assign a random minute
setDataTime.setSeconds(faker.number.int({ min: 0, max: 59 })); // Assign a random second
            const month = setDataTime.getMonth(); // Get the month (0 = Jan, 11 = Dec)
            const seasonalFactor = [0.5, 0.6, 0.8, 1, 1.2, 1.4, 1.5, 1.3, 1.1, 0.9, 0.7, 0.6][month]; 

            const setData = JSON.stringify({
                time: setDataTime,
                batteryCharging: faker.number.float({ min: 3000, max: 5000, precision: 0.01 }) * seasonalFactor,
                batteryDischarging: faker.number.float({ min: 3000, max: 5000, precision: 0.01 }) * seasonalFactor,
                batteryStateOfCharge: faker.number.float({ min: 10, max: 100, precision: 0.01 }),
                batteryStateOfHealth: faker.number.float({ min: 80, max: 100, precision: 0.01 }),
                batteryStateOfChargeArray: [{ index: "A", value: faker.number.float({ min: 10, max: 100, precision: 0.01 }) }],
                batteryStateOfHealthArray: [{ index: "A", value: faker.number.float({ min: 80, max: 100, precision: 0.01 }) }],
                batteryVoltage: [{ index: "A", value: faker.number.float({ min: 30, max: 50, precision: 0.01 }) }],
                batteryCurrent: [{ index: "A", value: faker.number.float({ min: 10, max: 50, precision: 0.01 }) }],
                batteryTemperature: [{ index: "A", value: faker.number.float({ min: 15, max: 45, precision: 0.01 }) }],
                currentBatteryChargingSetVoltage: [{ index: "A", value: faker.number.float({ min: 30, max: 60, precision: 0.01 }) }],
                consumption: faker.number.float({ min: 5000, max: 10000, precision: 0.01 }) * seasonalFactor,
                gridFeedIn: faker.number.float({ min: 100000, max: 500000, precision: 0.01 }) * seasonalFactor,
                gridConsumption: faker.number.float({ min: 100000, max: 500000, precision: 0.01 }) * seasonalFactor,
                pvGeneration: faker.number.float({ min: 5000, max: 12000, precision: 0.01 }) * seasonalFactor,
                pvConsumptionRate: faker.number.float({ min: 0.4, max: 0.8, precision: 0.01 }),
                batteryConsumptionRate: faker.number.float({ min: 0.1, max: 0.5, precision: 0.01 }) * seasonalFactor,
                gridConsumptionRate: faker.number.float({ min: 0.1, max: 0.4, precision: 0.01 }) * seasonalFactor,
                totalConsumption: faker.number.float({ min: 30, max: 50, precision: 0.01 }) * seasonalFactor,
                voltagePhaseA2B: faker.number.float({ min: 220, max: 240, precision: 0.01 }),
                voltagePhaseB2C: faker.number.float({ min: 220, max: 240, precision: 0.01 }),
                voltagePhaseC2A: faker.number.float({ min: 220, max: 240, precision: 0.01 }),
                voltagePhaseA: faker.number.float({ min: 220, max: 240, precision: 0.01 }),
                voltagePhaseB: faker.number.float({ min: 220, max: 240, precision: 0.01 }),
                voltagePhaseC: faker.number.float({ min: 220, max: 240, precision: 0.01 }),
                currentPhaseA: faker.number.float({ min: 5, max: 10, precision: 0.01 }),
                currentPhaseB: faker.number.float({ min: 5, max: 10, precision: 0.01 }),
                currentPhaseC: faker.number.float({ min: 5, max: 10, precision: 0.01 }),
                activePowerPhaseA: faker.number.float({ min: 50, max: 150, precision: 0.01 }),
                activePowerPhaseB: faker.number.float({ min: 50, max: 150, precision: 0.01 }),
                activePowerPhaseC: faker.number.float({ min: 50, max: 150, precision: 0.01 }),
                activePower: faker.number.float({ min: 100, max: 500, precision: 0.01 }),
                reactivePowerPhaseA: faker.number.float({ min: 1, max: 50, precision: 0.01 }),
                reactivePowerPhaseB: faker.number.float({ min: 1, max: 50, precision: 0.01 }),
                reactivePowerPhaseC: faker.number.float({ min: 1, max: 50, precision: 0.01 }),
                reactivePower: faker.number.float({ min: 1, max: 50, precision: 0.01 }),
                apparentPowerPhaseA: faker.number.float({ min: 1, max: 50, precision: 0.01 }),
                apparentPowerPhaseB: faker.number.float({ min: 1, max: 50, precision: 0.01 }),
                apparentPowerPhaseC: faker.number.float({ min: 1, max: 50, precision: 0.01 }),
                apparentPower: faker.number.float({ min: 200, max: 500, precision: 0.01 }),
                gridFrequency: faker.number.float({ min: 49.8, max: 50.2, precision: 0.01 }),
                displacementPowerFactor: faker.number.float({ min: 0.8, max: 1.0, precision: 0.01 }),
                dcPowerInput: [{ index: "A", value: faker.number.float({ min: 10, max: 50, precision: 0.01 }) }],
                dcVoltageInput: [{ index: "A", value: faker.number.float({ min: 30, max: 60, precision: 0.01 }) }],
                dcCurrentInput: [{ index: "A", value: faker.number.float({ min: 1, max: 20, precision: 0.01 }) }],
                isolationResistance: faker.number.int({ min: 1000000, max: 5000000 }),
                externalInsolation: faker.number.float({ min: 0, max: 5, precision: 0.01 }),
                ambientTemperature: faker.number.float({ min: -10, max: 45, precision: 0.01 }),
                moduleTemperature: faker.number.float({ min: -5, max: 60, precision: 0.01 }),
                windSpeed: faker.number.float({ min: 0, max: 20, precision: 0.01 }),
            });

            // Generate random JSON for 'total' field
            const total = JSON.stringify({
                time: setDataTime.toISOString(), // Random past ISO timestamp
                batteryCurrent: [
                    {
                        index: "A",
                        value: faker.number.float({ min: 0, max: 100, precision: 0.01 }), // Random battery current value
                    },
                ],
                batteryVoltage: [
                    {
                        index: "A",
                        value: faker.number.float({ min: 0, max: 100, precision: 0.01 }), // Random battery voltage value
                    },
                ],
                energyProduction: faker.number.float({ min: 500, max: 5000, precision: 0.01 }), // Random energy production value
                energyConsumed: faker.number.float({ min: 0, max: 2000, precision: 0.01 }), // Random energy consumed value
                energyInStorage: faker.number.float({ min: 1000, max: 5000, precision: 0.01 }), // Random energy in storage value
                totalPowerConsumed: faker.number.float({ min: 1000, max: 5000, precision: 0.01 }), // Random total power consumed value
                totalEnergy: faker.number.float({ min: 0, max: 10000, precision: 0.01 }), // Random total energy value
            });

            data.push([
                deviceId, name, plantId, timezone, type, product, productId, serial, vendor, generatorPower, isActive, deactivatedAt, 
                batteryCapacity, ipAddress, firmwareVersion, communicationProtocol, startUpUtc, isResetted, termOfGuarantee, 
                isSmartConnectedReady, status, operationStatus, sets, subPlantID, setType, resolution, setData, total, logs
            ]);
        }

        // Execute the insert query with the generated data
        mydb.query(query, [data], (err, result) => {
            if (err) {
                console.error("Error inserting data:", err);
                reject(err);
            } else {
                console.log("Query result:", result);
                resolve(result);
            }
        });
    });
}


// Function to populate data for the `devices` table
async function populateDeviceData() {
    try {
        const numberOfRecords = 100; // Number of records to insert
        const results = await insertDeviceData(numberOfRecords); // Insert data for devices
        console.log(`Inserted ${results.affectedRows} records into the devices table.`);
    } catch (error) {
        console.error('Error populating devices table:', error);
    }
}



module.exports = {
    populateDeviceData
};
