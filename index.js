var Date=Array(28);
var char;
var int=0;
var OK=0;

/**キャラクター解放の有無保存用配列 */
const lock = [];
/**lock番号をローカルに送る時の名前の配列 */
const DateString=[
    "save1","save2","save3","save4","save5","save6","save7","save8","save9","save10","save11","save12","save13","save14","save15","save16","save17","save18","save19","save20","save21","save22","save23","save24","save25","save26","save27","save28"
]

/**キャラクター選択*/
const char_button=document.getElementById("char");
/**カード選択*/
const card_button=document.getElementById("card");
/**全体のディスプレイ */
const dis=document.getElementById("display");
/**オーディオを流すID */
const audio=document.getElementById('audio');

/**
 * カードのステータス
 */
const Serect={
    /**名前 */
    Name : [],
    /**フレーバーテキスト */
    OnePoint : [],
    /**画像パス */
    Img : [],
    /**
     * 中央の欄に送る情報の構造体
     */
    Info : {
        Char : [],
        Unlock : [],
        Path : [],
        skill: [],
        deckInfo: [],
        deck:[]
    }
}

/**
 * IDの構造体
 */
const chars ={
    //IDの無限取得
    Menu:document.getElementById('menu'),
    Chars:document.getElementById('chars'),
    Icon:document.getElementById('icon'),
    Name:document.getElementById('Name'),
    JaName:document.getElementById('JapanName'),
    Point:document.getElementById('One-Point'),
    Info:document.getElementById('info'),
    Enter:document.getElementById('enter'),
    LockEd:document.getElementById('Locked'),
    LockInfo:document.getElementById('LockInfo'),
    Status:document.getElementById('status'),   
    Skill:document.getElementById('skill'),   
    Skill_t:document.getElementById('skill_t'),   
    Infomation_t:document.getElementById('infomation_t'),   
    Infomation:document.getElementById('infomation'),   
}

/**
 * カードの情報を保存する構造体
 */
const Deck={
    /**カード番号 */
    num:[],
    /**カード名 */
    name:[],
    /**カードのステータス増減分 */
    sta:{
      trust:[],
      joy:[],
      population:[],
      force:[],
      economy:[],
    },
    /**スキル */
    skill:{
      kinds:[],
      pow:[],
      num1:[],
      num2:[]
    },
    /**説明 */
    info:[],
    /**画像 */
    img:[],
    /**内容を事細やかに説明 */
    card:[]
}

/**
 * カードを削除する関数
 */
function resetCard(){
    if(document.getElementById("remove")!=null){
        for(var i=0;i<32;i++){
            let del=document.getElementById("remove");
            del.remove();
        }
    }
}

/**
 * 解放状態を確認するためのID取得の関数
 */
function LodeID(){
    //ID名を格納していく処理
    for(var i=0;i<Serect.Name.length-4;i++){
        lock.push(document.getElementById('lock'+i));
    }
}

/**
 * 未開放だった時の出力処理
 * @param {number} Who キャラクター選択の番号での扱い 
 */
function Locked(Who){
    //削除祭りじゃー！　＼(^^＼) (／^^)／ｱ､ｿﾚｿﾚｿﾚｿﾚ!
    resetCard();
    char_button.className="backLock";
    chars.Name.textContent="";
    chars.JaName.textContent="";
    chars.Point.textContent="";
    chars.Info.textContent="";
    chars.Status.textContent="";
    chars.Enter.style.display="none";
    chars.LockEd.style.display="block";
    chars.LockInfo.innerText="未開放\n\n[達成条件]\n\n"+Serect.Info.Unlock[Who];
    chars.Infomation.textContent="";
    chars.Infomation_t.textContent="";
    chars.Skill_t.textContent="";
    chars.Skill.textContent="";
}

/**
 * 解放済みだった時の出力処理
 * @param {number} Who  
 */
