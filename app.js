const express= require('express')
const mysql = require('mysql2');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const mydb = require('./Config/DBconnection');

const { setupWebSocket} = require('./Routes/socketServer');

const { pollData, setSocketInstance  } = require('./Routes/deviceData');
const { fetchDeviceData }= require('./Routes/deviceData');

const smaroute=require('./Routes/SMAauth')
const  {router: weatherroute }=require('./Routes/weather')
const userroute=require('./Routes/login')
const smadataroute=require('./Routes/sma_data')
const reportsroute=require('./Routes/get_reports_values')
const app=express();
app.use(cors());
const http = require('http');
const bodyparser=require('body-parser')
const {check}=require("express-validator")
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))

const pop=require("./Routes/fill_device")


//server

const server = http.createServer(app); // Use the same server as your Express app
const io = setupWebSocket(server);

setSocketInstance(io);

server.listen(3000, () => {
  console.log('Server running on port 3000');
  //console.log("WebSocket server is ready and listening on port", server.address().port);
});

// const server = http.createServer((req, res) => {
//   res.writeHead(200, { 'Content-Type': 'text/plain' });
//   res.end('Hello, world!');
// });
// const io = setupWebSocket(server);

const cardsData = require('./Routes/get _cards_data'); // Import calculation logic

// Pass io to the PV calculation module
//cardsData(io);

app.get('/',(req,res,next)=>{
    res.send("hello")
})

app.post('/lol', (req, res) => {
     
      res.send("heyyyy");
})

//routes 
app.use('/loginTest', userroute)

app.use('/weather',weatherroute )

app.use('/smaAuth',smaroute);

app.use('/pv-data/:type',reportsroute);
//app.use('/smaData',smadataroute);

//pop.populateDeviceData();

//pollData();

//fetchDeviceData();

//login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    res.send("heyyyy");
    console.log('Request Body:', req.body);
    // Dummy check for demonstration purposes
    if (username === 'user' && password === 'password') {
      return res.json({ message: 'Login successful' });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  });


app.get('/api/data',(req,res)=>{
  res.json({
    success: true,
    message: "hello!!",
  })
})


app.post('/api/data',(req,res)=>{
  const n=req.body.n;
  res.json({
    success: true,
    message: "hello!! "+n,
  })
})



app.get('/totalEnergy', (req, res) => {
  
  var  totalEnergy=0.0;

  mydb.connect(function(err) {
    if (err) throw err;

    // Use parameterized query for security
    mydb.query(
      "SELECT SUM(generatorPower) AS totalEnergy FROM devices ",
      
      function(err, result, fields) {
        if (err) throw err;

        
        if (result.length > 0 && result[0].totalEnergy != null) {
          totalEnergy = result[0].totalEnergy; // Store the value in the variable
          res.status(200).json({
            success: true,
            message: totalEnergy, // Send only the total energy value
          });
        } else {
          res.status(404).json({
            success: false,
            message: err
          });
        }
      }
    );
  });
});

app.post('/test-notification', (req, res) => {
  const { deviceId, errors } = req.body;

  if (io) {
      io.emit('errorDetected', {
          deviceId,
          errors,
      });
      res.status(200).json({ success: true, message: 'Notification sent!' });
  } else {
      res.status(500).json({ success: false, message: 'WebSocket not initialized' });
  }
});

// var listener = app.listen(3000, function(){
//     console.log('Server running on port ' + listener.address().port); //Listening on port 8888
// });

