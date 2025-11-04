/**
 * 显示顶部窗口
 * @param {string} title 窗口标题
 * @param {string} content 窗口内容
 */
function ShowTopWin(title, content, options = {
    top: "10%",
    left: "25%",
    width: "50vw",
    height: "80vh",
}) {
    $("#TopWinTitle").text(title);
    $("#TopWinContent").empty().append(content);
    $("#TopWin").css(options).show();
    $(".mask").show();
}
/**
 * 关闭顶部窗口
 */
function HideTopWin() {
    $("#TopWin").hide();
    $(".mask").hide();
    $("#TopWinContent").empty();
}

/**
 * 窗口：获取防具
 */
function btGetArmors() {
    let dom = $(`<div style="width:100%;height:100%;overflow:auto;display:flex;flex-wrap:wrap;color:darkyellow;"></div>`);
    dom.append(`<div style="width:100%;height:50px;font-size:24px;">选定的防具：<span id="selectedItemName" style="color:darkgoldenrod;"></span>
                <input id="selectedItemId" type="hidden" value="" />
                数量：<input id="selectedCount" type="number" value="1" />
                <button type="button">获取防具</button></div>`);
    let box = $(`<div style="width:100%;height:800px;overflow-y:auto;display:flex;flex-wrap:wrap;color:darkgreen;align-content: flex-start;"></div>`);
    dom.append(box);
    GameData.Armors[0] = { name: "全选", id: -1, description: "全部获取", note: "" };
    for (let i = 0; i < GameData.Armors.length; i++) {
        let item = GameData.Armors[i];
        if (!item) continue;
        if (!item.name) continue;

        let title = `${item.description}_${item.note}`;
        title = title.replace(/[>"]/g, "");
        let itemBar = $(`<div class="item" title="${title}" style="min-width:186px;color:darkgreen;text-align:center;font-size:24px;">${item.name}</div>`);
        itemBar.click(function () {
            $("#selectedItemName").text(`${item.name} (${item.id})`);
            $("#selectedItemId").val(item.id);
        });
        box.append(itemBar);
    }

    dom.find("button").click(function () {
        ExecCMD({
            cmd: "Get",
            type: "Armor",
            id: parseInt($("#selectedItemId").val()),
            count: parseInt($("#selectedCount").val()),
        });
        HideTopWin();
    });
    ShowTopWin("获取防具", dom);
}

/**
 * 窗口：获取武器
 */
function btGetWeapons() {
    let dom = $(`<div style="width:100%;height:100%;overflow:auto;display:flex;flex-wrap:wrap;color:darkyellow;"></div>`);
    dom.append(`<div style="width:100%;height:50px;font-size:24px;">选定的武器：<span id="selectedItemName" style="color:darkgoldenrod;"></span>
                <input id="selectedItemId" type="hidden" value="" />
                数量：<input id="selectedCount" type="number" value="1" />
                <button type="button">获取武器</button></div>`);
    let box = $(`<div style="width:100%;height:800px;overflow-y:auto;display:flex;flex-wrap:wrap;align-content: flex-start;"></div>`);
    dom.append(box);
    GameData.Weapons[0] = { name: "全选", id: -1, description: "全部获取", note: "" };
    for (let i = 0; i < GameData.Weapons.length; i++) {
        let item = GameData.Weapons[i];
        if (!item) continue;
        if (!item.name) continue;

        let title = `${item.description}_${item.note}`;
        title = title.replace(/[>"]/g, "");
        let itemBar = $(`<div class="item" title="${title}" style="min-width:186px;color:darkorange;text-align:center;font-size:24px;">${item.name}</div>`);
        itemBar.click(function () {
            $("#selectedItemName").text(`${item.name} (${item.id})`);
            $("#selectedItemId").val(item.id);
        });
        box.append(itemBar);
    }

    dom.find("button").click(function () {
        // ACTOR_COUNT = parseInt(dom.find("#actorCount").val());
        ExecCMD({
            cmd: "Get",
            type: "Weapon",
            id: parseInt($("#selectedItemId").val()),
            count: parseInt($("#selectedCount").val()),
        });
        HideTopWin();
    });
    ShowTopWin("获取武器", dom);
}

/**
 * 窗口：获取物品
 */
function btGetItem() {
    let dom = $(`<div style="width:100%;height:100%;overflow:auto;display:flex;flex-wrap:wrap;color:darkyellow;"></div>`);
    dom.append(`<div style="width:100%;height:50px;font-size:24px;">选定的物品：<span id="selectedItemName" style="color:darkgoldenrod;"></span>
                <input id="selectedItemId" type="hidden" value="" />
                数量：<input id="selectedCount" type="number" value="1" />
                <button type="button">获取物品</button></div>`);
    let box = $(`<div style="width:100%;height:800px;overflow-y:auto;display:flex;flex-wrap:wrap;align-content: flex-start;"></div>`);
    dom.append(box);
    GameData.Items[0] = { name: "全选", id: -1, description: "全部获取", note: "" };
    for (let i = 0; i < GameData.Items.length; i++) {
        let item = GameData.Items[i];
        if (!item) continue;
        if (!item.name) continue;
        let fColor = "black";
        if (item.name.includes("药") || item.name.includes("剂")) fColor = "darkgreen";
        else if (item.name.includes("钥匙")) fColor = "orangered";
        else if (item.name.includes("控制")) fColor = "darkred";

        let title = `${item.description}_${item.note}`;
        title = title.replace(/[>"]/g, "");
        let itemBar = $(`<div class="item" title="${title}" style="min-width:186px;color:${fColor};text-align:center;font-size:24px;">${item.name}</div>`);
        itemBar.click(function () {
            $("#selectedItemName").text(`${item.name} (${item.id})`);
            $("#selectedItemId").val(item.id);
        });
        box.append(itemBar);
    }

    dom.find("button").click(function () {
        // ACTOR_COUNT = parseInt(dom.find("#actorCount").val());
        ExecCMD({
            cmd: "Get",
            type: "Item",
            id: parseInt($("#selectedItemId").val()),
            count: parseInt($("#selectedCount").val()),
        });
        HideTopWin();
    });
    ShowTopWin("获取物品", dom);
}

/**
 * 窗口：设置角色数量
 */
function btSetActorCount() {
    let dom = $(`
                <div>请输入角色数量：<input id="actorCount" type="number" value="${ACTOR_COUNT}"">
                    <button type="button">设置</button>
                </div>
            `);
    dom.find("button").click(function () {
        ACTOR_COUNT = parseInt(dom.find("#actorCount").val());
        HideTopWin();
    });
    ShowTopWin("设置角色数量", dom, {
        top: "35%",
        left: "25%",
        width: "50vw",
        height: "30vh",
    });
}

/**
 * 窗口：设置缩放值
 */
function btSetScale() {
    let dom = $(`
                <div style="width:100%;height:100%;padding:20px;color:darkyellow;">
                    <div style="margin-bottom:20px;">
                        <label for="scaleSelect">选择缩放比例：</label>
                        <select id="scaleSelect" style="padding:5px;margin-left:10px;color:darkred;">
                            ${SCALE_OPTIONS.map(option => `<option value="${option.value}" ${option.selected || ""}>${option.label}</option>`).join('')}
                        </select>
                    </div>
                    <div style="margin-bottom:20px;">
                        <label for="customScale">或输入自定义缩放值：</label>
                        <input id="customScale" type="number" step="0.1" min="1.0" max="5.0" value="${SCALE_OPTIONS.find(opt => opt.selected).value}"
                               style="padding:5px;margin-left:10px;width:80px;color:darkred;" 
                               placeholder="1.0">
                    </div>
                    <div style="text-align:center;">
                        <button type="button">应用缩放</button>
                    </div>
                </div>
            `);

    // 当下拉选择改变时，更新自定义输入框
    dom.find("#scaleSelect").change(function () {
        const selectedValue = $(this).val();
        dom.find("#customScale").val(selectedValue);
    });

    // 当自定义输入框改变时，更新下拉选择
    dom.find("#customScale").on('input', function () {
        const customValue = parseFloat($(this).val());
        const select = dom.find("#scaleSelect");
        const option = SCALE_OPTIONS.find(opt => opt.value === customValue);

        if (option) {
            select.val(customValue);
        } else {
            select.val(''); // 清除选择，表示自定义值
        }
    });

    dom.find("button").click(function () {
        let scaleValue = parseFloat(dom.find("#customScale").val());

        // 验证输入值
        if (isNaN(scaleValue) || scaleValue < 0.1 || scaleValue > 5.0) {
            alert("请输入有效的缩放值（1.0 - 5.0）");
            return;
        }

        // 发送缩放命令
        ExecCMD({
            cmd: "Scale",
            scale: scaleValue
        });

        HideTopWin();
    });

    ShowTopWin("设置缩放", dom, {
        top: "30%",
        left: "30%",
        width: "40vw",
        height: "40vh",
    });
}

/**
 * 窗口：移动角色
 */
function btSetPosition() {
    let coordinate = JSON.parse(GameCacheData["Coordinate"] || "{}");
    let dom = $(`
                <div>请输入位置：<br/>
                    X：<input id="positionX" type="text" value="${coordinate.x}"><br/>
                    Y：<input id="positionY" type="text" value="${coordinate.y}">
                    <br/><br/><button type="button">移动</button>
                </div>
            `);
    dom.find("button").click(function () {
        MoveTo(parseInt(dom.find("#positionX").val()), parseInt(dom.find("#positionY").val()));
        HideTopWin();
    });
    ShowTopWin("移动角色", dom, {
        top: "35%",
        left: "25%",
        width: "50vw",
        height: "30vh",
    });
}

/**
 * 窗口：设置金币数量
 */
function btSetGold() {
    let goldCount = JSON.parse(GameCacheData["Gold"] || "0");
    let dom = $(`
                <div>请输入金币数量：<input id="goldCount" type="number" value="${goldCount}"">
                    <button type="button">设置</button>
                </div>
            `);
    dom.find("button").click(function () {
        goldCount = parseInt(dom.find("#goldCount").val());
        ExecCMD({
            cmd: "Set",
            type: "Gold",
            value: goldCount,
        });
        HideTopWin();
    });
    ShowTopWin("设置金币数量", dom, {
        top: "35%",
        left: "25%",
        width: "50vw",
        height: "30vh",
    });
}


/**
 * 检查任务系统
 */
function btCheckQuests() {
    if (!GameData["Quests"]) {
        alert("没有任务系统");
        return;
    }
    GetData("Quests", { cache: false });
}
function ShowQuests(quests, err) {
    if (quests?.data.length == 0 || err) {
        alert("没有任务系统");
        return;
    }
    let dom = $(`<div style="display:flex;flex-wrap:wrap;align-content: flex-start;overflow-y:auto;height:800px;width:100%"></div>`);

    //任务线按钮
    let questLine = GameData["Quests"][0];  //任务线序列
    let qLDom = $(`<div style="display:flex;flex-wrap:no-wrap;align-content: flex-start;overflow-y:auto;"></div>`);
    //任务列表
    let qBody = $(`<div style="display:flex;flex-wrap:wrap;align-content: flex-start;overflow-y:auto;width:100%"></div>`);
    let qItemDom = $(`<div style="min-height:600px;overflow-y:auto;border:1px dashed #400;width:400px;flex-grow:0;"></div>`);
    let qShowDom = $(`<div style="min-height:600px;overflow-y:auto;border:1px solid #400;flex-grow:2;padding:20px 20px;"></div>`);

    //切换任务线
    for (let i = 0; i < questLine.length; i++) {
        let quest_i = questLine[i];
        if (!quest_i) continue;
        let qList = $(`<ul class='qList' style="display:none;padding-left:unset;list-style-type:none;"></ul>`);
        let thisQuest = GameData["Quests"].filter(quest => quest?.cat == i && quest?.name != "<Name>");//TODO:与游戏设计相关不同作者的处理方式不一样
        let curQuest = quests.data.filter(quest => quest?.cat == i);//当前进行中/已完成任务的数据

        for (let j = 0; j < thisQuest.length; j++) {
            let quest_j = thisQuest[j];
            let isThisQuest = curQuest.find(q => q?.questId == quest_j.id)
            let status = "";
            if (isThisQuest?.status == "completed") status = "color:green;"
            else if (isThisQuest?.status == "progress") status = "color:red;"
            let qTask = $(`<li id="quest_${quest_j.id}" style="${status}padding:8px 5px;border:1px solid #400;text-align:center;cursor:pointer;">${quest_j.id}:${stringFormat(quest_j.name, false)}</li>`);
            qTask.on("click", function () {//点击任务名称，查看任务详情
                qShowDom.empty();
                qItemDom.find(".checked").removeClass("checked");//取消选中
                qTask.addClass("checked");//添加选中样式
                qShowDom.append(`<h2>${stringFormat(quest_j.name, false)}</h2><p>${stringFormat(quest_j.desc)}</p><hr style="border-color:#a55;" />`);
                //任务进度判断
                let questInStep = quests.data.find(q => q?.questId == quest_j.id);
                let curStepId = questInStep?.currentStep || -1;

                let qStepDom = $(`<ol style="padding-left:20px;margin-left:50px;color:#ccc;"></ol>`);
                for (let k = 0; k < quest_j.steps.length; k++) {
                    let task_k = quest_j.steps[k][0];
                    let showStyle = "";
                    if (k < curStepId || questInStep?.status == "completed") showStyle = "questComplete";
                    else if (k == curStepId) showStyle = "questProcess checked";
                    else showStyle = "";
                    qStepDom.append(`<li class="${showStyle}" style="padding:5px 5px;">${stringFormat(task_k)}</li>`);
                }
                qShowDom.append(qStepDom);
            });
            qList.append(qTask);
        }

        let qBtn = "";
        if (thisQuest.length > 0) {
            qItemDom.append(qList);
            qBtn = $(`<button type="button" id="cat_${i}" ${thisQuest.length == 0}>${quest_i}</button>`);
            qBtn.on("click", function () {//点击任务线按钮
                dom.find(`.qList`).hide();
                qLDom.find(".checked").removeClass("checked");//取消选中
                qItemDom.find(".checked").removeClass("checked");//取消选中
                qBtn.addClass("checked");//添加选中样式
                qShowDom.empty();
                qList.show();
            });
        } else {
            qBtn = $(`<button type="button" id="cat_${i}" disabled style="cursor:not-allowed;background-color:lightgray;">${quest_i}</button>`);
        }
        qLDom.append(qBtn);
    }
    dom.append(qLDom);

    qBody.append(qItemDom);
    qBody.append(qShowDom);
    dom.append(qBody);

    //切换当前任务
    let showQuest = quests.data.filter(quest => quest?.status == "progress");
    if (showQuest.length > 0) {
        let p = showQuest.pop();
        dom.find(`#cat_${p.cat}`).trigger("click");
        dom.find(`#quest_${p.questId}`).trigger("click");
    } else {
    }

    ShowTopWin("任务列表", dom, {
        top: "5%",
        left: "5%",
        width: "90vw",
        height: "90vh",
    });
}
/**
 * 显示当前地图的可交互对象
 */
function btShowEvents() {
    GetData("CurEvents", { cache: false });
}
function ShowCurEvents(events) {
    let dom = $(`
                <div style="display:flex;flex-wrap:wrap;align-content: flex-start;overflow-y:auto;height:800px;">
                    ${events.map(event => `<button type="button" style="margin:5px 5px;" onclick="MoveTo(${event.x}, ${event.y})" title="${event.note}">${event.name}：${event.x}，${event.y}</button>`).join("")}
                </div>
            `);
    ShowTopWin("当前地图可交互对象", dom);
}


/**
 * 显示所有注册的地图
 */
function btShowMapInfo() {
    if (GameCacheData["MapInfos"]) ShowMapInfo(JSON.parse(GameCacheData["MapInfos"]));
    else GetData("MapInfos");
}
function ShowMapInfo(mapInfo) {
    //缓存所有地图
    let bt = $("<button>缓存所有地图</button>");
    bt.on("click", () => { ExecCMD({ cmd: "CacheAllMap" }); });
    let dom = $(`<div style="display:flex;flex-wrap:wrap;align-content:flex-start;align-items:flex-start;overflow-y:auto;height:800px;"></div>`);//$gamePlayer.reserveTransfer(mapId, x, y, direction, fadeType)
    let mapIdSet = new Set(mapInfo.map(map => map?.id));
    mapIdSet.delete(undefined);
    let curMapId = parseInt(GameCacheData.CurMapId);
    //所有房间入口
    let renderMap = function (mapId, rootDom, titleSize = 2) {
        let mapRoots = mapInfo.filter(map => map?.parentId === mapId);
        for (let i = 0; i < mapRoots.length; i++) {
            let mapRoot_i = mapRoots[i];
            mapIdSet.delete(mapRoot_i.id);
            let mapName = mapRoot_i.name;
            let mapDom = $(`<div class="mapBox" style="display:flex;flex-wrap: wrap;align-items:flex-start;margin:10px 10px;padding:5px 5px;border:1px solid #400;flex-grow:1;background-color:#${"".padEnd(3, titleSize.toString())}">
                        <h${Math.min(titleSize, 6)} onclick="MoveTo(${6}, ${6},${mapRoot_i.id})" style="cursor:pointer;width:100%;${mapName?.includes("回想") ? "color:gold;" : ""}">${mapRoot_i.id}&nbsp;${mapRoot_i.name}</h${Math.min(titleSize, 6)}>
                    </div>`);
            if (mapRoot_i.id == curMapId) mapDom.css("backgroundColor", "darkred");
            rootDom.append(mapDom);
            renderMap(mapRoot_i.id, mapDom, titleSize + 1);
        }
    }
    renderMap(0, dom);//注意以0为根地图
    while (mapIdSet.size > 0) {
        let mapId = mapIdSet.values().next().value;
        mapIdSet.delete(mapId);
        let mapName = mapInfo.find(map => map?.id == mapId)?.name;
        let mapDom = $(`<div class="mapBox" style="display:flex;flex-wrap: wrap;align-items:flex-start;margin:10px 10px;padding:5px 5px;border:1px solid #400;flex-grow:1;background-color:#eee">
                    <h${Math.min(titleSize, 6)} onclick="MoveTo(${6}, ${6},${mapId})" style="cursor:pointer;width:100%;${mapName?.includes("回想") ? "color:gold;" : ""}">${mapId}&nbsp;${mapName}</h${Math.min(titleSize, 6)}>
                </div>`);
        renderMap(mapId, mapDom);
        dom.append(mapDom);
    }

    dom.children(".mapBox").css("border", "2px solid darkred");

    ShowTopWin("所有注册的地图", dom, {
        top: "10%",
        left: "10%",
        width: "80vw",
        height: "80vh"
    });
    dom.before(bt);
}

/**
 * 设置游戏数据
 * @param {object} option 选项
 * @param {string} option.name 数据名称
 * @param {string} option.value 数据值
 * @param {string} option.type 数据类型
 */
function SetGameValue(option) {
    let dom = $(`<div><table><tr>
                <td>${option.name}：</td><td><input id="tempValue" type="text" value="${option.value}""></td></tr>
                <tr><td>数据类型：</td><td>
                    <input type="radio" name="dataType" value="Number" id="dataTypeNumber"><label for="dataTypeNumber">数字</label>
                    <input type="radio" name="dataType" value="String" id="dataTypeString"><label for="dataTypeString">字符串</label>
                    <input type="radio" name="dataType" value="Boolean" ${option.type == "Switch" ? "checked" : ""} id="dataTypeBoolean">
                    <label for="dataTypeBoolean">布尔值</label>
                </td></tr>
                <tr><td></td><td>
                    <button type="button">设置</button>
                </td></tr>
            </table></div>`);
    dom.find("button").click(function () {
        let dataType = dom.find("input[name='dataType']:checked").val();
        let value = dom.find("#tempValue").val();
        if (dataType == "Number") value = parseInt(value);
        else if (dataType == "Boolean") value = (value == "true" || value > 0);

        ExecCMD({
            cmd: "Set",
            type: option.type,
            value: value,
            id: option.id,
        });
        HideTopWin();
    });
    ShowTopWin(`设置${option.showType} - 《${option.name}》`, dom, {
        top: "35%",
        left: "25%",
        width: "50vw",
        height: "40vh",
    });
}