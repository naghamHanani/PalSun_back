const express = require('express');
const pool = require('./db'); // Database connection
const router = express.Router();

router.get('/pv-generation', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT EXTRACT(EPOCH FROM timestamp) AS time, avg_pv_generation 
             FROM pv_generation_summary 
             ORDER BY timestamp`
        );

        const chartData = result.rows.map(row => ({
            x: row.time / 3600,  // Convert timestamp to hours
            y: row.avg_pv_generation
        }));

        res.json(chartData);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
