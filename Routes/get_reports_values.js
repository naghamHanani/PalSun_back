const express = require("express");
const db = require("../Config/DBconnection"); // Assuming you have a MySQL connection pool

const router = express.Router();

// Utility function to get date range based on type
const getDateRange = (type) => {
  const now = new Date();
  let startDate;

  switch (type) {
    case "daily":
      startDate = new Date(now.setHours(0, 0, 0, 0)- 24); // Midnight today
      break;
    case "weekly":
      startDate = new Date(now.setDate(now.getDate() - 14)); // Last 7 days
      break;
    case "monthly":
      startDate = new Date(now.setMonth(now.getMonth() - 2)); // Last 30 days
      break;
    case "yearly":
      startDate = new Date(now.setFullYear(now.getFullYear() - 3)); // Last year
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

    // SQL Query
    const query = `
      SELECT 
        CAST(JSON_UNQUOTE(JSON_EXTRACT(setData, '$.time')) AS DATETIME) AS time, 
        CAST(JSON_UNQUOTE(JSON_EXTRACT(setData, '$.pvGeneration')) AS DECIMAL(10,2)) AS pvGeneration
      FROM devices
      WHERE 
        JSON_UNQUOTE(JSON_EXTRACT(setData, '$.time')) BETWEEN ? AND ?
      ORDER BY time ASC;
    `;

    // Execute raw SQL query
    db.query(query, [startDate.toISOString(), endDate.toISOString()], (err, results) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ success: false, message: "Database error" });
        }
  
        if (!Array.isArray(results)) {
          console.error("Unexpected result format:", results);
          return res.status(500).json({ success: false, message: "Invalid data response" });
        }
  
        const formattedData = results.map((entry) => ({
            x: entry.time.toISOString().split("T").join(" "),
          y: entry.pvGeneration, //.toFixed(2)
        }));
  
        res.json({ success: true, data: formattedData });
        console.log("Formatted data:", formattedData);
      });
  } catch (error) {
    console.error("Error fetching PV data:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
