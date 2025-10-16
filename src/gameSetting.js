/**
 * 配置各种数据的返回格式——不同游戏间有差异，需要根据游戏进行调整
 */

//角色数量配置
let ACTOR_COUNT = 1;

//角色数据格式配置
const ACTOR_DATA_FORMAT = {
    _level: "value",
    _hp: "value",
    _mp: "value",
    mhp: "value",
    mmp: "value",
    _name: "value",
    _states: "value",       //角色状态
    _exp: "fn::currentExp",
    _maxExp: "fn::nextLevelExp",

    //一般游戏参考
    // agi:"fn::agi",      //敏捷
    // atk:"fn::atk",      //攻击
    // cev:"fn::cev",      //暴击??
    // cnt:"fn::cnt",      //暴击??
    // cri:"fn::cri",      //暴击??
    // def:"fn::def",      //防御
    // eva:"fn::eva",      //闪避??
    // exr:"fn::exr",      //经验倍率??
    // fdr:"fn::fdr",      //??
    // grd:"fn::grd",      //??
    // hit:"fn::hit",      //命中??
    // luk:"fn::luk",      //运气
    // mat:"fn::mat",      //魔攻
    // mcr:"fn::mcr",      //??
    // mdf:"fn::mdf",      //魔防
    // mdr:"fn::mdr",      //??

    // _tp:"value",        //Tp    sp
    // _mtp:"value",       //Tp    sp
};

