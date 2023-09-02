// const drivers = [
//     { id: "22:22:22:22", name: "home" },
//     { id: "11:11:11:11", name: "home2" },
// ];

function onConnection(socket, sqlCon) {
    console.log(`Web client connected`);

    socket.on("disconnect", () => {
        console.log("Web client disconnected");
    });

    socket.on("get-drivers", (uid, callback) => {
        const query = `SELECT mac_addr,name FROM parametry WHERE USER_ID = '${uid}'`;
        sqlCon.query(query, function (err, result) {
            if (err) {
                callback({ status: "ERR", error: "Cannot acces database." });
                return;
            }
            callback({ status: "OK", drivers: result });
        });
    });

    socket.on("update-drivers", (data, callback) => {
        const action = data.action;
        switch (action) {
            case "add":
                const query = `INSERT INTO parametry (USER_ID, MAC_ADDR, NAME) VALUES ("${data.uid}", "${data.mac_addr}", "${data.name}")`;
                sqlCon.query(query, function (err, result) {
                    if (err) {
                        callback({
                            status: "ERR",
                            error: "Cannot acces database.",
                        });
                        return;
                    }
                });
                break;
            case "remove":
                drivers.splice(
                    drivers.findIndex((e) => {
                        e.id == data.id;
                    }, 1),
                );
                break;
        }
        callback({ status: "OK" });
    });

    socket.on("select-device", (data) => {});
    socket.on("update-state", (data) => {});
}

module.exports = {
    onConnection,
};
