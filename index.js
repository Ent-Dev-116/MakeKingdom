/**ローカルストレージに送るデータ */
var Date = Array(64);
/**キャラクターの数値管理 */
var char;
/**スマホのオーディオハウリング防止 */
var OK = 0;
/**キャラクター解放の有無保存用配列 */
const lock = [];
/**lock番号をローカルに送る時の名前の配列 */
const DateString = []
/**キャラクター選択*/
const char_button = document.getElementById("char");
/**カード選択*/
const card_button = document.getElementById("card");
/**全体のディスプレイ */
const dis = document.getElementById("display");
/**オーディオを流すID */
const audio = document.getElementById('audio');
/**カードの情報を開いているのかのフラッグ */
var card_F = 0;
/**カードのポジション*/
var card_P = 0;
/**キャラクターの情報を開いているのかのフラッグ */
var char_F = 0;
/**キャラクターのポジション */
var char_P = 0;
/**表示しているモード */
var LookMode = 0;
/**レコードのポジション */
var Record_P = 0;
/**ディクショナリーのポジション */
var Dictionaly_P = 0;
/**PDFのデータ */
var PDF = [];
/**PDFのセーブデータ */
var PDFsave = [];

/**
 * キャラクターのステータス
 */
const Serect = {
    /**名前 */
    Name: [],
    /**フレーバーテキスト */
    OnePoint: [],
    /**画像パス */
    Img: [],
    /**
     * 中央の欄に送る情報の構造体
     */
    Info: {
        Char: [],
        Unlock: [],
        Path: [],
        skill: [],
        deckInfo: [],
        deck: []
    }
}

/**
 * IDの構造体
 */
const chars = {
    //IDの無限取得
    Menu: document.getElementById('menu'),
    Chars: document.getElementById('chars'),
    Icon: document.getElementById('icon'),
    Name: document.getElementById('Name'),
    JaName: document.getElementById('JapanName'),
    Point: document.getElementById('One-Point'),
    Info: document.getElementById('info'),
    Enter: document.getElementById('enter'),
    LockEd: document.getElementById('Locked'),
    LockInfo: document.getElementById('LockInfo'),
    Status: document.getElementById('status'),
    Skill: document.getElementById('skill'),
    Skill_t: document.getElementById('skill_t'),
    Infomation_t: document.getElementById('infomation_t'),
    Infomation: document.getElementById('infomation'),
}

/**
 * カードの情報を保存する構造体
 */
const Deck = {
    /**キャラクターの出場 */
    first: [],
    /**カード番号 */
    num: [],
    /**カード名 */
    name: [],
    /**カードのステータス増減分 */
    sta: {
        trust: [],
        joy: [],
        population: [],
        force: [],
        economy: [],
    },
    /**スキル */
    skill: {
        kinds: [],
        pow: [],
        num1: [],
        num2: []
    },
    /**説明 */
    info: [],
    /**画像 */
    img: [],
    /**内容を事細やかに説明 */
    card: []
}

/**
 * 実績の情報を保存する構造体
 */
const Trophy = {
    num: [],
    name: [],
    lock: [],
    Unlock: [],
    img: []
}

/**
 * フィードバックを管理する構造体
 */
const FeedBack = {
    name: [],
    q: [],
    a: []
}

/**
 * カードを削除する関数
 */
function resetCard() {
    if (document.getElementById("remove") != null) {
        for (var i = 0; i < 32; i++) {
            let del = document.getElementById("remove");
            del.remove();
        }
    }
}

/**
 * 解放状態を確認するためのID取得の関数
 */
function LodeID() {
    //ID名を格納していく処理
    for (var i = 0; i < Serect.Name.length - 4; i++) {
        lock.push(document.getElementById('lock' + i));
    }
}

/**
 * 未開放だった時の出力処理
 * @param {number} Who キャラクター選択の番号での扱い 
 */
function Locked(Who) {
    //削除祭りじゃー！　＼(^^＼) (／^^)／ｱ､ｿﾚｿﾚｿﾚｿﾚ!
    resetCard();
    char_button.className = "backLock";
    chars.Name.textContent = "";
    chars.JaName.textContent = "";
    chars.Point.textContent = "";
    chars.Info.textContent = "";
    chars.Status.textContent = "";
    chars.Enter.style.display = "none";
    chars.LockEd.style.display = "block";
    chars.LockInfo.innerText = "未開放\n\n[達成条件]\n\n" + Serect.Info.Unlock[Who];
    chars.Infomation.textContent = "";
    chars.Infomation_t.textContent = "";
    chars.Skill_t.textContent = "";
    chars.Skill.textContent = "";
}

/**
 * 解放済みだった時の出力処理
 * @param {number} Who  
 */
function TextInto(Who) {
    //代入祭りじゃー！　＼(^^＼) (／^^)／ｱ､ｿﾚｿﾚｿﾚｿﾚ!
    char_button.className = "back";
    chars.Name.innerText = Serect.Name[Who][0] + "\n";
    chars.JaName.innerText = Serect.Name[Who][1] + "\n\n";
    chars.Point.innerText = Serect.OnePoint[Who][0] + "\n" + Serect.OnePoint[Who][1] + "\n\n";
    chars.Info.innerText = Serect.Info.Char[Who];
    chars.Status.innerText = "Status\n\n";
    chars.Skill_t.innerText = "Skill\n";
    chars.Skill.innerText = "『" + Serect.Info.skill[Who][0] + "』\n" + Serect.Info.skill[Who][1];
    chars.Infomation_t.innerText = "\n\nInformation\n";
    chars.Infomation.innerText = Serect.Info.deckInfo[Who];
}

