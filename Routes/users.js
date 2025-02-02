
const express = require("express")
const bcrypt = require('bcrypt');
// Creating express Router
const router = express.Router()
const axios = require('axios');
require('dotenv').config();
const mydb = require('../Config/DBconnection');





router.get('/', (req, res) => {
    // SQL query to get all data from the 'plants' table
    console.log('reached the query api')
    const query = 'SELECT * FROM users';

    // Execute the query
    mydb.query(query, (err, result) => {
        if (err) {
            // If there’s an error, send an error response
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Database error', error: err });
        }

        try {
            // Extract the specific data from the result
            const filteredData = result.map((user) => {


                return {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    user_email: user.user_email,
                    role: user.role,
                    phone: user.phone,

                    job_title: user.jop_title,


                };
            });

            // Send the filtered data as response
            return res.status(200).json(filteredData);
        } catch (parseError) {
            console.error('Error parsing data:', parseError);
            return res.status(500).json({ message: 'Error processing data', error: parseError });
        }
    });
});

module.exports = router;



module.exports = router