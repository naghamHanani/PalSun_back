const mydb = require('../Config/DBconnection'); // Database connection
const { faker } = require('@faker-js/faker'); // A library to generate random data

// Function to insert random data into `plants` table
async function insertPlantData(numberOfRecords) {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO plants 
            (plantId, name, description, plantGroupId, timezone, meterIds, status, migrationInfo, 
            installation, location, directSellingInfo, subPlants, devices, acNominalPower, dcPowerInputMax, 
            feedInTarrif, co2SavingFactor, startUpUtc, orientation, pvModuleAreas, storageData, calcAcNominalPower, 
            currencyCode3, address, stakeholders, plantWithPV, plantWithBattery, plantWithEnergyMeter, 
            plantWithLiveData, smartConnectedConfiguration, images, capabilities, setType, resolution, 
            setData, total, logs)
            VALUES ?
        `;

        // Generate records
        const data = [];
        for (let i = 0; i < numberOfRecords; i++) {
            const plantId = faker.number.int({ min: 10000, max: 99999 }); // Random plantId
            const plantGroupId = faker.number.int({ min: 1000, max: 9999 }); // Random plantGroupId

            const name = faker.company.name();
            const description = faker.lorem.sentence();
                const shortDescription = description.length > 60 ? description.substring(0, 60) : description;// Random description
            const timezone = faker.helpers.arrayElement(['Europe/Berlin', 'Asia/Kolkata', 'America/New_York']);
            const status = faker.helpers.arrayElement(['Ok', 'Error', 'Warning']);

            // Generate nested JSON fields
            const meterIds = JSON.stringify({ nmi: faker.string.alphanumeric(10) });

            const migrationInfo = JSON.stringify({
                oldPlantId: faker.string.uuid(),
                migrationTime: faker.date.recent().toISOString(),
            });

            const installation = JSON.stringify({
                acNominalPower: faker.number.int({ min: 3000, max: 5000 }),
                calcAcNominalPower: faker.number.int({ min: 3000, max: 5000 }),
                dcPowerInputMax: faker.number.int({ min: 3000, max: 5000 }),
                feedInTariff: faker.number.float({ min: 0.05, max: 0.20, precision: 0.001 }),
                co2SavingsFactor: faker.number.int({ min: 500, max: 1000 }),
                startUpUtc: faker.date.past().toISOString(),
                // Orientation is nested inside installation
                orientation: {
                    trackingH: faker.datatype.boolean(),
                    trackingV: faker.datatype.boolean(),
                    azimuth: faker.number.int({ min: -180, max: 180 }),
                    collectorSlope: faker.number.int({ min: 0, max: 90 }),
                },
            });
            
            const orientation = JSON.stringify({
                trackingH: faker.datatype.boolean(),
                trackingV: faker.datatype.boolean(),
                azimuth: faker.number.int({ min: -180, max: 180 }),
                collectorSlope: faker.number.int({ min: 0, max: 90 }),
            });

            const location = JSON.stringify({
                currencyCode3: faker.finance.currencyCode(),
                address: {
                    country: faker.location.countryCode(),
                    federalState: faker.location.state(),
                    city: faker.location.city(),
                    zipCode: faker.location.zipCode(),
                    street: faker.location.street(),
                    streetNo: faker.number.int({ min: 1, max: 100 }),
                    longitude: faker.location.longitude(),
                    latitude: faker.location.latitude(),
                    elevation: faker.number.int({ min: 0, max: 1000 }),
                },
            });
            const address = JSON.stringify({
                country: faker.location.countryCode(),
                federalState: faker.location.state(),
                city: faker.location.city(),
                zipCode: faker.location.zipCode(),
                street: faker.location.street(),
                streetNo: faker.number.int({ min: 1, max: 100 }),
                longitude: faker.location.longitude(),
                latitude: faker.location.latitude(),
                elevation: faker.number.int({ min: 0, max: 1000 }),
            
        });

            const directSellingInfo = JSON.stringify({
                directSellingContractNumber: faker.string.uuid(),
            });

            const subPlants = JSON.stringify([
                {
                    subPlantId: faker.number.int({ min: 100000, max: 999999 }).toString(),
                    name: faker.company.name(),
                    description : faker.lorem.sentence(),
                     shortDescription : description.length > 60 ? description.substring(0, 60) : description,
                    timezone,
                    status: faker.helpers.arrayElement(['Ok', 'Error']),
                },
            ]);

            const devices = JSON.stringify([
                {
                    deviceId: faker.number.int({ min: 100000, max: 999999 }).toString(),
                    name: faker.commerce.productName(),
                    timezone,
                    characteristic: {
                        category: faker.helpers.arrayElement(['Consumer', 'Commercial']),
                        subCategory: faker.commerce.department(),
                    },
                    type: faker.helpers.arrayElement(['Solar Inverters', 'Battery Inverters']),
                    product: faker.commerce.productName(),
                    productId: faker.number.int({ min: 1000, max: 9999 }),
                    serial: faker.number.int({ min: 10000000, max: 99999999 }).toString(),
                    vendor: faker.company.name(),
                    generatorPower: faker.number.int({ min: 1000, max: 5000 }),
                    isActive: faker.datatype.boolean(),
                    deactivatedAt: faker.date.past().toISOString(),
                    isSmartConnectedReady: faker.datatype.boolean(),
                },
            ]);

            const pvModuleAreas = JSON.stringify([
                {
                    id: 0,
                     description : faker.lorem.sentence(),
               shortDescription: description.length > 60 ? description.substring(0, 60) : description,
                    trackingH: faker.datatype.boolean(),
                    trackingV: faker.datatype.boolean(),
                    azimuth: faker.number.int({ min: -180, max: 180 }),
                    collectorSlope: faker.number.int({ min: 0, max: 90 }),
                    dcPeakPower: faker.number.int({ min: 1000, max: 5000 }),
                },
            ]);

            const storageData = JSON.stringify({
                maxCapacity: faker.number.int({ min: 0, max: 5000 }),
                maxChargeRate: faker.number.int({ min: 0, max: 5000 }),
                maxDischargeRate: faker.number.int({ min: 0, max: 5000 }),
            });

            const stakeholders = JSON.stringify([
                {
                    stakeholderId: faker.number.int({ min: 10000, max: 99999 }).toString(),
                    type: faker.helpers.arrayElement(['Owner', 'Installer']),
                    userId: faker.number.int({ min: 10000, max: 99999 }).toString(),
                    companyName: faker.company.name(),
                    title: faker.name.prefix(),
                    firstName: faker.name.firstName(),
                    lastName: faker.name.lastName(),
                    country: faker.location.countryCode(),
                    state: faker.location.state(),
                    zipCode: faker.location.zipCode(),
                    city: faker.location.city(),
                    street: faker.location.street(),
                    phoneNumber: faker.phone.number(),
                    email: faker.internet.email(),
                    taxId: faker.string.alphanumeric(12),
                    contactForService: [faker.helpers.arrayElement(['ServiceA', 'ServiceB'])],
                },
            ]);

            const smartConnectedConfiguration = JSON.stringify({
                isActive: faker.datatype.boolean(),
                deliveryAddress: faker.address.streetAddress(),
                emailRecipient: faker.internet.email(),
            });

            const images = JSON.stringify([
                {
                    imageId: faker.string.alphanumeric(10),
                    imageType: faker.helpers.arrayElement(['PortalProfileSmall', 'PortalProfileLarge']),
                    title: faker.lorem.words(2),
                    subtitle: faker.lorem.words(5),
                },
            ]);

            const capabilities = JSON.stringify({
                measurementData: ['PvGeneration'],
            });

            const setData = JSON.stringify([
                {
                    time: faker.date.past().toISOString(),
                    pvGeneration: faker.number.float({ min: 100, max: 5000, precision: 0.001 }),
                    batteryCharging: faker.number.float({ min: 100, max: 5000, precision: 0.001 }),
                },
            ]);

            const total = JSON.stringify({
                pvGeneration: faker.number.float({ min: 100, max: 5000, precision: 0.001 }),
                batteryCharging: faker.number.float({ min: 100, max: 5000, precision: 0.001 }),
            });

            const logs = JSON.stringify({
                deviceCommunications: {
                    messageId: faker.number.int({ min: 1, max: 1000 }),
                    level: faker.helpers.arrayElement(['Info', 'Warning', 'Error']),
                },
            });

            // Push data to the batch array
            data.push([
                plantId, name, shortDescription, plantGroupId, timezone, meterIds, status, migrationInfo, installation,
                location, directSellingInfo, subPlants, devices, 4100, 4420, 0.108, 640, "2019-07-01T00:00:00",
                orientation, pvModuleAreas, storageData, 4150, 'EUR', address, stakeholders,
                true, true, true, true, smartConnectedConfiguration, images, capabilities, 'TypeA', 'FiveMinutes',
                setData, total, logs
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

// Function to populate data for the `plants` table
async function populatePlantData() {
    try {
        const numberOfRecords = 3; // Number of records to insert
        const results = await insertPlantData(numberOfRecords);
        console.log(`Inserted ${results.affectedRows} records into the plants table.`);
    } catch (error) {
        console.error('Error populating plants table:', error);
    }
}

// Call function to insert data
populatePlantData();

module.exports = {
    populatePlantData,
};