/**
 * キャラクターの画像変更
 * @param {number} Who キャラクター選択の番号での扱い 
 */
function ImgChenge(Who) {
    //これだけだお。
    chars.Icon.src = Serect.Img[Who];
}

/**
 * 「キャラ選択画面」と「キャラ詳細画面」の変更処理
 * @param {number} int 画面がどっちの表示なのかを受け取る
 */
function Switch(int) {
    if (int == 1) {
        //キャラ詳細画面を表示
        chars.Chars.style.display = "none";
        chars.Menu.style.display = "block";
        chars.Enter.style.display = "block";
    } else {
        //キャラ選択画面を表示
        chars.Menu.style.display = "none";
        chars.Chars.style.display = "block";
        chars.LockEd.style.display = "none";
    }
}

/**
 * カードのセッティングをする関数
 * @param {number} Who キャラクター選択の番号での扱い  
 */
function SetCard(Who) {
    //位置取り
    const cardhtml = document.getElementById("action");
    //セット
    for (var i = 0; i < 32; i++) {
        var setNode;
        setNode = document.createRange().createContextualFragment(`<div id="remove" class="box">
        <picture><img class="box-img card" onclick="ClickCard(`+ Serect.Info.deck[Who][i] + `,` + i + `)" src="` + Deck.img[Serect.Info.deck[Who][i]] + `"></picture>
        </div>`);
        cardhtml.appendChild(setNode);
    };
}

/**
 * ゲーム本体へ移るための関数
 */
function Open() {
    //url取得
    const url = new URL(`https://ent-dev-116.github.io/kingdom/game-body/kingdom_main.html?`);
    url.searchParams.append("Charname", char);
    //url移動
    const url_string = url.toString();
    window.open(url_string);
}

/**
 * 解放状態から背景色を変える関数
 */
function LockCheck() {
    for (var i = 4; i < 29; i++) {
        if (Serect.Info.Unlock[i] !== 1) {
            //開放済み
            lock[i - 4].style.backgroundColor = "rgba(40,40,40,0.8)";
        } else {
            //未開放
            lock[i - 4].style.backgroundColor = "rgba(170,170,170,0.8)";
        }
    }
    for (var i = 0; i < Trophy.Unlock.length; i++) {
        var recordID = document.getElementById('record' + i);
        if (Trophy.Unlock[i] != 1) {
            recordID.src = "./game-body/Img/record/locked.png";
            recordID.style.backgroundColor = "rgba(40,40,40,0.8)";
        } else {
            recordID.src = Trophy.img[i];
            recordID.style.backgroundColor = "rgba(170,170,170,0.8)";
        }
    }
    for (var i = 0; i < Deck.first.length; i++) {
        var dictionalyID = document.getElementById('dictionaly' + i);
        var flag = Ifcard(i);
        if (flag == 1) {
            dictionalyID.src = Deck.img[i];
            dictionalyID.style.backgroundColor = "rgba(170,170,170,0.8)"
        } else {
            dictionalyID.style.backgroundColor = "rgba(40,40,40,0.8)"
        }
    }
    for (var i = 0; i < PDF.length; i++) {
        var pdfID = document.getElementById('pdf' + i);
        if (PDF[i][2] == 1) {
            document.getElementById('pdf-img' + i).src = "./game-body/Img/other/backstory.png";
            pdfID.setAttribute('href', PDF[i][1]);
            pdfID.target = "_blank";
            pdfID.title=PDF[i][0];
        }
    }
}

/**
 * ロード時のアニメーション用関数
 * @param {number} i 開始か終了か
 */
function onLode(i) {
    //位置取得
    const spinner = document.getElementById('Lode')
    if (i == 0) {
        //表示
        spinner.style.display = "block";
    } else {
        //非表示
        spinner.style.display = "none";
        document.getElementById('set_text').className = "fade-in";
    }
}

/**
 * キャラクター選択画面を自動製作する関数
 */
function setHtml() {
    //ID取得
    const html = document.getElementById("char-all");
    //キャラクターの量だけ追加する
    for (var i = 0; i < Serect.Name.length; i++) {
        var content1 = `<div class="box">
        <picture><img class="box-img char" onclick="Click(`+ i + `)" `
        var content2 = `src="` + Serect.Img[i] + `"></picture>
        <figcaption class="char_f">`+ Serect.Name[i][0] + `</figcaption>
        </div>
        `;
        var contentNode;
        if (i < 4) {
            const str = content1 + content2;
            contentNode = document.createRange().createContextualFragment(str);
            html.appendChild(contentNode);
        } else if (i < 29) {
            const str = content1 + ` id="lock` + (i - 4) + `" ` + content2;
            contentNode = document.createRange().createContextualFragment(str);
            html.appendChild(contentNode);
        }
    }
}

/**
 *　実績確認画面を自動製作する関数
 */
function setRecord() {
    const HTML = document.getElementById('record-img');
    for (var i = 0; i < Trophy.img.length; i++) {
        contentNode = document.createRange().createContextualFragment(`<img src="` + Trophy.img[i] + `"
        onclick="recordHTML(`+ i + `)"
        id="record`+ i + `"
        class="record"
        >`);
        HTML.appendChild(contentNode);
    }
}

/**
 * カード確認画面を自動製作する関数
 */
