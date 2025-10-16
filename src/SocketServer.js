/**
 * 游戏助手转发专用Socket服务器
 */


/**
 * 注册数据请求线路
 * @param {*} client 消费端对象
 * @param {*} server 
 */
function InitDataLine_AskData(client, server) {
    client.on("Ask_Data", (data) => {
        if (server.dataServerList.size == 0) {
            data.err = "没有游戏端在线。";
            client.emit('Answer_Data', data);
            client.broadcast.emit("Need_Game");
            return;
            // } else if (server.dataServerList.size > 1) {
            //     data.warn = "检测到多个在线的游戏端，数据可能不正常！";
            //     client.emit('Answer_Data', data);
        }

        if (data.gameid) {
            let gameClient = server.dataServerList.get(data.gameid);
            if (gameClient) {
                gameClient.emit("Ask_Data", data);
            }
        } else {
            server.dataServerList.forEach((gameClient) => {
                gameClient.emit("Ask_Data", data);
            });
        }

    });

}
/**
 * 注册数据应答线路
 * @param {*} client 游戏数据采集端
 * @param {*} server 
 */
function InitDataLine_AnswerData(client, server) {
    client.on("Answer_Data", (data) => {
        client.broadcast.emit("Answer_Data", data);
    })
}
/**
 * 执行命令
 * @param {*} client 
 * @param {*} server 
 */
function InitDataLine_ExecCMD(client, server) {
    client.on("ExecCMD", (data) => {
        client.broadcast.emit("ExecCMD", data);
    })
}

/**
 * 注册为数据采集端
 * @param {*} client 
 * @param {*} server 
 */
function InitCollecter(client, server) {
    //注册-仅限游戏运行端采用，用于注册为游戏端
    client.on("GameStart", (name) => {
        // client.broadcast.emit("message", "游戏已上线：" + name, client.id);
        console.log("游戏上线：", name, client.id);

        if (!client.gameName) client.gameName = name;
        if (!server.dataServerList.has(client.id))
            server.dataServerList.set(client.id, client);
    });

    //注销
    client.on("disconnect", (data) => {
        console.log("客户端离线：", client.id);
        if (server.dataServerList.has(client.id)) {
            let gameName = server.dataServerList.get(client.id)?.gameName;
            server.dataServerList.delete(client.id);
            client.broadcast.emit("GameEnd", gameName);
            console.log("游戏下线：", gameName, client.gameName, client.id);
        }
    });
}

/**
 * 注册外挂端对游戏端的状态查询
 * @param {*} client 
 * @param {*} server 
 */
function InitCheck(client, server) {
    client.on("CHECK", (data) => {
        // console.log("Server 收到CHECK请求", data);
        let gameClient = [];
        server.dataServerList.forEach((value, key, me) => gameClient.push({
            id: key,
            name: value.gameName
        }));

        if (server.dataServerList.size === 0) {
            client.broadcast.emit("Need_Game");
        } else {
            // console.log("【助手端】收到CHECK请求，游戏端列表：", gameClient);
            client.emit("CHECK_Result", {
                data: data,
                gameList: gameClient
            });
        }
    });
}

/**
 * 初始化服务器端所有监听
 * @param {*} io 
 */
exports.InitServer = function (io) {
    if (!io.dataServerList) io.dataServerList = new Map();    //用于记录数据采集端

    //当各种客户端连上服务器
    io.on('connection', function (socket) {
        console.log("客户端上线：", socket.id);

        InitCollecter(socket, io);
        InitDataLine_AskData(socket, io);
        InitDataLine_AnswerData(socket, io);
        InitDataLine_ExecCMD(socket, io);
        InitCheck(socket, io);
    });
}

