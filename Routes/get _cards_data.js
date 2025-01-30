const db = require('../Config/DBconnection');
const connection = db.promise();




module.exports = (io) => {
    
  const fetchPvGeneration = async () => {
    try {
      console.log("Fetching PV Generation...");
    
      console.log('WebSocket instance set.');
      if (io) {
          io.emit('serverReady', 'WebSocket server is ready');
      }

      // Execute the query and wait for the result
      const [rows, fields] = await connection.query(
        `SELECT SUM(JSON_EXTRACT(
        setData, '$.pvGeneration')) AS totalPvGeneration 
         FROM devices 
         WHERE isActive = 1 
         AND DATE(JSON_UNQUOTE(JSON_EXTRACT(setData, '$.time'))) = CURDATE();`
      );

      // Log the full result to check its structure
      console.log("Query result:", rows);

      // Check if rows is an array and has the expected structure
      if (rows && Array.isArray(rows) && rows.length > 0) {
        const totalPvGeneration = rows[0].totalPvGeneration || 0;
        console.log("Total PV Generation:", totalPvGeneration);

        // Emit the data through socket.io
        
        if (io){
            io.emit("pvUpdate", { totalPvGeneration });
            console.log("sent to socket client!")
        }


      } else {
        console.log("No data found or invalid result structure");
      }

    } catch (error) {
      console.error("Error fetching PV generation:", error);
    }
  };

  setInterval(fetchPvGeneration, 10000); // Fetch data every 10s
};
