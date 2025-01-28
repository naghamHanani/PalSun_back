const mydb = require('../Config/DBconnection'); // Database connection
const { faker } = require('@faker-js/faker'); // A library to generate random data

// Function to insert random data into `devices` table
async function insertDeviceData(numberOfRecords) {
    return new Promise((resolve, reject) => {
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
            const deviceId = faker.number.int({ min: 100000, max: 999999 }); // Random deviceId

            const product = productList[Math.floor(Math.random() * productList.length)]; // Select a product from the SMA product list
            const type = typeList[Math.floor(Math.random() * typeList.length)]; // Select a type from the SMA type list
        
            
            const name = `${product} - ${faker.number.int({ min: 1000, max: 9999 })}`; 
           
            const plantId = faker.number.int({ min: 10000, max: 30000 }); // Random plantId
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

            // Generate random JSON for 'setData' field
            const setData = JSON.stringify({
                time: faker.date.past(),
                batteryCharging: faker.number.float({ min: 3000, max: 5000, precision: 0.01 }),
                batteryDischarging: faker.number.float({ min: 3000, max: 5000, precision: 0.01 }),
                batteryStateOfCharge: faker.number.float({ min: 0, max: 100, precision: 0.01 }),
                batteryStateOfHealth: faker.number.float({ min: 80, max: 100, precision: 0.01 }),
            });

            // Generate random JSON for 'total' field
            const total = JSON.stringify({
                time: faker.date.past().toISOString(), // Random past ISO timestamp
                batteryCurrent: [
                    {
                        index: "A",
                        value: faker.number.float({ min: 0, max: 100, precision: 0.01 }), // Random battery current value
                    },
                ],
                batteryVoltage: [
                    {
                        index: "A",
                        value: faker.number.float({ min: 0, max: 60, precision: 0.01 }), // Random battery voltage value
                    },
                ],
                batteryCharging: faker.number.float({ min: 0, max: 10000, precision: 0.001 }), // Random battery charging power
                batteryDischarging: faker.number.float({ min: 0, max: 10000, precision: 0.001 }), // Random battery discharging power
                batteryTemperature: [
                    {
                        index: "A",
                        value: faker.number.float({ min: -20, max: 60, precision: 0.01 }), // Random battery temperature in Celsius
                    },
                ],
                batteryStateOfCharge: faker.number.float({ min: 0, max: 100, precision: 0.01 }), // Battery state of charge as percentage
                batteryStateOfHealth: faker.number.float({ min: 50, max: 100, precision: 0.01 }), // Battery state of health as percentage
                batteryStateOfChargeArray: [
                    {
                        index: "A",
                        value: faker.number.float({ min: 0, max: 100, precision: 0.01 }), // Random battery SOC array value
                    },
                ],
                batteryStateOfHealthArray: [
                    {
                        index: "A",
                        value: faker.number.float({ min: 50, max: 100, precision: 0.01 }), // Random battery SOH array value
                    },
                ],
                currentBatteryChargingSetVoltage: [
                    {
                        index: "A",
                        value: faker.number.float({ min: 0, max: 60, precision: 0.01 }), // Random current battery charging voltage
                    },
                ],
            });
            // Generate random JSON for 'logs' field
            const logs = JSON.stringify([
                {
                    logId: faker.number.int({ min: 1000, max: 9999 }),
                    timestamp: faker.date.recent(),
                    messageTagId: faker.number.int({ min: 100, max: 500 }),
                    message: faker.lorem.sentence(),
                    level: faker.helpers.arrayElement(['Info', 'Warning', 'Error']),
                    occurrence: faker.helpers.arrayElement(['Solved', 'Ongoing', 'Unsolved']),
                    counter: faker.number.int({ min: 0, max: 10 }),
                    deviceId,
                    subPlantId: faker.number.int({ min: 1000, max: 5000 }),
                    plantId,
                }
            ]);

            const subPlantID = faker.number.int({ min: 100000, max: 999999 }); // Random subPlantID
            const setType = setTypes[Math.floor(Math.random() * setTypes.length)]; // Random setType
            const resolution = resolutions[Math.floor(Math.random() * resolutions.length)]; // Random resolution

            data.push([
                deviceId, name, plantId, timezone, type, product, productId, serial, vendor, generatorPower, 
                isActive, deactivatedAt, batteryCapacity, ipAddress, firmwareVersion, 
                communicationProtocol, startUpUtc, isResetted, termOfGuarantee, isSmartConnectedReady, status, 
                operationStatus, sets, subPlantID, setType, resolution, setData, total, logs
            ]);
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

// Function to populate data for the `devices` table
async function populateDeviceData() {
    try {
        const numberOfRecords = 3; // Number of records to insert
        const results = await insertDeviceData(numberOfRecords); // Insert data for devices
        console.log(`Inserted ${results.affectedRows} records into the devices table.`);
    } catch (error) {
        console.error('Error populating devices table:', error);
    }
}

// Call function to insert data
populateDeviceData();

module.exports = {
    populateDeviceData
};
