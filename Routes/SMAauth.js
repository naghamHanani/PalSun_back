const express=require("express")

// Creating express Router
const router=express.Router()


const axios = require('axios');
const querystring = require('querystring');



router.get('/', async (req, res) => {
  // Replace these values with your actual client ID, redirect URI, etc.
  const clientID = process.env.CLIENT_ID;
  const redirectURI = 'http://localhost:3000/callback';
  //const state = 'randomOpaqueValue'; // Generate a unique value here.
  const crypto = require('crypto');
const state = crypto.randomBytes(16).toString('hex');

  // Construct the query parameters
  const params = querystring.stringify({
    client_id: clientID,
    response_type: 'code',
    redirect_uri: redirectURI,
    state: state,
  });

  // Construct the full URL
  const url = `https://auth.smaapis.de/oauth2/auth?${params}`;

  try {
    // Redirect the user to the SMA authorization page
    res.redirect(url);
  } catch (error) {
    console.error('Error during SMA auth redirect:', error);
    print(error)
    res.status(500).json({ success: false, message: 'Failed to initiate SMA auth' });
  }
});



module.exports=router