function TextInto(Who){
    //代入祭りじゃー！　＼(^^＼) (／^^)／ｱ､ｿﾚｿﾚｿﾚｿﾚ!
    char_button.className="back";
    chars.Name.innerText=Serect.Name[Who][0] + "\n";
    chars.JaName.innerText=Serect.Name[Who][1] +"\n\n";
    chars.Point.innerText=Serect.OnePoint[Who][0]+"\n"+Serect.OnePoint[Who][1]+"\n\n";
    chars.Info.innerText=Serect.Info.Char[Who];
    chars.Status.innerText="Status\n\n";
    chars.Skill_t.innerText="Skill\n";
    chars.Skill.innerText="『"+Serect.Info.skill[Who][0]+"』\n"+Serect.Info.skill[Who][1];
    chars.Infomation_t.innerText="\n\nInformation\n";
    chars.Infomation.innerText=Serect.Info.deckInfo[Who];
}

/**
 * キャラクターの画像変更
 * @param {number} Who キャラクター選択の番号での扱い 
 */
function ImgChenge(Who){
    //これだけだお。
    chars.Icon.src=Serect.Img[Who];
}

/**
 * 「キャラ選択画面」と「キャラ詳細画面」の変更処理
 * @param {number} int 画面がどっちの表示なのかを受け取る
 */
function Switch(int){
    if(int==1){
        //キャラ詳細画面を表示
        chars.Chars.style.display = "none";
        chars.Menu.style.display = "block";
        chars.Enter.style.display="block";
    }else{
        //キャラ選択画面を表示
        chars.Menu.style.display = "none";
        chars.Chars.style.display = "block";
        chars.LockEd.style.display="none";
    }
}

/**
 * カードのセッティングをする関数
 * @param {number} Who キャラクター選択の番号での扱い  
 */
function SetCard(Who){
    //
    const cardhtml=document.getElementById("action");
    for(var i=0;i<32;i++){
        var setNode;
        setNode=document.createRange().createContextualFragment(`<div id="remove" class="box">
        <picture><img class="box-img card" onclick="ClickCard(`+Serect.Info.deck[Who][i]+`)" src="`+Deck.img[Serect.Info.deck[Who][i]]+`"></picture>
        </div>`);
        cardhtml.appendChild(setNode);
    };
}

function Open(){
    
    const url = new URL(`https://ent-dev-116.github.io/kingdom/game-body/kingdom_main.html?`);
    url.searchParams.append("Charname",char);

    const url_string = url.toString();
    window.open(url_string);
}


function LockCheck(){
    for(var i=4;i<Serect.Info.Unlock.length;i++){
        if(Serect.Info.Unlock[i]!==1){
           lock[i-4].style.backgroundColor = "rgba(40,40,40,0.8)";
        }else{
           lock[i-4].style.backgroundColor = "rgba(170,170,170,0.8)";
        }
    }
}

function onLode(i){
    const spinner=document.getElementById('Lode')
    if(i==0){
        spinner.style.display = "block";
    }else{
        spinner.style.display = "none";
        document.getElementById('set_text').className="fade-in";
    }
}

function setHtml(){
    const html=document.getElementById("char-all");
    for(var i=0;i<Serect.Name.length;i++){
        var content1=`<div class="box">
        <picture><img class="box-img char" onclick="Click(`+i+`)" `
        var content2=`src="`+Serect.Img[i]+`"></picture>
        <figcaption class="char_f">`+Serect.Name[i][0]+`</figcaption>
        </div>
        `;
        var contentNode;
        if(i<4){
            const str=content1+content2;
            contentNode= document.createRange().createContextualFragment(str);
        }else{
            const str=content1+` id="lock`+(i-4)+`" `+content2;
            contentNode= document.createRange().createContextualFragment(str);
        }
        html.appendChild(contentNode);
    }
}

function or(Which){
    var str;
    const num1=Deck.skill.num1[Which][0];
    const num2=Deck.skill.num2[Which][0];

    if(num1==5){
            str=`デッキ内`;
    }else{
            str=`全て`;
    }
    str+=`のカードから[`+Deck.skill.num1[Which][1]+`]枚引`;
    console.log(num2);
    if(num2!==""){
        str+=`いて、`;
        if(num2==5){
            str+=`デッキ内のカードから`;
        }else{
            str+=`全てのカードから`;
        }
        str+=`[`+Deck.skill.num2[Which][1]+`]枚捨てる。<br>その後、もう一度行動する。`;
    }else{
        str+=`く。`;
    }
    
    return str;
}

