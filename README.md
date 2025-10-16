# RPG Assistant
辅助RPGMaker类型游戏的通用外挂模板

## 工作模式
通过在游戏页挂入数据采集端(`gameclient.js`)，捕捉游戏变量，并发送到简易Socket服务器端(`SocketServer.js`)，Socket服务器再广播转发。助手页(`assistant.html`)通过监听Socket服务器的广播，实现对游戏端的状态查询和控制。

## 使用方式
1.部署一个Socket服务器，能进行简单的Socket转发，必要的转发逻辑可以参考`SocketServer.js`。
2.在游戏的首页引入socket.io及`gameclient.js`。
3.直接打开助手主页`assistant.html`，即可开始使用。

### 如何在游戏中加入？
具体来说是在游戏主页文件中加入下列代码：
```html
    <script src="/socket.io/socket.io.js"></script><!-- 引入socket.io 需要按实际的Socket服务器路径修改 -->
    <script type="text/javascript" src="../RPGAssistant/src/gameclient.js"></script> 
```


## 通信协议
### 游戏上下线
|游戏端      |通道|      服务器       |
| --- | --- | ---| 
|`GameStart`|->|登记在线状态|
|`disconnect`|->|注销在线状态、广播游戏下线信息|

### 助手上线
|助手端      |通道|      服务器       |
| --- | --- | ---|
|`CHECK`|->|查询所有在线游戏|
|没有游戏|<-|broadcast(`Need_Game`)|
|所有在线游戏列表|<-|emit(`CHECK_Result`)|

### 数据采集
|助手端      |通道|      服务器       |通道|       游戏端|
| --- | --- | ---| --- | ---|
|`Ask_Data`|->|`Ask_Data`->找到采集端(Data)|->|数据采集|
|数据消费|<-|broadcast(`Answer_Data`)|<-|`Answer_Data`|

### 控制指令
|助手端      |通道|      服务器       |通道|       游戏端|
| --- | --- | ---| --- | ---|
|`ExecCMD`|->|`ExecCMD`->找到采集端(Data)|->|执行操作/改变游戏数据|