const drivers = [
    { id: "22:22:22:22", name: "home" },
    { id: "11:11:11:11", name: "home2" },
];

function onConnection(socket) {
    console.log(`Web client connected`);

    socket.on("disconnect", () => {
        console.log("Web client disconnected");
    });

    socket.on("get-drivers", (uid, callback) => {
        callback({ status: "OK", drivers: drivers });
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
                    }, 1)
                );
                break;
            case "update":
                drivers(
                    drivers.findIndex((e) => {
                        e.id == data.id;
                    })
                ).name = data.name;
                break;
        }
    });

    socket.on("update-state", (data) => {});
}

module.exports = {
    onConnection,
};