function Addreturn(Which){
    const strsta=[`[trust]`,`[joy]`,`[population]`,`[force]`,`[economy]`];
    var str=`１ターン毎に、`;
    var i=0;
    console.log(Deck.skill.num1[Which]+"::"+Deck.skill.num2[Which]);
    if(Deck.skill.num1[Which][0]==7){
        str+=Deck.skill.num1[Which][1]+`%の確率で`+strsta[Deck.skill.num2[Which][0]]+`が[`+Deck.skill.num2[Which][1]+`]増加する。`;
        return str;
    }
    if(Deck.skill.num1[Which][0]!==""){
        str+=strsta[Deck.skill.num1[Which][0]]+`を、[`+Deck.skill.num1[Which][1]+`]ずつ増加させる。`;
        i=1;
    }
    if(Deck.skill.num2[Which][0]!==""){
        if(i==1){
            str+=`<br>また、`;
        }
        str+=strsta[Deck.skill.num2[Which][0]]+`を、[`+Deck.skill.num2[Which][1]+`]ずつ減少させてしまう。`;
    }
    return str;
}

function SwitchTrust(Which){
    var str;
    switch(Deck.skill.pow[Which]){
        case 4:
            if(Deck.skill.num1[Which][0]==9){
                str=`その宗教で増えたものが更に[`+Deck.skill.num1[Which][1]+`]増え`;
                if(Deck.skill.num1[Which][0]==Deck.skill.num2[Which][0]){
                    str+=`、減ったものが更に[`+Deck.skill.num2[Which][1]+`]減る。<br>効果は永続。`
                }else{
                    str+=`る。`;
                }
                return str;
            }
    }
}

function SwitchSkill(Which){
    var str="効果は";

    const strsta=[`[trust]`,`[joy]`,`[population]`,`[force]`,`[economy]`];
        if(Deck.skill.kinds[Which]>3){
            switch(Deck.skill.kinds[Which]){
                case 4:
                    return `このカードを発動すると、ゲームをステータス上昇を少し上げてから始めることができる。`;
                case 5:
                    str+=`宗教によって変わる。<br>このカードでは、`+SwitchTrust(Which);
            }
        }else{
            switch(Deck.skill.kinds[Which]){
                case 0:
                    str+=`即座に発動する。<br>効果は`;
                    break;
                case 1:
                    str+=`永続的に発生する。<br>効果は`;
                    break;
                case 2:
                    str+=`不定期で効果を出し続ける。<br>効果は`;
                    break;
                case 3:
                    str+=`宗教を変更する。<br>宗教名は`;
                    break;
                default:
                    return "｛このカードに特殊効果はない！｝";
            }
        }
        if(Deck.skill.kinds[Which]==3){
            switch(Deck.skill.num1[Which][1]){
                case 0:
                    str+=`[グリフォス教団]という、Forceが上がり続ける宗教。`;
                    break;
                case 1:
                    str+=`[トルネクル]という、Joyが上がり続ける宗教。`;
                    break;
                case 2:
                    str+=`[イフ・マザー]という、人をとどめる力を持つ宗教。`;
                    break;
                case 3:
                    str+=`[明星神信仰]という、楽しさをとどめる力を持つ宗教。`;
                    break;
                case 4:
                    str+=`[富豪の灯台]という、populationを犠牲にeconomyを上げる宗教。`;
                    break;
                case 5:
                    str+=`[永劫回帰]という、ランダムにイベントを起こし続ける宗教。`;
                    break;
            }
        }else{
            switch(Deck.skill.pow[Which]){
                case 0:
                    str+=strsta[Deck.skill.num1[Which][0]]+`のステータスを[`+Deck.skill.num1[Which][1]+`]から[`+Deck.skill.num2[Which][1]+`]までの乱数で上げる。`;
                    break;
                case 1:
                    str+=`カードを`+or(Which);
                    break;
                case 2:
                    str+=`もし`+strsta[Deck.skill.num1[Which][0]]+`が[`+Deck.skill.num1[Which][1]+`%]以下であれば、`+strsta[Deck.skill.num2[Which][0]]+`を[`+Deck.skill.num2[Which][1]+`]追加する。`;
                    break;
                case 3:
                    str+=strsta[Deck.skill.num1[Which][0]]+`のステータスを[`+Deck.skill.num1[Which][1]+`%]以下に減らないようにする。`;
                    break;
                case 4:
                    str+=Addreturn(Which);
                    break;
                case 5:
                    str+=strsta[Deck.skill.num1[Which][0]]+`のステータスを`+Deck.skill.num1[Which][1]+`倍にする。`;
                    break;
            }
        }
    return str;
}

