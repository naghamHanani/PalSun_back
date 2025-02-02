const axios = require('axios');
const { Sequelize, DataTypes } = require('sequelize');


//bearer key = response from data base about get key of user 

//deviceID from database 

// Set up the database connection (adjust as needed)
const sequelize = new Sequelize('mysql://username:password@localhost:3306/yourdbname');

// Define your data model
const MonitoringData = sequelize.define('MonitoringData', {
  metric: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  value: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
  }
}, {
  timestamps: false,  // Disable createdAt/updatedAt columns if not needed
});

// Function to fetch data from AMS API
const fetchMonitoringData = async () => {
  try {
    
    const response = await axios.get('https://api.ams.example.com/v1/device/{deviceId}/status/', {
        params: {'deviceId' : deviceID},
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY', // Replace with actual API key
      },
    });

    const metrics = response.data;  // Assuming the API returns an array of metrics

    // Insert fetched data into the database
    await Promise.all(metrics.map(async (metric) => {
      await MonitoringData.create({
        metric: metric.name,
        value: metric.value,
        timestamp: new Date(metric.timestamp),
      });
    }));

    console.log('Data inserted successfully');
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Run the function
fetchMonitoringData();