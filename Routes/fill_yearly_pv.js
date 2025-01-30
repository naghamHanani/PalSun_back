const mydb = require('../Config/DBconnection');
const moment = require('moment');  // For handling date formatting

// Function to calculate and insert the average pvGeneration per month
async function calculateAndInsertMonthlyData() {
  const now = moment(); // Current date/time
  const startOfThisYear = moment().startOf('year');  // Start of this year
  const startOfLastYear = moment().subtract(1, 'year').startOf('year');  // Start of last year
  
  // Loop through the months of last year (Feb-Dec) and this year (Jan)
  const monthsToProcess = [
    { year: startOfLastYear.year(), month: 1 },  // February of last year
    { year: startOfLastYear.year(), month: 2 },
    { year: startOfLastYear.year(), month: 3 },
    { year: startOfLastYear.year(), month: 4 },
    { year: startOfLastYear.year(), month: 5 },
    { year: startOfLastYear.year(), month: 6 },
    { year: startOfLastYear.year(), month: 7 },
    { year: startOfLastYear.year(), month: 8 },
    { year: startOfLastYear.year(), month: 9 },
    { year: startOfLastYear.year(), month: 10 },
    { year: startOfLastYear.year(), month: 11 },
    { year: startOfThisYear.year(), month: 0 },  // January of this year
  ];

  // Loop through the months in the range
  for (const { year, month } of monthsToProcess) {
    const startOfMonth = moment().year(year).month(month).startOf('month');
    const endOfMonth = startOfMonth.clone().endOf('month'); // End of the month
    
    const monthFormatted = startOfMonth.format('YYYY-MM');  // Format month for logging

    // SQL query to aggregate data for the specific month
    const query = `
      SELECT
        -- Grouping by the year and month formatted from the timestamp
        DATE_FORMAT(STR_TO_DATE(JSON_UNQUOTE(JSON_EXTRACT(setData, '$.time')), '%Y-%m-%dT%H:%i:%s.%fZ'), '%Y-%m-01') AS timestamp,
        -- Calculate the average pvGeneration
        AVG(CAST(JSON_UNQUOTE(JSON_EXTRACT(setData, '$.pvGeneration')) AS DECIMAL(10, 2))) AS avg_pv_generation
      FROM devices
      WHERE STR_TO_DATE(
        JSON_UNQUOTE(JSON_EXTRACT(setData, '$.time')), 
        '%Y-%m-%dT%H:%i:%s.%fZ'
      ) BETWEEN ? AND ?  -- Filter data by the start and end of the current month
      GROUP BY DATE_FORMAT(STR_TO_DATE(
        JSON_UNQUOTE(JSON_EXTRACT(setData, '$.time')), 
        '%Y-%m-%dT%H:%i:%s.%fZ'
      ), '%Y-%m-01')  -- Group by year-month (the first day of each month)
    `;

    try {
      // Execute the query for this specific month
      const [rows, fields] = await mydb.promise().query(query, [startOfMonth.toDate(), endOfMonth.toDate()]);

      if (rows.length > 0) {
        // Insert the aggregated result into the `yearly_pv_generation` table
        const insertQuery = `
          INSERT INTO yearly_pv_generation (timestamp, avg_pv_generation)
          VALUES (?, ?)
        `;
        
        // Loop through results and insert into the table
        for (let row of rows) {
          await mydb.promise().query(insertQuery, [row.timestamp, row.avg_pv_generation]);
          console.log(`Inserted data for ${monthFormatted}: ${row.avg_pv_generation}`);
        }
      }
    } catch (err) {
      console.error('Error while processing month:', monthFormatted, err);
    }
  }
}

// Call the function to perform the calculation and insertion
calculateAndInsertMonthlyData()
  .then(() => {
    console.log('Finished inserting data for the year.');
    // Close the database connection
  })
  .catch(err => {
    console.error('Error in processing:', err);
  });

// Export the function if needed
module.exports = {
  calculateAndInsertMonthlyData
};