function starting(){
    const spinner=document.getElementById('set');
    spinner.className="set fade-out";
    spinner.addEventListener('animationend', () => {
        spinner.style.display = "none";
      })
}

function SoundPlay() {
    document.getElementById('sound').currentTime = 0; //連続クリックに対応
    document.getElementById('sound').play(); //クリックしたら音を再生
}

//初期化処理
async function SetData() {
    const apiURL = 'https://script.google.com/macros/s/AKfycbxGusMSziC4hyJAFRXxdtRoNTMGuZ9XpVOM51sIoO_tBEQaJH8bw2g4j-8xnJWZTXXzhA/exec';
    const apiURL_deck = 'https://script.google.com/macros/s/AKfycbyUi9YKGJuE738FCKjCbt_UVl0MpDxE7AGGC9tMCZu_DmhP9cuL-iCEeN_hgdyCp0yJ-Q/exec';
    const response1 = await fetch(apiURL);
    const response2 = await fetch(apiURL_deck);
    const data = await response1.json();
    const deck = await response2.json();

    const set = document.getElementById('char-all');

    for(var i=0;i<data.length;i++){
        Serect.Name.push([data[i].en_name,data[i].jp_name]);
        Serect.OnePoint.push([data[i].en_one,"-"+data[i].jp_one+"-"]);
        Serect.Img.push(data[i].img);
        Serect.Info.Char.push(data[i].info);
        Serect.Info.Unlock.push(data[i].lock);
        Serect.Info.Path.push(data[i].path);
        Serect.Info.skill.push([data[i].skillname,data[i].skillinfo]);
        Serect.Info.deckInfo.push(data[i].deckinfo);
        Serect.Info.deck.push(data[i].deck);
    }
    for(var i=0;i<deck.length;i++){
        Deck.num.push(deck[i].num);
        Deck.name.push(deck[i].name);
        Deck.sta.economy.push(deck[i].economy);
        Deck.sta.force.push(deck[i].force);
        Deck.img.push(deck[i].img);
        Deck.info.push(deck[i].info);
        Deck.sta.joy.push(deck[i].joy);
        Deck.sta.population.push(deck[i].population);
        Deck.sta.trust.push(deck[i].trust);
        Deck.card.push(deck[i].card);
        Deck.skill.kinds.push(deck[i].s_kinds);
        Deck.skill.pow.push(deck[i].s_pow);
        Deck.skill.num1.push([deck[i].s_kn1,deck[i].s_n1]);
        Deck.skill.num2.push([deck[i].s_kn2,deck[i].s_n2]);
    }
}

//セーブ処理
function save(){
    for(var i=0;i<Date.length;i++){
        localStorage.setItem(DateString[i],Date[i]);
    }
}

