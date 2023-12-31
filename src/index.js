var mysql = require("mysql2");
const PORT = 1337;
const webClient = require("./webAppClient.js");
const { Server } = require("socket.io");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Qwerty12!",
    database: "sterownik_sql",
});

const io = new Server({
    cors: {
        origin: "http://95.48.106.222:1331",
    },
});

io.on("connection", (socket) => {
    if (socket.handshake.query.type == "driver") {
        // driver connected
        socket.join(socket.handshake.query.id);
    } else if (socket.handshake.query.type == "webApp") {
        // web app connected
        webClient.onConnection(socket, connection);
    }
});

io.listen(PORT);
console.log(`Server listening on port: ${PORT}`);
