const WebSocket = require('ws');
const { predictError } = require('./erorrDetect');

function setupWebSocket() {
  const ws = new WebSocket('ws://localhost:3000');

  ws.on('open', () => {
    console.log('WebSocket connection established');
  });

  ws.on('message', (data) => {
    try {
      const { device, weather } = JSON.parse(data);
      const prediction = predictError(device, weather);
      console.log('Real-time Prediction:', prediction);
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
}

module.exports = { setupWebSocket };