//ロード処理
function Lode(){
for(var i=0;i<Date.length;i++){
    Date[i] = localStorage.getItem(DateString[i]);
        if(Date[i]==null && i<4){
            Date[i] = 1;
        }else if(Date[i]==null){
            Date[i] = 0;
        }
        if(Date[i]==1){
            Serect.Info.Unlock[i]=1;
        }
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*実体として実行される処理群*/

function Reset(){
    SoundPlay();
    var result = window.confirm('本当にデータを消去しますか？');
    if(result==true){
        localStorage.clear();
        alert('消去しました。');
        window.location.reload();
    }
}

function PassCode(){
    console.log(Serect.Name);
    console.log(Serect.Info.Unlock);
    SoundPlay();
    var check;
    const pass = document.getElementById('word');
    if(pass.value=="all-char-open!!"){
        for(var i=0;i<Serect.Info.Unlock.length;i++)
            Serect.Info.Unlock[i]=1;
        LockCheck();
        alert("let's go!!");
        for(var i=0;i<Serect.Info.Unlock.length;i++)
            Date[i]=1;
        check=1;
    }else if(pass.value!=="three-lock"){
        for(var i=4;i<Serect.Info.Unlock.length;i++){
            if(pass.value==Serect.Info.Path[i]){
                Serect.Info.Unlock[i]=1;
                LockCheck();
                alert('開放：['+Serect.Name[i][0]+']が、解放されました。');
                Date[i]=1;
                check=1;
            }
        }
    }
    if(Date[22]!=1&&Serect.Info.Unlock[6]===Serect.Info.Unlock[14]&&Serect.Info.Unlock[14]===Serect.Info.Unlock[20]&&Serect.Info.Unlock[20]===1){
        Serect.Info.Unlock[22]=1;
        LockCheck();
        alert('開放：['+Serect.Name[22][0]+']が、解放されました。');
        Date[22]=1;
        check=1;
    }
    if(check!=1){
        LockCheck();
        alert('失敗：パスコード認証に失敗しました。');
    }
    save();
    check=0;
}

function Click(Who){
    SoundPlay();
    int++;
    Switch(int);
    if(int==1){
        ImgChenge(Who);
        SetCard(Who);
        if(Serect.Info.Unlock[Who]>=1){
            TextInto(Who);
            char=Who;
        }else{
            Locked(Who);
        }
    }else{
        int=0;
        char=Who;
        resetCard();
    }
}

function ClickCard(Which){
    SoundPlay();
    const action=document.getElementById("action");
    resetCard();
    char_button.style.display="none";
    chars.Enter.style.display="none";
    card_button.style.display="block";
    const content=document.createRange().createContextualFragment(
        `<div id="cardinfo"><img src="`+Deck.img[Which]+`" class="box-img" style="height:75px"><h2 style="color:rgb(210,210,210);">No.`+(Deck.num[Which]+1)+`,`+Deck.name[Which]+`</h2><h4>
        <span style="color:#abff5d">trust `+Deck.sta.trust[Which]+`</span><br>
        <span style="color:#84FFEF">joy `+Deck.sta.joy[Which]+`</span><br>
        <span style="color:#ff88ed">population `+Deck.sta.population[Which]+`</span><br>
        <span style="color:#fd5252">force `+Deck.sta.force[Which]+`</span><br>
        <span style="color:#f5ff70">economy `+Deck.sta.economy[Which]+`</span>
        </h4>
        <h4 style="color:rgb(100,200,230);">`+SwitchSkill(Which)+`</h4>
        <h5 style="color:rgb(230,170,100)">[`+Deck.info[Which]+`]</h5>
        <h6>`+Deck.card[Which]+`</h6></div>`
    );
    action.appendChild(content);
}

function RemoveCard(){
    SoundPlay();
    const rem=document.getElementById("cardinfo");
    rem.remove();
    chars.Enter.style.display="block";
    char_button.style.display="block";
    card_button.style.display="none";
    SetCard(char);
}

async function awaitSetting(){
    onLode(0);
    await SetData();
    setHtml();
}

async function Setting(){
    await awaitSetting();
    Lode();
    LodeID();
    console.log(lock);
    LockCheck();
    save();
    onLode(1);
}

function start(){
    starting();
    if(OK!=1){
        var audio = new Audio('ホーム音楽1.mp3');
        audio.loop = true;
        audio.play();
    }
    OK=1;
    dis.className="";
    card_button.style.display="none";
}

dis.className="Lode_dis";
Setting();