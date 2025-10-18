/**
 * 游戏端数据采集
 * 需要在游戏页加入`
   <script src="/socket.io/socket.io.js"></script>
   <script type="text/javascript" src="../RPGAssistant/src/gameclient.js"></script>
 * `
 */

(function () {
  // console.debug("游戏已接入数据采集", $dataSystem);

  let socketClient = io();

  // socketClient.on("Ask_Data", () => {
  //   console.log("【游戏端】收到助手端通知：需要游戏端");
  // });

  socketClient.on("Ask_Data", (data) => {
    AnswerData(data, socketClient);
  });

  /**
   * 执行助手端的命令
   */
  socketClient.on("ExecCMD", (data) => {
    ExecCMD(data);
  });

  let hasInit = false;
  function Init() {
    try {
      if (!$dataSystem) return setTimeout(Init, 1000);
      hasInit = true;
      let gameName = $dataSystem.gameTitle;
      //通知服务器游戏已启动
      socketClient.emit("GameStart", gameName);
    }
    catch (err) {
      return setTimeout(Init, 1000);
    }
  }

  const element = document.createElement('div');
  // 设置元素样式
  Object.assign(element.style, {
    position: 'fixed',
    bottom: '2px',
    left: '2px',
    width: '42px',
    height: '42px',
    zIndex: '9999',
    border: '1px solid #fff',
    color: '#fff',
    padding: '1px 1px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    textAlign: 'center',
  });
  element.textContent = '助手重连';
  element.addEventListener('click', () => {
    hasInit = false;
    Init();
  });
  // 将元素添加到文档中
  document.body.appendChild(element);
  Init();
})();


/**
 * 回答助手端的请求数据
 * @param {*} data 请求的数据包
 * @param {*} socketClient 
 * @returns 
 */
function AnswerData(data, socketClient) {
  //直接返回内存对象 用于应付非标准的内容
  //主要获取 $data 开头的各种变量
  if (data.varName && window[data.varName]) {
    data.data = GetDataWithFormax(window[data.varName], data.format);
    socketClient.emit('Answer_Data', data);
    return;
  } else if (data.varName && data.varName.includes(".")) {        //例如：$dataSystem.gameTitle
    let varPath = data.varName.split(".");
    let curData = window;
    for (var pathName of varPath) curData = curData[pathName];
    data.data = GetDataWithFormax(curData, data.format);
    socketClient.emit('Answer_Data', data);
    return;
  }

  //下面是经过优化处理的定制数据
  data.data = null;
  switch (data.type) {
    case "Item":
      data.data = GetGameInfo_Item();
      break;
    case "Actor":
      data.data = GetGameActor_Info(data, data.format);
      break;
    case "Armor":
      data.data = GetGameInfo_Armor();
      break;
    case "Weapon":
      data.data = GetGameInfo_Weapon();
      break;
    case "Gold":
      data.data = $gameParty?._gold;
      break;
    case "Coordinate":
      data.data = {
        x: $gamePlayer?._x,
        y: $gamePlayer?._y,
      };
      break;
    case "Variables":
      data.data = GetGameInfo_Variables();
      break;
    case "Switches":
      data.data = GetGameInfo_Switches();
      break;
  }
  socketClient.emit('Answer_Data', data);
}


/**
 * 按指定的格式获得数据
 * @param {*} obj 数据源对象
 * @param {*} format 格式，如：fn::fulRate 即调用 obj.fulRate()；
 */
function GetDataWithFormax(obj, format) {
  try {
    if (!format) return obj;
    let result = Object.assign({}, format);
    for (let key in format) {
      if (format[key] === "value") {
        result[key] = obj[key];
      } else if (format[key]?.startsWith && format[key].startsWith("fn::")) {
        let fn = format[key].replace("fn::", "");
        result[key] = obj[fn]?.call(obj);
      }
    }
    return result;
  } catch (err) {
    console.error("GetDataWithFormax::", err);
    return null;
  }
}

/**
 * 取得物品列表
 */
function GetGameInfo_Item() {
  if (!$gameParty && !$dataItems) return null;
  let result = [];
  for (let id in $gameParty?._items) result.push({
    item: $dataItems[id],
    count: $gameParty._items[id]
  });
  return result;
}

function GetGameInfo_Weapon() {
  if (!$gameParty && !$dataArmors) return null;
  let result = [];
  for (let id in $gameParty?._weapons) result.push({
    armor: $dataArmors[id],
    count: $gameParty._weapons[id]
  });
  return result;
}

/**
 * 取得护甲列表
 * @returns 
 */
function GetGameInfo_Armor() {
  if (!$gameParty && !$dataArmors) return null;
  let result = [];
  for (let id in $gameParty?._armors) result.push({
    armor: $dataArmors[id],
    count: $gameParty._armors[id]
  });
  return result;
}

/**
 * 获取指定ID的角色信息
 * @param {*} data 包含角色ID和格式的数据包
 * @param {*} format 数据格式
 * @returns 角色数据
 */
function GetGameActor_Info(data, format) {
  let result = [];
  let fm = format ? GetDataWithFormax : obj => obj;
  for (let i = 0; i < data.count; i++) {
    let _actor = $gameActors?.actor(i + 1);//注意：角色ID从1开始
    result.push(fm(_actor, format));
  }
  return result;
}

/**
 * 取得变量列表
 * @returns 
 */
function GetGameInfo_Variables() {
  if (!$gameVariables) return null;

  return $gameVariables?._data?.concat();
}

function GetGameInfo_Switches() {
  if (!$gameSwitches) return null;

  return $gameSwitches?._data?.concat();
}

/**
 * 执行助手端的命令
 * @param {*} command 命令对象
 */
function ExecCMD(command) {
  //console.debug("ExecCMD", command);
  switch (command.cmd) {
    case "Get":
      Get(command);
      break;
    case "Set":
      break;
    case "Move":
      Move(command);
      break;
    case "Scale":
      Scale(command);      // 缩放游戏界面
      break;
  }
}

/**
 * 获取指定类型的物品
 * @param {*} command 
 */
function Get(command) {
  if (!command.type) return;
  let item = null;

  switch (command.type) {
    case "Item":
      item = $dataItems;
      break;
    case "Weapon":
      item = $dataWeapons;
      break;
    case "Armor":
      item = $dataArmors;
      break;
  }

  //$gameParty.gainItem(itemData, amount)
  if (command.id === -1) {
    for (let id = 1; id < item.length; id++) {
      if (!item[id].name) continue;
      $gameParty.gainItem(item[id], command.count);
    }
  } else {
    if (item[command.id].name) {
      $gameParty.gainItem(item[command.id], command.count);
    }
  }
}

/**
 * 移动游戏角色
 * @param {*} command 
 */
function Move(command) {
  if (!command.x || !command.y) return;
  $gamePlayer._x = command.x;
  $gamePlayer._y = command.y;
}

/**
 * 缩放游戏界面
 * @param {*} command 
 */
function Scale(command) {
  if (!command?.scale) return;
  document.body.style.overflow = "hidden"
  document.body.style.height = "100vh"
  document.body.style.transition = "transform 0.3s ease"
  document.body.style.transformOrigin = "center"
  document.body.style.transform = `scale(${command.scale})`
}