function setDictionaly() {
    const HTML = document.getElementById('card-dictionaly-img');
    for (var i = 0; i < Deck.img.length; i++) {
        contentNode = document.createRange().createContextualFragment(`<img src="./game-body/Img/action/locked-box.png"
        onclick="Dictionaly(`+ i + `)"
        id="dictionaly`+ i + `"
        class="box-img char"
        style="width:100px;"
        >`);
        HTML.appendChild(contentNode);
    }
}

/**
 * フィードバックの設定処理
 */
function setFeed() {
    const HTML = document.getElementById('answers');
    for (var i = 1; i <= FeedBack.name.length; i++) {
        contentNode = document.createRange().createContextualFragment(`<div style="margin:5px;border-radius: 10px;background-color:white;margin-left:10px;width:600px;padding: 5px;">
        <h3>`+ FeedBack.name[FeedBack.name.length - i] + `</h3>
        <hr>
        <p>Q.`+ FeedBack.q[FeedBack.name.length - i] + `</p>
        <p>A.`+ FeedBack.a[FeedBack.name.length - i] + `</p>
        </div>`);
        HTML.appendChild(contentNode);
    }
}

/**
 * バックストーリを変更する変数
 */
function setPDF() {
    const HTML = document.getElementById('storys');
    for (var i = 0; i < PDF.length; i++) {
        contentNode = document.createRange().createContextualFragment(`<a id="pdf` + i + `"><img src="./game-body/Img/other/backstory-Locked.png"
        id="pdf-img`+ i + `"
        style="height:180px;margin:15px;border: 2px solid rgba(10, 100, 120, 0.8);"
        ></a>`);
        HTML.appendChild(contentNode);
    }
}

/**
 * 実績の文章表示関数
 * @param {number} num レコードナンバー
 */
function recordHTML(num) {
    Record_P = num;
    LockCheck();
    document.getElementById('record' + num).style.backgroundColor = "rgba(245,245,245,0.75)";
    if (Trophy.Unlock[num] == 1) {
        document.getElementById('record-info').innerHTML = `
        <h1 class="font-rpg" style="margin-top: -10px">No.`+ Trophy.num[num] + ` [` + Trophy.name[num] + `]</h1>
        <h5 class="font-rpg" style="font-size:20px;margin:-5px;">条件:`+ Trophy.lock[num] + `</h5>
        `;
    } else {
        document.getElementById('record-info').innerHTML = `
        <h1 class="font-rpg" style="margin-top: -10px">No.`+ Trophy.num[num] + ` [未開放]</h1>
        <h5 class="font-rpg" style="font-size:20px;margin:-5px;">解放条件:`+ Trophy.lock[num] + `</h5>
        `;
    }
}

/**
 * カードのスキル文章（デッキのやり取り）を送る関数
 * @param {number} Which カードの番号
 * @returns {string} スキル詳細の文字列
 */
function or(Which) {
    //変数宣言//
    /**返り値用の変数 */
    var str;
    /**スキル1の値を使いやすい変数に格納 */
    const num1 = Deck.skill.num1[Which][0];
    /**スキル2の値を使いやすい変数に格納 */
    const num2 = Deck.skill.num2[Which][0];

    //選択分岐
    if (num1 == 5) {
        str = `デッキ内`;
    } else {
        str = `全て`;
    }
    str += `のカードから[` + Deck.skill.num1[Which][1] + `]枚引`;
    if (num2 !== "") {
        str += `いて、`;
        if (num2 == 5) {
            str += `デッキ内のカードから`;
        } else {
            str += `全てのカードから`;
        }
        str += `[` + Deck.skill.num2[Which][1] + `]枚捨てる。<br>その後、もう一度行動する。`;
    } else {
        str += `く。`;
    }
    //出力
    return str;
}

/**
 * カードのスキル文章（増加減少）を送る関数
 * @param {number} Which カードの番号
 * @returns {string} スキル詳細の文字列
 */
function Addreturn(Which) {
    //変数宣言//
    /**番号でステータスの種類を扱う配列 */
    const strsta = [`[trust]`, `[joy]`, `[population]`, `[force]`, `[economy]`];
    /**返り値用の変数 */
    var str = `１ターン毎に、`;
    /**複数個の能力用のフラッグ */
    var i = 0;

    //分岐処理
    if (Deck.skill.num1[Which][0] == 7) {
        str += Deck.skill.num1[Which][1] + `%の確率で` + strsta[Deck.skill.num2[Which][0]] + `が[` + Deck.skill.num2[Which][1] + `]増加する。`;
        return str;
    }
    if (Deck.skill.num1[Which][0] !== "") {
        str += strsta[Deck.skill.num1[Which][0]] + `を、[` + Deck.skill.num1[Which][1] + `]ずつ増加させる。`;
        i = 1;
    }
    if (Deck.skill.num2[Which][0] !== "") {
        if (i == 1) {
            str += `<br>また、`;
        }
        str += strsta[Deck.skill.num2[Which][0]] + `を、[` + Deck.skill.num2[Which][1] + `]ずつ減少させてしまう。`;
    }
    //出力
    return str;
}

/**
 * カードのスキル文章（宗教依存）を送る関数
 * @param {number} Which カードの番号
 * @returns {string} スキル詳細の文字列 
 */
function SwitchTrust(Which) {
    //変数宣言//
    /**返り値用の文字列変数 */
    var str;

    //分岐と出力処理
    switch (Deck.skill.pow[Which]) {
        case 4:
            if (Deck.skill.num1[Which][0] == 9) {
                str = `その宗教で増えたものが更に[` + Deck.skill.num1[Which][1] + `]増え`;
                if (Deck.skill.num1[Which][0] == Deck.skill.num2[Which][0]) {
                    str += `、減ったものが更に[` + Deck.skill.num2[Which][1] + `]減る。<br>効果は永続。`
                } else {
                    str += `る。`;
                }
                return str;
            }
    }
}

