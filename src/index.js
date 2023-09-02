var mysql = require("mysql");
const PORT = 1337;
const webClient = require("./webAppClient.js");
const { Server } = require("socket.io");

const connection = mysql.createConnection({
    host: "localhost",
    port: "80",
    user: "root",
    passord: "Qwerty12!",
    database: "sterownik_sql",
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("MySQL database connected!");
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
        console.log(`Driver connected: ${socket.handshake.query.id}`);
    } else if (socket.handshake.query.type == "webApp") {
        // web app connected
        webClient.onConnection(socket, sqlCon);
    }
});

io.listen(PORT);
console.log(`Server listening on port: ${PORT}`);
