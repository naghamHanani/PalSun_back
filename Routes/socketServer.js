const { Server } = require('socket.io');

function setupWebSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3001", // Replace '*' with specific origins in production
        },
    });

    

    io.on('connection', (socket) => {
        console.log(`Socket client attempting to connect: ${socket.id}`);
        
      // socket.emit('welcome', 'Hello, client!');

        // setInterval(() => {
        //     io.emit('message', 'This is a broadcast message from the server!');
        // }, 5000);
        
        socket.on('messageFromClient', (message) => {
            console.log('Message from client:', message);

            // Send a response back to the client
            socket.emit('message', `Server received: ${message}`);
        });
        socket.on('reconnect', () => {
            console.log(`Client reconnected: ${socket.id}`);
        });
        socket.on('disconnect', () => {
            console.log(`WebSocket client disconnected: ${socket.id}`);
        });
    
        socket.on('error', (err) => {
            console.error(`Socket error for client ${socket.id}:`, err);
        });
    });

    console.log("Socket server is ready and listening ");
    return io;
}

module.exports = { setupWebSocket };