/**文と画像パスの格納用変数 */
let content={
    img:[],
    style:[],
    title:[],
    text:[]
}

/**
 * ロード時のアニメーション用関数
 * @param {number} i 開始か終了か
 */
function onLode(i){
    //位置取得
    const spinner=document.getElementById('Lode')
    if(i==0){
        //表示
        spinner.style.display = "block";
    }else{
        //非表示
        spinner.className="Lode fade-out";
        spinner.addEventListener('animationend', () => {
            spinner.style.display = "none";
        })
    }
}

/**
 * クリック音の関数
 */
function SoundPlay() {
    document.getElementById('sound').currentTime = 0; //連続クリックに対応
    document.getElementById('sound').play(); //クリックしたら音を再生
}

/**
 * テキストや画像を一気に変える
 * @param {number} num 配列の番号
 */
function chenge(num){
    
    if(content.img[num]!=""){
        imgBox.style.display="block";
        img.style.display="block";
        img.style=content.style[num];
        img.src=content.img[num];
    }else{
        imgBox.style.display="none";
        img.style.display="none";
    }
    text.innerHTML=content.text[num];
    title.textContent=content.title[num];
}

/**
 * 文と画像パスの読み取り 
 */
async function setting(){
    //変数宣言//
    /**gasの死体１　 説明のスプレッドシートデータ*/
    const apiURL = 'https://script.google.com/macros/s/AKfycbwqxuWaGu3ELmexvjygYXRmcRsLn-r8pdRlASv9sFeahTZmXhND9MP8ItLfUQ2agDol/exec';
    /**死体処理班１　一回適当な変数においておく */
    const response1 = await fetch(apiURL);
    /**ここでやっとクリア１　キャラクターのデータ羅列 */
    const data = await response1.json();

    console.log(data);
    //push祭りじゃー！//
    /*文とパスをソイ！*/
    for(var i=0;i<data.length;i++){
        content.img.push(data[i][0]);
        content.style.push(data[i][1]);
        content.title.push(data[i][2]);
        content.text.push(data[i][3]);
    }
    console.log(content);
}

const img=document.getElementById('img');
const imgBox=document.getElementById('img-box');
const title=document.getElementById('title');
const text=document.getElementById('text');
var num=0;

async function start(){
    onLode(0);
    await setting();
    onLode(1);

    console.log("1");
    chenge(num);
    console.log("0");
}

async function ok(){
await start();

document.addEventListener('keydown', (event)=>{
    console.log(num);
    //キャラクターフラッグが立ったとき
    if(event.key=="ArrowLeft"&&num!=0){
        SoundPlay();
        //左移動
        num--;
        chenge(num);
    }else if(event.key=="ArrowRight"&&num!=content.img.length-1){
        SoundPlay();
        //右移動
        num++;
        chenge(num);
    }
});
}  

ok();