/**
 * スキルの文章を送る関数
 * @param {number} Which カードの番号
 * @returns {string} htmlに表示される文字列
 */
function SwitchSkill(Which) {
    //変数宣言//
    /**返り値用の変数 */
    var str = "効果は";

    //阿保ほど分岐あって、分からない。もう。まじで。
    //だから、フィーリングで読み解け。
    if (Deck.num[Which] < 100) {
        const strsta = [`[trust]`, `[joy]`, `[population]`, `[force]`, `[economy]`];
        if (Deck.skill.kinds[Which] > 3) {
            switch (Deck.skill.kinds[Which]) {
                case 4:
                    return `このカードを発動すると、ゲームをステータス上昇を少し上げてから始めることができる。`;
                case 5:
                    str += `宗教によって変わる。<br>このカードでは、` + SwitchTrust(Which);
            }
        } else {
            switch (Deck.skill.kinds[Which]) {
                case 0:
                    str += `即座に発動する。<br>効果は`;
                    break;
                case 1:
                    str += `永続的に発生する。<br>効果は`;
                    break;
                case 2:
                    str += `不定期で効果を出し続ける。<br>効果は`;
                    break;
                case 3:
                    str += `宗教を変更する。<br>宗教名は`;
                    break;
                default:
                    return "｛このカードに特殊効果はない！｝";
            }
        }
        if (Deck.skill.kinds[Which] == 3) {
            switch (Deck.skill.num1[Which][1]) {
                case 0:
                    str += `[グリフォス教団]という、Forceが上がり続ける宗教。`;
                    break;
                case 1:
                    str += `[トルネクル]という、Joyが上がり続ける宗教。`;
                    break;
                case 2:
                    str += `[イフ・マザー]という、人をとどめる力を持つ宗教。`;
                    break;
                case 3:
                    str += `[明星神信仰]という、楽しさをとどめる力を持つ宗教。`;
                    break;
                case 4:
                    str += `[富豪の灯台]という、populationを犠牲にeconomyを上げる宗教。`;
                    break;
                case 5:
                    str += `[永劫回帰]という、ランダムにイベントを起こし続ける宗教。`;
                    break;
            }
        } else {
            switch (Deck.skill.pow[Which]) {
                case 0:
                    str += strsta[Deck.skill.num1[Which][0]] + `のステータスを[` + Deck.skill.num1[Which][1] + `]から[` + Deck.skill.num2[Which][1] + `]までの乱数で上げる。`;
                    break;
                case 1:
                    str += `カードを` + or(Which);
                    break;
                case 2:
                    str += `もし` + strsta[Deck.skill.num1[Which][0]] + `が[` + Deck.skill.num1[Which][1] + `%]以下であれば、` + strsta[Deck.skill.num2[Which][0]] + `を[` + Deck.skill.num2[Which][1] + `]追加する。`;
                    break;
                case 3:
                    str += strsta[Deck.skill.num1[Which][0]] + `のステータスを[` + Deck.skill.num1[Which][1] + `%]未満に減らないようにする。`;
                    break;
                case 4:
                    str += Addreturn(Which);
                    break;
                case 5:
                    str += strsta[Deck.skill.num1[Which][0]] + `のステータスを` + Deck.skill.num1[Which][1] + `倍にする。`;
                    break;
                case 6:
                    str += `もし` + strsta[Deck.skill.num1[Which][0]] + `が[` + Deck.skill.num1[Which][1] + `%]以上であれば、` + strsta[Deck.skill.num2[Which][0]] + `を[` + Deck.skill.num2[Which][1] + `]追加する。`;
                    break;
                case 7:
                    str += `イベントを[` + Deck.skill.num2[Which][1] + `]ターンの間、受け付けなくなる。`;
                    break;
                case 8:
                    str += `このカードを使用する前に[No.` + Deck.skill.num1[Which][1] + ` ` + Deck.name[Deck.skill.num1[Which][1]] + `]を使用していれば、` + strsta[Deck.skill.num2[Which][0]] + `を[` + Deck.skill.num2[Which][1] + `]追加する。`;
                    break;
            }
        }
    } else {
        str = Deck.skill.kinds[Which];
    }

    //こんなところに出力処理発見！
    return str;
}

/**
 * スタート画面を表示する関数
 */
function starting() {
    //アニメーションが終わったら表示を消したりしてる
    const spinner = document.getElementById('set');
    spinner.className = "set fade-out";
    spinner.addEventListener('animationend', () => {
        spinner.style.display = "none";
    })
}

/**
 * クリック音の関数
 */
function SoundPlay() {
    document.getElementById('sound').currentTime = 0; //連続クリックに対応
    document.getElementById('sound').play(); //クリックしたら音を再生
}

//初期化処理
/**
 * データ読み込みの関数
 */
