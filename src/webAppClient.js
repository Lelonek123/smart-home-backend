let devicesData = {
    "22:22:22:22": {
        mac_addr: "22:22:22:22",
        isOnline: true,
        isPowered: true,
        alarm: true,
        peripherals: [
            {
                name: "lampargb",
                id: "lampa3123123",
                type: "light_rgb",
            },
            { name: "brama", id: "brama31231231233", type: "garage_gate" },
            { name: "lampka", id: "lampka231312", type: "light" },
            { name: "zamek", id: "zamek231312", type: "lock" },
        ],
        peripherals_state: {
            lampa3123123: {
                on: true,
                rgb: "#222225",
            },
            brama31231231233: {
                open: false,
            },
            lampka231312: {
                on: false,
            },
            zamek231312: {
                open: false,
                timeout: 5,
            },
        },
    },
    "11:11:11:11": {
        mac_addr: "11:11:11:11",
        isOnline: false,
    },
};

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
        let query;
        switch (action) {
            case "add":
                query = `INSERT INTO parametry (USER_ID, MAC_ADDR, NAME) VALUES ("${data.uid}", "${data.mac_addr}", "${data.name}")`;
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
                query = `DELETE FROM parametry WHERE USER_ID = "${data.uid}" AND MAC_ADDR = "${data.mac_addr}"`;
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
        }
        callback({ status: "OK" });
    });

    socket.on("select-device", (data, callback) => {
        const state = devicesData[data.id];
        callback({
            status: "OK",
            state: state ? state : { mac_addr: data.id, isOnline: false },
        });
    });

    socket.on("update-state", (data) => {
        devicesData[data.id] = data.newState;
        console.log("Updated State:");
        console.log(newState);
        callback({
            status: "OK",
        });
    });
}

module.exports = {
    onConnection,
};
