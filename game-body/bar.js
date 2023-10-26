//ID取得

/**
 * ID管理オブジェクト
 */
const id={
  /**
   * 記述用id
   * @type {id}
   */
  talk:document.getElementById("talk"),
  /**
   * ステータスバーid
   * @type {id}
   */
  bar:[
      document.getElementById("tru-bar")
     ,document.getElementById("joy-bar")
     ,document.getElementById("pop-bar")
     ,document.getElementById("for-bar")
     ,document.getElementById("eco-bar")
    ],
  /**
   * ステータスボックスid
   * @type {id}
   */
  box:[
      document.getElementById("tru-box")
     ,document.getElementById("joy-box")
     ,document.getElementById("pop-box")
     ,document.getElementById("for-box")
     ,document.getElementById("eco-box")
    ],
  /**
   * アクションボタンid
   * @type {id}
   */
  action:[
     document.getElementById("action1")
    ,document.getElementById("action2")
    ,document.getElementById("action3")
  ]
};

/**
 * ステータスのオブジェクト
 */
var sta ={
  //ステータス変数の宣言
  trust:50,
  joy:50,
  population:15,
  force:10,
  economy:25,
  /**
   * ステータス変数を数字で取り扱う
   * 
   * @param {number} ban ステータス変数の上から何番目かの指定
   * @returns {number} 選んだステータス変数の内容を引き出す
   */
  pic: function(ban){
    var num;
    switch(ban){
      case 0:
        num=sta.trust;
        break;
      case 1:
        num=sta.joy;
        break;
      case 2:
        num=sta.population;
        break;
      case 3:
        num=sta.force;
        break;
      case 4:
        num=sta.economy;
        break;
    }
    return num;
  },
  /**
   * ステータスバーの変数との同期
   */
  bar: function(){
    var i,num;
    for(i=0;i<5;i++){
      num=sta.pic(i);
      if(num>0){
        id.bar[i].style.width = num / 2 + 50 + "%";
      }else if(num<0){
        num = Math.abs(num);
        id.bar[i].style.width = 50 - (num / 2) + "%";
      }else{
        id.bar[i].style.width = 50 + "%";
      }
    }
  },
  /**
   * ステータスボックスの変数との同期
   */
  box: ()=>{
    var i,num;
    for(i=0;i<5;i++){
      num=sta.pic(i)
      id.box[i].textContent=num+"%"
    }
  }
};
/**
 * 乱数生成用オブジェクト
 */
let Random={
  /**
   * 整数乱数生成
   * 
   * @param {number} max 最大値（最小値は0で規定） 
   * @returns {number} 生成された乱数
   */
  Integer: (max)=>{
    return Math.floor(Math.random() * (max+1));
  },
  /**
   * 一定間の整数乱数生成
   * 
   * @param {number} from 最小値
   * @param {number} to 最大値
   * @returns {number} 生成された乱数
   */
  BetweenInteger: (from,to)=>{
    return Random.Integer(to-from)+from;
  }
  
}

const act={
  /**
   * 写真パス
   * @type {src}
   */
  pict:[
    "./.pictuer/pict_action/occupy.png",
  ],

}
/**
 * 基本使用しないSpeakを実現する関数
 * 
 * @param {*} String 
 * @param {*} i 
 */
function play(str) {
  const element = document.getElementById("talk");
  element.className = "";
  window.requestAnimationFrame(function(time) {
    window.requestAnimationFrame(function(time) {
      element.className = "typewriter";
    });
  });
  talk.textContent=str;
}

//変数宣言
/**整数の仮箱 */
var int=0;
//準備
let params = new URLSearchParams(document.location.search);
/**キャラクターナンバー */
var url_char=Number(params.get("Charname"));





function ClickDemo(){
  story();
}

function RandDemo(){
  sta.trust=Random.Integer(200)-100;
  sta.joy=Random.Integer(200)-100;
  sta.population=Random.Integer(200)-100;
  sta.force=Random.Integer(200)-100;
  sta.economy=Random.Integer(200)-100;
  sta.bar();
  sta.box();
}


setTimeout(function(){sta.bar();sta.box();}
,250);

function story(){
  play("これでいいのか？");
}