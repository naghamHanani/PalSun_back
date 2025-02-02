const express = require("express");
const db = require("../Config/DBconnection"); // Assuming you have a MySQL connection pool

const router = express.Router();

// Utility function to get date range based on type
const getDateRange = (type) => {
    const now = new Date();
    let startDate;
  
    switch (type) {
      case "daily":
        startDate = new Date(now.setHours(0, 0, 0, 0)); // Midnight today
        break;
      case "weekly":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7); // Last 7 days
        break;
      case "monthly":
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()); // Last month
        break;
      case "yearly":
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()); // Last year
        break;
      default:
        startDate = new Date(now.setHours(0, 0, 0, 0));
    }
  
    return { startDate, endDate: new Date() };
  };
  

// Route to get PV generation data using raw SQL
router.get("/", async (req, res) => {
  try {
    const { type } = req.query; // Using query params instead of req.params
    const { startDate, endDate } = getDateRange(type);
    console.log("Query Start Date:", startDate.toISOString());
console.log("Query End Date:", endDate.toISOString());

    console.log('in da query')
    // SQL Query to sum the fields
    const query = `
      SELECT 
        SUM(CAST(JSON_UNQUOTE(JSON_EXTRACT(setData, '$.pvGeneration')) AS DECIMAL(10,2))) AS pvGeneration,
        SUM(CAST(JSON_UNQUOTE(JSON_EXTRACT(setData, '$.batteryCharging')) AS DECIMAL(10,2))) AS charging,
        SUM(CAST(JSON_UNQUOTE(JSON_EXTRACT(setData, '$.batteryDischarging')) AS DECIMAL(10,2))) AS discharging,
        SUM(CAST(JSON_UNQUOTE(JSON_EXTRACT(setData, '$.consumption')) AS DECIMAL(10,2))) AS consumption,
        COUNT(CASE WHEN devices.isActive = 1 THEN 1 END) AS workingPlants,
        COUNT(CASE WHEN devices.isActive = 0 THEN 1 END) AS faultyPlants
      FROM devices
      WHERE 
        JSON_UNQUOTE(JSON_EXTRACT(setData, '$.time')) BETWEEN ? AND ?
    `;

    // Execute raw SQL query
    db.query(query, [startDate.toISOString(), endDate.toISOString()], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ success: false, message: "Database error" });
      }

      if (!Array.isArray(results) || results.length === 0) {
        console.error("Unexpected result format or no data:", results);
        return res.status(500).json({ success: false, message: "Invalid data response" });
      }

      const data = results[0]; // Extracting the first (and only) row of results
      console.log("Raw query result:", results);
      const formattedData = {
        pvGeneration: parseFloat(data.pvGeneration || 0).toFixed(2),
  charging: parseFloat(data.charging || 0).toFixed(2),
  discharging: parseFloat(data.discharging || 0).toFixed(2),
  consumption: parseFloat(data.consumption || 0).toFixed(2),
  workingPlants: data.workingPlants || 0,
  faultyPlants: data.faultyPlants || 0,
      }

      res.json({ success: true, data: formattedData });
      console.log("Formatted data:", formattedData);
    });
  } catch (error) {
    console.error("Error fetching PV data:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
