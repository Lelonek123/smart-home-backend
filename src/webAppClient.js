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
            const drivers = [];
            console.log(result);

            // for (let i = 0; i < result.mac_addr.len; i++) {
            //     drivers.push({ id: result.mac_addr[i], name: result.name[i] });
            // }
            // console.log(drivers);
            callback({ status: "OK", drivers: drivers });
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
