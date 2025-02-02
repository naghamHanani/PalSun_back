const express = require('express');
const bcrypt = require('bcrypt');
const mydb = require('../Config/DBconnection');

const router = express.Router();

router.get('/getFilteredPlantsData', (req, res) => {
    // SQL query to get all data from the 'plants' table
    console.log('reached the query api')


    const query = 'SELECT * FROM plants';

    // Execute the query
    mydb.query(query, (err, result) => {
        if (err) {
            // If there’s an error, send an error response
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Database error', error: err });
        }

        try {
            // Extract the specific data from the result
            const filteredData = result.map((plant) => {
                const installation = typeof plant.installation === 'string' ? JSON.parse(plant.installation) : plant.installation || {};
const setData = typeof plant.setData === 'string' ? JSON.parse(plant.setData) : plant.setData || [];
const total = typeof plant.total === 'string' ? JSON.parse(plant.total) : plant.total || {};


                return {
                    plantId: plant.plantId,
                    name: plant.name,
                    description: plant.description,
                    timezone: plant.timezone,
                    status: plant.status,
                    co2SavingsFactor: installation.co2SavingsFactor || null, // Extract co2SavingsFactor from installation
                    acNominalPower: installation.acNominalPower,
                    feedInTariff: installation.feedInTariff,
                    dcPowerInputMax: installation.dcPowerInputMax,
                    maxCapacity: plant.maxCapacity,
                    maxChargeRate: plant.maxChargeRate,
                    maxDischargeRate: plant.maxDischargeRate,
                    pvGeneration: setData[0]?.pvGeneration || null,
                    batteryCharging: setData[0]?.batteryCharging || null,
                    batteryDischarging: setData[0]?.batteryDischarging || null,
                    dieselGeneration: setData[0]?.dieselGeneration || null,
                    hydroGeneration: setData[0]?.hydroGeneration || null,
                    gridFeedIn: setData[0]?.gridFeedIn || null,
                    selfConsumption: setData[0]?.selfConsumption || null,
                    gridConsumption: setData[0]?.gridConsumption || null,

                    autarkyRate: setData[0]?.autarkyRate || null,
                    selfSupply: setData[0]?.selfSupply || null,
                    totalGeneration: total.pvGeneration || null,
                    totalConsumption: total.totalConsumption || null,
                    directConsumption: total.directConsumption || null,
                    totalPvGeneration: total.pvGeneration || null,
                    totalBatteryCharging: total.batteryCharging || null,
                    totalBatteryDischarging: total.batteryDischarging || null,
                    totalHydroGeneration: total.hydroGeneration || null,
                    totalGridFeedIn: total.gridFeedIn || null
                };
            });

            // Send the filtered data as response
            return res.status(200).json(filteredData);
        } catch (parseError) {
            console.error('Error parsing data:', parseError);
            return res.status(500).json({ message: 'Error processing data', error: parseError });
        }
    });
});

module.exports = router;
