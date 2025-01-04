const { Server } = require('socket.io');

function setupWebSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: '*', // Replace '*' with specific origins in production
        },
    });

    

    io.on('connection', (socket) => {
        console.log(`WebSocket client attempting to connect: ${socket.id}`);
        
        socket.emit('welcome', 'Hello, client!');

        // setInterval(() => {
        //     io.emit('message', 'This is a broadcast message from the server!');
        // }, 5000);
        
        socket.on('messageFromClient', (message) => {
            console.log('Message from client:', message);

            // Send a response back to the client
            socket.emit('message', `Server received: ${message}`);
        });

        socket.on('disconnect', () => {
            console.log(`WebSocket client disconnected: ${socket.id}`);
        });
    
        socket.on('error', (err) => {
            console.error(`WebSocket error for client ${socket.id}:`, err);
        });
    });

    console.log("WebSocket server is ready and listening ");
    return io;
}

module.exports = { setupWebSocket };