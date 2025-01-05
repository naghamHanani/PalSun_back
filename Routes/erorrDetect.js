
const { getDynamicThreshold } = require('./thresholdCalc');

async function predictError(device, weather) {
    const errors = [];

    const { threshold } = await getDynamicThreshold(device.deviceId, weather, 7);
    
   // console.log("Device data inside predictError:", device);
  //console.log("Weather data inside predictError:", weather);
  
    // Overheating
    if (weather.temperature > 35 && device.status !== 'normal') {
      errors.push('Overheating risk');
    }
  
    // Power Generation Issues 
    if ( device.generatorPower < threshold) {
      errors.push('Low power generation in sunny weather');//checked for sunny when creating the threshold
    }
  
    // Communication Issues
    if (device.communicationProtocol !== 'expectedProtocol' && device.isResetted === 1) {
      errors.push('Frequent communication resets');
    }
   
    //console.log("Errors:", errors);

    
    return errors.length ? errors : 'Device is operating normally';
}


  //console.log(predictError(device, weather));
  module.exports = { predictError };