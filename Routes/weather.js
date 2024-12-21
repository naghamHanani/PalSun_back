const express=require("express")

// Creating express Router
const router=express.Router()
const axios = require('axios');
require('dotenv').config();

const WEATHER_API_URL = 'http://api.weatherapi.com/v1/current.json';
const WEATHER_KEY = process.env.WEATHER_KEY;
router.get('/', async (req, res) => {
  const { city } = req.query;
  if (!city) {
      return res.status(400).json({ error: 'City is required' });
  }

  try {
      const response = await axios.get(WEATHER_API_URL, {
          params: {
              key: WEATHER_KEY, // Replace with your WeatherAPI key
              q: city, // Query parameter for city or location
          },
      });
      res.json(response.data);
  } catch (error) {
      res.status(500).json({ error: error.response?.data || error.message });
  }
});
module.exports=router