async function SetData() {
    //殺　戮　現　場//

    //変数宣言//
    /**gasの死体１　 キャラクターのスプレッドシートデータ*/
    const apiURL = 'https://script.google.com/macros/s/AKfycbxGusMSziC4hyJAFRXxdtRoNTMGuZ9XpVOM51sIoO_tBEQaJH8bw2g4j-8xnJWZTXXzhA/exec';
    /**gasの死体２   カードのスプレッドシートデータ*/
    const apiURL_deck = 'https://script.google.com/macros/s/AKfycbyUi9YKGJuE738FCKjCbt_UVl0MpDxE7AGGC9tMCZu_DmhP9cuL-iCEeN_hgdyCp0yJ-Q/exec';
    /**gasの死体３　　実績のスプレッドシートデータ */
    const apiURL_record = 'https://script.google.com/macros/s/AKfycbwTRo93vT8xyEP1zE8WxlLABR7TY8G8-oSsR96aIJIqKCzqgfqtMe9q8LvcHTq1HnE1Tw/exec';
    /**gasの死体４　　フィードバックのスプレッドシートデータ */
    const apiURL_FeedBack = 'https://script.google.com/macros/s/AKfycbyR5H2WFJQmyjhCSwqKRaylF1KSAwrzZVFwDnSPodVjSEIcb1Ohahi_B1ciRN7B5RQTKg/exec';
    /**gasの死体５　　PDFのスプレッドシートデータ */
    const apiURL_PDF = 'https://script.google.com/macros/s/AKfycbwwEPU9HkE6v0he-z-PdJcxrA8rteF-ofRP5rOy_kGPt32KbszXwfgdq_4bZzpzvHzM/exec';
    /**死体処理班１　一回適当な変数においておく */
    const response1 = await fetch(apiURL);
    /**死体処理班２　一回適当な変数においておく */
    const response2 = await fetch(apiURL_deck);
    /**死体処理班３　一回適当な変数においておく */
    const response3 = await fetch(apiURL_record);
    /**死体処理班４　一回適当な変数においておく */
    const response4 = await fetch(apiURL_FeedBack);
    /**死体処理班５　一回適当な変数においておく */
    const response5 = await fetch(apiURL_PDF);
    /**ここでやっとクリア１　キャラクターのデータ羅列 */
    const data = await response1.json();
    /**ここでやっとクリア２　カードのデータ羅列 */
    const deck = await response2.json();
    /**ここでやっとクリア３　実績のデータ羅列 */
    const record = await response3.json();
    /**ここでやっとクリア４　フィードバックのデータ羅列 */
    const feed = await response4.json();
    /**ここでやっとクリア５　PDFのデータ羅列 */
    const PDF_Data = await response5.json();

    //push祭りじゃー！//
    /*キャラクターソイ！*/
    for (var i = 0; i < data.length; i++) {
        Serect.Name.push([data[i].en_name, data[i].jp_name]);
        Serect.OnePoint.push([data[i].en_one, "-" + data[i].jp_one + "-"]);
        Serect.Img.push(data[i].img);
        Serect.Info.Char.push(data[i].info);
        Serect.Info.Unlock.push(data[i].lock);
        Serect.Info.Path.push(data[i].path);
        Serect.Info.skill.push([data[i].skillname, data[i].skillinfo]);
        Serect.Info.deckInfo.push(data[i].deckinfo);
        Serect.Info.deck.push(data[i].deck);
        DateString.push("save" + (i + 1));
    }
    /*カードーソイ！*/
    for (var i = 0; i < deck.length; i++) {
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
        Deck.skill.num1.push([deck[i].s_kn1, deck[i].s_n1]);
        Deck.skill.num2.push([deck[i].s_kn2, deck[i].s_n2]);
    }
    /*カードがいつ初めて出てきたかを読み取る繰り返し処理*/
    for (var i = 0; i < Deck.num.length; i++) {
        var temp = [];
        for (var j = 0; j < Serect.Img.length; j++) {
            for (var k = 0; k < 32; k++) {
                if (Serect.Info.deck[j][k] === i) {
                    console.log(i, j, k);
                    temp.push(j);
                }
            }
        }
        Deck.first.push(temp);
    }
    console.log(feed);
    for (var i = 0; i < feed.length; i++) {
        if (feed[i][2] !== "") {
            FeedBack.name.push(feed[i][0]);
            FeedBack.q.push(feed[i][1]);
            FeedBack.a.push(feed[i][2]);
        }
    }
    console.log(Deck.first);
    console.log(Serect.Info.deck);
    /*実績ソイ！ */
    for (var i = 0; i < record.length; i++) {
        Trophy.img.push(record[i].img);
        Trophy.num.push(record[i].num);
        Trophy.name.push(record[i].name);
        Trophy.lock.push(record[i].lock);
        Trophy.Unlock.push(record[i].pass);
    }
    /*PDFソイ！ */
    for (var i = 0; i < PDF_Data.length; i++) {
        PDF.push([PDF_Data[i][0], PDF_Data[i][1], 0]);
    }
}

//セーブ処理
/**
 * ローカルストレージにぶち込む関数
 */
function save() {
    console.log(DateString, Date);
    for (var i = 0; i < Date.length; i++) {
        localStorage.setItem(DateString[i], Date[i]);
    }
    for (var i = 0; i < Trophy.Unlock.length; i++) {
        if (Trophy.Unlock[i] == 1) {
            localStorage.setItem("record" + i, 1);
        }
    }
    for (var i = 0; i < PDF.length; i++) {
        if (PDF[i][2] == 1) {
            localStorage.setItem("pdf" + i, 1);
        }
    }
}

//ロード処理
/**
 * ローカルストレージから呼び出す関数
 */
