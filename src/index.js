const PORT = 1337;

const webClient = require("./webAppClient.js");

const { Server } = require("socket.io");
const io = new Server({
    cors: {
        origin: "95.48.106.222:1331",
    },
});

io.on("connection", (socket) => {
    if (socket.handshake.query.type == "driver") {
        // driver connected
        socket.join(socket.handshake.query.id);
        console.log(`Driver connected: ${socket.handshake.query.id}`);
    } else if (socket.handshake.query.type == "webApp") {
        // web app connected
        webClient.onConnection(socket);
    }
});

io.listen(PORT);
console.log(`Server listening on port: ${PORT}`);
