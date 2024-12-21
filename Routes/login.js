const express=require("express")

// Creating express Router
const router=express.Router()
const axios = require('axios');
require('dotenv').config();
const mydb = require('../Config/DBconnection');

router.post('/', (req, res) => {
    const n = req.body.email;
  
    mydb.connect(function(err) {
      if (err) throw err;
  
      // Use parameterized query for security
      mydb.query(
        "SELECT user_password FROM users WHERE user_email = ?",
        [n],
        function(err, result, fields) {
          if (err) throw err;
  
          // Check if result is not empty
          if (result.length > 0) {
            const dbPassword = result[0].user_password; // Extract the password
            if (dbPassword === req.body.password) { // Compare with request password
              res.status(200).json({
                success: true,
                message: "hello!!"
              });
            } else {
              res.status(401).json({
                success: false,
                message: "Invalid credentials"
              });
            }
          } else {
            res.status(404).json({
              success: false,
              message: "User not found"
            });
          }
        }
      );
    });
  });

module.exports=router