function Lode() {
    console.log(Date + "::" + Serect.Info.Unlock);
    for (var i = 0; i < Date.length; i++) {
        Date[i] = localStorage.getItem(DateString[i]);
        if (Date[i] == null && i < 4) {
            Date[i] = 1;
        } else if (Date[i] == null) {
            Date[i] = 0;
        }
        if (Date[i] == 1) {
            Serect.Info.Unlock[i] = 1;
        }
    }
    for (var i = 0; i < Trophy.Unlock.length; i++) {
        if (localStorage.getItem("record" + i) == 1) {
            Trophy.Unlock[i] = 1;
        }
    }
    for (var i = 0; i < PDF.length; i++) {
        if (localStorage.getItem("pdf" + i) == 1) {
            PDF[i][2] = 1;
        }
    }
    console.log(Date + "::" + Serect.Info.Unlock);
}

var open = [];

/**
 * シークレットキャラクター追加
 */
function Htmlplus() {
    const html = document.getElementById("char-all");
    var contentNode;
    for (i = 29; i < Serect.Name.length; i++) {
        var content1 = `<div class="box">
        <picture><img class="box-img char" onclick="Click(`+ i + `)" `
        var content2 = `src="` + Serect.Img[i] + `"></picture>
        <figcaption class="char_f">`+ Serect.Name[i][0] + `</figcaption>
        </div>
        `
        contentNode = document.createRange().createContextualFragment(content1 + content2);
        if (Date[i] == 1 || Serect.Info.Unlock[i] == 1) {
            if (open[i - 29] != 1) {
                html.appendChild(contentNode);
                open[i - 29] = 1;
            }
        }
    }
}

/**
 *  左右キーへの許可
 */
function Lockreturn() {
    var on = 0;
    for (i = 29; i < Serect.Img.length; i++) {
        if (Serect.Info.Unlock[i] == 1) {
            on++;
        }
    }
    return on;
}

/**
 * ロードの開始処理
 */
async function awaitSetting() {
    onLode(0);
    await SetData();
    console.log(Date + "::" + Serect.Info.Unlock);
    setHtml();
    setRecord();
    setDictionaly();
    setFeed();
    setPDF();
}

/**
 * カードの登場分岐
 * @param {number} num カード番号
 */
