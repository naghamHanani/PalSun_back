



function predictError(device, weather) {
    const errors = [];
    console.log("Device data inside predictError:", device);
  console.log("Weather data inside predictError:", weather);
  
    // Overheating
    if (weather.temperature > 35 && device.status !== 'normal') {
      errors.push('Overheating risk');
    }
  
    // Power Generation Issues
    if (weather.weatherCondition === 'sunny' && device.generatorPower < 50) {
      errors.push('Low power generation in sunny weather');
    }
  
    // Communication Issues
    if (device.communicationProtocol !== 'expectedProtocol' && device.isResetted === 1) {
      errors.push('Frequent communication resets');
    }
  
    return errors.length ? errors : 'Device is operating normally';
}



  
  //console.log(predictError(device, weather));
  module.exports = { predictError };