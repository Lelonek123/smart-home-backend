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
        const query = `SELECT * FROM parametry WHERE USER_ID = ${uid}`;
        sqlCon.query(query, function (err, result) {
            if (err) {
                console.log(err);
                callback({ status: "ERR" });
                return;
            }
            const drivers = result;
            console.log(drivers);
        });
    });

    socket.on("update-drivers", (data) => {
        const action = data.action;
        switch (action) {
            case "add":
                drivers.push({ id: data.id, name: data.name });
                break;
            case "remove":
                drivers.splice(
                    drivers.findIndex((e) => {
                        e.id == data.id;
                    }, 1),
                );
                break;
            case "update":
                drivers(
                    drivers.findIndex((e) => {
                        e.id == data.id;
                    }),
                ).name = data.name;
                break;
        }

        socket.on("select-device", (data) => {});
    });

    socket.on("update-state", (data) => {});
}

module.exports = {
    onConnection,
};