function Ifcard(num) {
    for (var i = 0; i < Deck.first.length; i++) {
        if (Serect.Info.Unlock[Deck.first[num][i]] == 1) {
            return 1;
        }else if(Deck.num[num]>999&&Deck.num[num]!=9999){
            if(Deck.num[num]==1006&&Serect.Info.Unlock[27] == 1){
                return 1;
            }else if(Deck.num[num]==1000){
                if(Serect.Info.Unlock[27] == 1||Serect.Info.Unlock[22] == 1){
                    return 1;
                }
            }else{
                if(Serect.Info.Unlock[28] == 1||Serect.Info.Unlock[23] == 1){
                    return 1;
                }
            }
        }
    }
    return 0;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*/*//*実体としてhtmlから実行される処理群*//*/*/

/**セーブデータ消去 */
function Reset() {
    SoundPlay();
    //確認アラート
    var result = window.confirm('本当にデータを消去しますか？');
    if (result == true) {
        //実際の消去
        localStorage.clear();
        alert('消去しました。');
        window.location.reload();
    }
}

/**パスコード確認 */
function PassCode() {
    SoundPlay();
    //変数宣言//
    /**解放できた時のフラッグ */
    var check;
    /**パスコード入力場所のID */
    const pass = document.getElementById('word');
    /**全キャラ解放フラグ */
    var flag = 1;

    //パスコードの確認
    if (pass.value == "all-open!!") {
        //デバック用の全開放パスコード
        for (var i = 0; i < Serect.Img.length; i++)
            Serect.Info.Unlock[i] = 1;
        for (var i = 0; i < Trophy.Unlock.length; i++)
            Trophy.Unlock[i] = 1;
        LockCheck();
        alert("let's go!!");
        for (var i = 0; i < Serect.Img.length; i++)
            Date[i] = 1;
        check = 1;
    } else if (pass.value !== "" && pass.value !== "leftside-haklave-engel" && pass.value !== "rightside-kelebrim-devil") {
        //落穂拾いみたいに確認は丁寧にね。
        for (var i = 4; i < Serect.Info.Unlock.length; i++) {
            if (pass.value == Serect.Info.Path[i]) {
                Serect.Info.Unlock[i] = 1;
                LockCheck();
                alert('キャラクター開放：[' + Serect.Name[i][0] + ']が、解放されました。');
                Date[i] = 1;
                check = 1;
            }
        }
    }
    //パスコード解放以外のキャラ
    if (Date[22] != 1 && Serect.Info.Unlock[6] === Serect.Info.Unlock[14] && Serect.Info.Unlock[14] === Serect.Info.Unlock[20] && Serect.Info.Unlock[20] === 1) {
        Serect.Info.Unlock[22] = 1;
        LockCheck();
        alert('キャラクター開放：[' + Serect.Name[22][0] + ']が、解放されました。');
        Date[22] = 1;
        check = 1;
    }
    if (Date[24] != 1 && Serect.Info.Unlock[7] === Serect.Info.Unlock[11] && Serect.Info.Unlock[11] === Serect.Info.Unlock[23] && Serect.Info.Unlock[23] === 1) {
        Serect.Info.Unlock[24] = 1;
        LockCheck();
        alert('キャラクター開放：[' + Serect.Name[24][0] + ']が、解放されました。');
        Date[24] = 1;
        Serect.Info.Unlock[25] = 1;
        LockCheck();
        alert('キャラクター開放：[' + Serect.Name[25][0] + ']が、解放されました。');
        Date[25] = 1;
        check = 1;
    }
    if (pass.value == "leftside-haklave-engel") {
        alert('キャラクター:左側は、技術を表す。');
        Date[27] = 2;
        check = 1;
    }
    if (pass.value == "rightside-kelebrim-devil") {
        alert('キャラクター:右側は、知力を表す。');
        Date[28] = 2;
        check = 1;
    }
    if (Date[28] == Date[27] && Date[27] == '2') {
        Serect.Info.Unlock[27] = 1;
        Serect.Info.Unlock[28] = 1;
        LockCheck();
        alert('キャラクター開放：[最高の守護神タッグ]が、解放されました。');
        Date[27] = 1;
        Date[28] = 1;
        check = 1;
    }

    for (i = 0; i < 29; i++) {
        if (Serect.Info.Unlock[i] != 1) {
            flag = 0;
        }
    }

    if (flag == 1 && Date[29] == 0) {
        Serect.Info.Unlock[29] = 1;
        alert('キャラクター開放：シークレットキャラ[' + Serect.Name[29][0] + ']が、解放されました。');
        Date[29] = 1;
        LockCheck();
        check = 1;
    }

    console.log("ini");
    for (var i = 0; i < Trophy.num.length; i++) {
        if (Trophy.Unlock[i] == pass.value && Trophy.Unlock[i] != 1 && Trophy.Unlock[i] !== "") {
            Trophy.Unlock[i] = 1;
            alert('実績開放：実績[No.' + Trophy.num[i] + '  ' + Trophy.name[i] + ']が、解放されました。');
            save();
            LockCheck();
            check = 1;
        }
        var lock = 0;
        if (Serect.Info.Unlock[i] == 1) {
            lock++;
        }
    }

    for (var i = 0; i < PDF.length; i++) {
        if (pass.value == PDF[i][0] && PDF[i][2] != 1) {

            PDF[i][2] = 1;
            check = 1;
        }
    }

    Htmlplus();

    /*        if (lock > 6) {
                if (lock > 11) {
                    if (lock == Trophy.Unlock.length - 1) {
    
                    } else {
    
                    }
                } else {
    
                }*/

    //解放失敗処理
    if (check != 1) {
        LockCheck();
        alert('失敗：パスコード認証に失敗しました。');
    }

    //セーブ
    save();

    //リセット処理
    check = 0;
    pass.value = "";
    pass.focus();
    console.log("ininini");
}

/**
 * キャラクターのクリック後の表示処理
 * @param {number} Who キャラクター番号
 */
function Click(Who) {
    if (LookMode == 0) {
        SoundPlay();
        //キャラクターの場所を代入
        char_P = Who;

        //表示消去か否か
        if (Who != undefined) {
            Switch(1);
            char_F = 1;
            ImgChenge(Who);
            if (Serect.Info.Unlock[Who] >= 1) {
                //解放済み
                SetCard(Who);
                TextInto(Who);
                char = Who;
            } else {
                //未開放
                Locked(Who);
            }
        } else {
            //キャラクター選択画面に戻る
            Switch(0);
            char_F = 0;
            int = 0;
            char = Who;
            resetCard();
        }
    }
}

/**
 * カード図鑑のクリック後の表示処理
 * @param {number} Which カード番号
 */
function Dictionaly(Which) {
    Dictionaly_P = Which;
    const HTML = document.getElementById('card-dictionaly-info');
    for (var i = 0; i < Deck.num.length; i++) {
        if (i == Which) {
            document.getElementById('dictionaly' + i).style.borderColor = "rgba(100, 230, 200, 0.8)";
            document.getElementById('dictionaly' + i).style.borderWidth = "4px";
            document.getElementById('dictionaly' + i).style.margin = "4px";
        } else {
            document.getElementById('dictionaly' + i).style.borderColor = "rgba(200, 170, 20, 0.8)"
            document.getElementById('dictionaly' + i).style.borderWidth = "2px";
            document.getElementById('dictionaly' + i).style.margin = "6px";
        }
    }
    if (Ifcard(Which) === 1) {
        HTML.innerHTML = `<div id="cardinfo"><img src="` + Deck.img[Which] + `" class="box-img" style="float:left;height:75px"><h2 style="color:rgb(210,210,210);float:left;">CardNo.` + (Deck.num[Which] + 1) + `,` + Deck.name[Which] + `</h2>
        <br><br><br><br><h4>
        <span style="color:#abff5d">trust `+ Deck.sta.trust[Which] + `</span>
        <span style="color:#84FFEF">joy `+ Deck.sta.joy[Which] + `</span>
        <span style="color:#ff88ed">population `+ Deck.sta.population[Which] + `</span>
        <span style="color:#fd5252">force `+ Deck.sta.force[Which] + `</span>
        <span style="color:#f5ff70">economy `+ Deck.sta.economy[Which] + `</span>
        </h4>
        <h4 style="color:rgb(100,200,230);">`+ SwitchSkill(Which) + `</h4>
        <h5 style="color:rgb(230,170,100)">[`+ Deck.info[Which] + `]</h5>
        <h6 style="color:rgb(250,250,250)">`+ Deck.card[Which] + `</h6></div>`;
    } else {
        HTML.innerHTML = `<div id="cardinfo"><img src="./game-body/Img/action/locked-box.png" class="box-img" style="float:left;height:75px">
        <h2 style="color:rgb(210,210,210);float:left;">未開放</h2>
        </div>
        `;
    }
}

/**
 * カードのクリック後の表示処理
 * @param {number} Which カードの種類
 * @param {number} i カードの場所
 */
function ClickCard(Which, i) {
    if (LookMode == 0) {
        //フラッグ処理とカードの番号代入
        card_F = 1;
        card_P = i;
        SoundPlay();
        /**表示場所ID取得 */
        const action = document.getElementById("action");
        resetCard();
        //ディスプレイ表示処理
        char_button.style.display = "none";
        chars.Enter.style.display = "none";
        card_button.style.display = "block";
        /**追加の要素関数 */
        const content = document.createRange().createContextualFragment(
            `<div id="cardinfo"><img src="` + Deck.img[Which] + `" class="box-img" style="height:75px"><h2 style="color:rgb(210,210,210);">DeckNo.` + (i + 1) + `<br>CardNo.` + (Deck.num[Which] + 1) + `,` + Deck.name[Which] + `</h2><h4>
        <span style="color:#abff5d">trust `+ Deck.sta.trust[Which] + `</span><br>
        <span style="color:#84FFEF">joy `+ Deck.sta.joy[Which] + `</span><br>
        <span style="color:#ff88ed">population `+ Deck.sta.population[Which] + `</span><br>
        <span style="color:#fd5252">force `+ Deck.sta.force[Which] + `</span><br>
        <span style="color:#f5ff70">economy `+ Deck.sta.economy[Which] + `</span>
        </h4>
        <h4 style="color:rgb(100,200,230);">`+ SwitchSkill(Which) + `</h4>
        <h5 style="color:rgb(230,170,100)">[`+ Deck.info[Which] + `]</h5>
        <h6>`+ Deck.card[Which] + `</h6></div>`
        );
        //実際の追加
        action.appendChild(content);
    }
}

/**
 * カードの消去
 */
function RemoveCard() {
    if (LookMode == 0) {
        //フラッグ処理
        card_F = 0;
        SoundPlay();
        const rem = document.getElementById("cardinfo");
        rem.remove();

        //ディスプレイ表示処理
        chars.Enter.style.display = "block";
        char_button.style.display = "block";
        card_button.style.display = "none";

        SetCard(char);
    }
}

/**
 * ロードの終了処理
 */
async function Setting() {
    await awaitSetting();
    Lode();
    LodeID();
    Htmlplus();
    LockCheck();
    save();
    onLode(1);
}

/**
 * オーディオ、キャラクター選択画面を開始する処理
 */
function start() {
    starting();
    //オーディオ再生
    if (OK != 1) {
        var audio = new Audio('ホーム音楽1.mp3');
        audio.loop = true;
        audio.play();
    }
    OK = 1;
    //ディスプレイの処理
    dis.className = "";
    card_button.style.display = "none";
}

/**
 * 閲覧モードの変更
 * @param {Number} mode 閲覧モードの番号
 */
function LookChange(mode) {
    SoundPlay();
    LookMode = mode;
    var content = [document.getElementById('char-all'),
    document.getElementById('record'),
    document.getElementById('card-dictionaly'),
    document.getElementById('pdf'),
    document.getElementById('comuni'),
    document.getElementById('Feedback')];
    for (var i = 0; i < content.length; i++) {
        if (mode != i) {
            content[i].style.display = "none";
        } else {
            content[i].style.display = "block";
        }
    }
}


//ロードスタート
dis.className = "Lode_dis";
Setting();

////////////////////////////////////////////////////////////////////////////////////////////
/*キー動作                                                                                */
////////////////////////////////////////////////////////////////////////////////////////////

/**
 * 右左キーでの操作処理
 */
document.addEventListener('keydown', (event) => {
    if (LookMode == 0) {
        if (card_F == 1) {
            //カードフラッグが立ったとき
            if (event.key == "ArrowLeft" && card_P != 0) {
                SoundPlay();
                //左移動
                RemoveCard();
                ClickCard(Serect.Info.deck[char_P][card_P - 1], card_P - 1);
            } else if (event.key == "ArrowRight" && card_P != 31) {
                SoundPlay();
                //右移動
                RemoveCard();
                ClickCard(Serect.Info.deck[char_P][card_P + 1], card_P + 1);
            }
        } else if (char_F == 1) {
            //キャラクターフラッグが立ったとき
            if (event.key == "ArrowLeft" && char_P != 0) {
                SoundPlay();
                //左移動
                Switch(0);
                resetCard();
                Click(char_P - 1);
            } else if (event.key == "ArrowRight" && char_P != 28 + Lockreturn()) {
                SoundPlay();
                //右移動
                Switch(0);
                resetCard();
                Click(char_P + 1);
            }
        }
    } else if (LookMode == 1) {
        if (event.key == "ArrowLeft" && Record_P != 0) {
            SoundPlay();
            recordHTML(Record_P - 1);
        } else if (event.key == "ArrowRight" && Record_P != Trophy.Unlock.length - 1) {
            SoundPlay();
            recordHTML(Record_P + 1);
        } else {
            recordHTML(Record_P);
        }
    } else if (LookMode == 2) {
        if (event.key == "ArrowLeft" && Dictionaly_P != 0) {
            SoundPlay();
            Dictionaly(Dictionaly_P - 1);
        } else if (event.key == "ArrowRight" && Dictionaly_P != Deck.num.length - 1) {
            SoundPlay();
            Dictionaly(Dictionaly_P + 1);
        } else {
            Dictionaly(Dictionaly_P);
        }
    }
});

/**
 * エンターキーで入力する処理
 */
document.addEventListener('keydown', (event) => {
    if (event.key == "Enter" && char_F == 0 && OK == 1) {
        SoundPlay();
        PassCode();
    }
});

/**
* 拡大縮小禁止
*/
document.documentElement.addEventListener('touchstart', function (e) {
    if (e.touches.length >= 2) { e.preventDefault(); }
}, { passive: false });