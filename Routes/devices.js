const express = require('express');
const bcrypt = require('bcrypt');
const mydb = require('../Config/DBconnection');

const router = express.Router();

router.get('/', (req, res) => {
    console.log('Reached the query API');

    const query = 'SELECT * FROM devices';

    mydb.query(query, (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Database error', error: err });
        }

        try {
            const devices = result.map(device => {
                const installation = typeof device.installation === 'string' ? JSON.parse(device.installation) : device.installation || {};
                const setData = typeof device.setData === 'string' ? JSON.parse(device.setData) : device.setData || {};
                const total = typeof device.total === 'string' ? JSON.parse(device.total) : device.total || {};

                return {
                    deviceId: device.deviceId,
                    name: device.name,
                    plantId: device.plantId,
                    timezone: device.timezone,
                    type: device.type,
                    product: device.product,
                    productId: device.productId,
                    serial: device.serial,
                    vendor: device.vendor,
                    generatorPower: device.generatorPower,
                    isActive: device.isActive,
                    deactivatedAt: device.deactivatedAt,
                    batteryCapacity: device.batteryCapacity,
                    ipAddress: device.ipAddress,
                    firmwareVersion: device.firmwareVersion,
                    communicationProtocol: device.communicationProtocol,
                    startUpUtc: device.startUpUtc,
                    isResetted: device.isResetted,
                    termOfGuarantee: device.termOfGuarantee,
                    isSmartConnectedReady: device.isSmartConnectedReady,
                    status: device.status,
                    operationStatus: device.operationStatus,
                    sets: typeof device.sets === 'string' ? JSON.parse(device.sets) : device.sets || {},
                    subPlantID: device.subPlantID,
                    setType: device.setType,
                    resolution: device.resolution,
                    setData: setData,
                    total: total,
                    logs: typeof device.logs === 'string' ? JSON.parse(device.logs) : device.logs || {}
                };
            });

            return res.status(200).json(devices);
        } catch (parseError) {
            console.error('Error parsing data:', parseError);
            return res.status(500).json({ message: 'Error processing data', error: parseError });
        }
    });
});

module.exports = router;
