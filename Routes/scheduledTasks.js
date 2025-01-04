const axios = require('axios');
const mydb = require('../Config/DBconnection');

async function fetchDataAndStoreInDatabase() {
    try {
        const response = await axios.get('https://external-api.com/data');
        const data = response.data;

        // Store data in database
        const query = 'INSERT INTO devices (deviceId, generatorPower, recordedAt) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE generatorPower = ?, recordedAt = ?';
        for (const item of data) {
            await new Promise((resolve, reject) => {
                mydb.query(query, [item.deviceId, item.generatorPower, item.recordedAt, item.generatorPower, item.recordedAt], (error) => {
                    if (error) return reject(error);
                    resolve();
                });
            });
        }

        console.log('Database updated with API data.');
    } catch (error) {
        console.error('Error fetching data from API:', error);
    }
}


function scheduleTasks() {
    // Fetch external data every 5 minutes
    setInterval(fetchDataAndStoreInDatabase, 300000);

    // Notify clients of database changes every 10 minutes
    setInterval(async () => {
        const updates = await checkDatabaseForChanges();
        if (updates.length) {
            io.emit('databaseUpdate', updates);
        }
    }, 600000); // CHANGE THIS TO BE ONLY UPON CHANGES !! AND UPON VALUES FROM PREDICTERRORS 
}

scheduleTasks();