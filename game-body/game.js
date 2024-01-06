/**スマホのオーディオハウリング防止 */
var OK = 0;
/**ターン数*/
var turn = 0;
/**文章の一時的保存*/
var temp;
/**カードを選んでいいか*/
var cardOk = 0;
/**カードを選んでいいか（モード変更）*/
var modeOk = 0;
/**文章ログ*/
var StrRog = "";
/**カード選択ログ*/
var CardRog = [];
/**文字だけで使うフォーカス*/
const strsta = [`[trust]`, `[joy]`, `[population]`, `[force]`, `[economy]`];
/**カードセッティング*/
var NumSetting = [0, 0];
/**宗教番号*/
var Religion = ["", "", ""];
/**ドロー枚数*/
var drow = 3;
/**ターンフラッグ */
var Turnflag = 0;
/**ゲームオーバーフラッグ */
var gameover = 0;
/**場に出ているカードを取得 */
var cardPosi = [0, 0, 0];
/**数値管理のステータス履歴 */
var Old_sta = [0, 0, 0, 0, 0];
/**最少を管理する変数 */
var Stamin = [-100, -100, -100, -100, -100];
/**王のスキルを発動するフラグ */
var Kingflag = 1;

//ID取得

/**
 * イベント用オブジェクト
 */
var ExEvent = {
  /**発生率 */
  probability: 0,
  /**停止ターン */
  stop: 0,
  /**クリア判定 */
  clear: 0,
}

/**
 * 継続効果用オブジェクト
 */
var Never = {
  num: [],
  /**画像パス */
  img: [],
  /**発動確率 */
  Probability: [],
  /**継続ターン */
  turn: [],
  /**カード名 */
  name: [],
  /**スキル */
  skill: {
    pow: [],
    num1: [],
    num2: []
  },
  Push: function (num, probability, turn) {
    Never.num.push(num);
    Never.img.push(Deck.img[num]);
    Never.Probability.push(probability);
    Never.turn.push(turn);
    Never.name.push(Deck.name[num]);
    Never.skill.num1.push(Deck.skill.num1[num]);
    Never.skill.num2.push(Deck.skill.num2[num]);
    Never.skill.pow.push(Deck.skill.pow[num]);
  },

  Switch: {
    Religion: function () {
      if (Religion[0] !== "") {
        this.String += "<span class=\"txtO\">[宗教効果]</span>:";
        switch (Religion[0]) {
          case 0:
            Sta.force += 3;
            this.String += "[force]が３上昇した。<br><br>";
            break;
          case 1:
            Sta.joy += 3;
            this.String += "[force]が３上昇した。<br><br>";
            break;
          case 2:
            if (Sta.population < 0) {
              Sta.population = 0;
            }
            this.String += "[population]は0%未満にならない。<br><br>";
            break;
          case 3:
            if (Sta.joy < 30) {
              Sta.joy = 30;
            }
            this.String += "[joy]は30%未満にならない。<br><br>";
            break;
          case 4:
            Sta.population -= 3;
            Sta.economy += 4;
            this.String += "[population]を-3して、[economy]を+4する。<br><br>";
            break;
          case 5:
            ExEvent.probability = 100;
            this.String += "イベント発生確率が100%になった。<br><br>";
            break;
        }
      }
    },
    Action: function (num) {
      this.String += "<span class=\"txtO\">" + Never.name[num] + "</span>:";
      if (Never.Probability[num] < 1000) {
        if (Never.Probability[num] >= Random.Integer(100) && Never.turn[num] !== 0) {
          switch (Never.skill.pow[num]) {
            case 0:
              var UpNum = Random.BetweenInteger(Never.skill.num1[num][1], Never.skill.num2[num][1]);
              switch (Never.skill.num1[num][0]) {
                case 0:
                  Sta.trust += UpNum;
                  break;
                case 1:
                  Sta.joy += UpNum;
                  break;
                case 2:
                  Sta.population += UpNum;
                  if (UpNum > 0 && Sta.Probability.pop[0] >= Random.Integer(100)) {
                    Sta.population += Sta.Probability.pop[1];
                    this.String += "<span class=\"txtI\">Info</span>:Joy増加のボーナスでpopulation増加量が<span class=\"txtP\">[+" + Sta.Probability.pop[1] + "]</span>増加した！<br>";
                  }
                  break;
                case 3:
                  Sta.force += UpNum;
                  break;
                case 4:
                  Sta.economy += UpNum;
                  break;
              }
              this.String += strsta[Never.skill.num2[num][0]] + "のステータスが[" + UpNum + "]上昇した。<br>";
              break;
            case 2:
              if (Sta.pic(Never.skill.num1[num][0]) <= Never.skill.num1[num][1]) {
                switch (Never.skill.num2[num][0]) {
                  case 0:
                    Sta.trust += Never.skill.num2[num][1];
                    break;
                  case 1:
                    Sta.joy += Never.skill.num2[num][1];
                    break;
                  case 2:
                    Sta.population += Never.skill.num2[num][1];
                    if (Sta.Probability.pop[0] >= Random.Integer(100)) {
                      Sta.population += Sta.Probability.pop[1];
                      this.String += "<span class=\"txtI\">Info</span>:Joy増加のボーナスでpopulation増加量が<span class=\"txtP\">[+" + Sta.Probability.pop[1] + "]</span>増加した！<br>";
                    }
                    break;
                  case 3:
                    Sta.force += Never.skill.num2[num][1];
                    break;
                  case 4:
                    Sta.economy += Never.skill.num2[num][1];
                    break;
                }
                this.String += strsta[Never.skill.num1[num][0]] + "が[" + Never.skill.num1[num][1] + "%]以下だった為、" + strsta[Never.skill.num2[num][0]] + "のステータスが[" + Never.skill.num2[num][1] + "]上昇する。";
              } else {
                this.String += strsta[Never.skill.num2[num][0]] + "のステータスが[" + Never.skill.num2[num][1] + "]上昇するはずだった";
                this.String += "が、<br>" + strsta[Never.skill.num1[num][0]] + "が[" + Never.skill.num1[num][1] + "%]以下でなかった…。";
              }
              break;
            case 3:
              Stamin[Never.skill.num1[0]] = Never.skill.num1[num][1];
              this.String += strsta[Never.skill.num1[num][0]] + "は、[" + Never.skill.num1[num][1] + "]未満に減らない。<br>";
              break;
            case 4:
              var flag = 0;
              var NumSwitch;
              if (Never.Probability[num] == 100 || Deck.num[Never.num[num]] == 63) {
                console.log(Never.name[num]);
                NumSwitch = Never.skill.num1[num][0];
              } else {
                NumSwitch = Never.skill.num2[num][0];
              }
              if (NumSwitch == 9) {
                NumSwitch = Religion[1];
                this.String += "宗教によって上昇するステータスが決まる。<br>";
              }
              if (Never.Probability[num] == 100 || Deck.num[Never.num[num]] != 63) {
                console.log("REGEND!!::" + NumSwitch);
                switch (NumSwitch) {
                  case 0:
                    if (Never.Probability[num] == 100) { Sta.trust += Never.skill.num1[num][1]; } else { Sta.trust += Never.skill.num2[num][1]; }
                    break;
                  case 1:
                    if (Never.Probability[num] == 100) { Sta.joy += Never.skill.num1[num][1]; } else { Sta.joy += Never.skill.num2[num][1]; }
                    break;
                  case 2:
                    if (Never.Probability[num] == 100) { Sta.population += Never.skill.num1[num][1]; } else { Sta.population += Never.skill.num2[num][1]; }
                    if (Sta.Probability.pop[0] >= Random.Integer(100)) {
                      Sta.population += Sta.Probability.pop[1];
                      this.String += "<span class=\"txtI\">Info</span>:Joy増加のボーナスでpopulation増加量が<span class=\"txtP\">[+" + Sta.Probability.pop[1] + "]</span>増加した！<br>";
                    }
                    break;
                  case 3:
                    if (Never.Probability[num] == 100) { Sta.force += Never.skill.num1[num][1]; } else { Sta.force += Never.skill.num2[num][1]; }
                    break;
                  case 4:
                    if (Never.Probability[num] == 100) { Sta.economy += Never.skill.num1[num][1]; } else { Sta.economy += Never.skill.num2[num][1]; }
                    break;
                  default:
                    flag = 1;
                }
                if (flag != 1) {
                  this.String += strsta[NumSwitch] + "のステータスが[";
                  if (Never.Probability[num] == 100) {
                    this.String += Never.skill.num1[num][1];
                  } else {
                    this.String += Never.skill.num2[num][1];
                  }
                  this.String += "]上昇する。<br>";
                }
              }
              flag = 0;
              NumSwitch = Never.skill.num2[num][0];
              if (NumSwitch == 9) {
                NumSwitch = Religion[2];
                this.String += "宗教によって減少するステータスが決まる。<br>";
              }
              if (Never.Probability[num] == 100 || Deck.num[Never.num[num]] == 63) {
                switch (NumSwitch) {
                  case 0:
                    Sta.trust -= Never.skill.num2[num][1];
                    break;
                  case 1:
                    Sta.joy -= Never.skill.num2[num][1];
                    break;
                  case 2:
                    Sta.population -= Never.skill.num2[num][1];
                    break;
                  case 3:
                    Sta.force -= Never.skill.num2[num][1];
                    break;
                  case 4:
                    Sta.economy -= Never.skill.num2[num][1];
                    break;
                  default:
                    flag = 1;
                }
                if (flag != 1) {
                  this.String += strsta[Never.skill.num2[num][0]] + "のステータスが[" + Never.skill.num2[num][1] + "]減少してしまう。<br>";
                }
              }
              flag = 0;
              break;
            case 6:
              if (Sta.pic(Never.skill.num1[num][0]) >= Never.skill.num1[num][1]) {
                switch (Never.skill.num2[num][0]) {
                  case 0:
                    Sta.trust += Never.skill.num2[num][1];
                    break;
                  case 1:
                    Sta.joy += Never.skill.num2[num][1];
                    break;
                  case 2:
                    Sta.population += Never.skill.num2[num][1];
                    if (Sta.Probability.pop[0] >= Random.Integer(100)) {
                      Sta.population += Sta.Probability.pop[1];
                      this.String += "<span class=\"txtI\">Info</span>:Joy増加のボーナスでpopulation増加量が<span class=\"txtP\">[+" + Sta.Probability.pop[1] + "]</span>増加した！<br>";
                    }
                    break;
                  case 3:
                    Sta.force += Never.skill.num2[num][1];
                    break;
                  case 4:
                    Sta.economy += Never.skill.num2[num][1];
                    break;
                }
                this.String += strsta[Never.skill.num1[num][0]] + "が[" + Never.skill.num1[num][1] + "%]以上だった為、" + strsta[Never.skill.num2[num][0]] + "のステータスが[" + Never.skill.num2[num][1] + "]上昇する。";
              } else {
                this.String += strsta[Never.skill.num2[num][0]] + "のステータスが[" + Never.skill.num2[num][1] + "]上昇するはずだった";
                this.String += "が、<br>" + strsta[Never.skill.num1[num][0]] + "が[" + Never.skill.num1[num][1] + "%]以上でなかった…。";
              }
            case 100:
              if (Sta.population < -20) {
                Sta.population = -20;
              }
              Sta.trust -= 3;
              this.String += "[population]は-20以下にならないが、[trust]が-3ずつされてしまう。<br>";
              break;
            case 101:
              if (Never.turn[num] == 2) {
                this.String = "次のターンに[population]が" + Sta.population + "以下に減少しない。";
                Old_sta[2] = Sta.population;
              } else if (Sta.population < Old_sta) {
                this.String = "[population]が前ターンの数値に戻る。<br>";
              } else {
                this.String = "[population]が増加したので何も起きない。<br>";
              }
              break;
            case 102:
              this.String += "【獰猛な狼】の減少増加は反転され、二倍になっている。<br>";
              break;
            case 103:
              Sta.economy += Sta.population % 10 * 2;
              this.String += "[economy]が" + ((Sta.population % 10) * 2) + "上昇した。<br>";
              break;
            case 104:
              Sta.trust -= 1;
              Sta.population -= 1;
              Sta.economy += 4;
              this.String += "[trust]と[popultaion]が-1されて、[economy]が+4される。<br>";
              break;
            case 105:
              if (Sta.economy > 0) {
                Sta.force += 4;
                Sta.joy += 4;
                Sta.population += 4;
                Sta.trust += 4;
                Sta.economy += 4;
                this.String += "[economy]が0以下ではなかったので、全てのステータスを+4。<br>";
              } else {
                this.String += "[economy]が0以下だったため、このスキルは無効。<br>";
              }
              break;
            case 106:
              Never.Push(31, 100, "");
              var temp = Never.Probability.length;
              var flag = 0;
              this.String += "継続効果カードに[幸運を運ぶ虫]が追加された。<br>";
              if (Random.Integer(99) < 29) {
                for (var i = 0; i < temp; i++) {
                  if (Deck.num[Never.num[i]] == 150) {
                    Never.Push(31, 100, "");
                  }
                }
                this.String += "そして、[幸運を運ぶ虫]が3倍に増えた。";
              }
              break;
            case 107:
              this.String += Zatugaku[Random.Integer(Zatugaku.length - 1)] + "<br>";
              break;
            case 108:
              Sta.trust += 2;
              this.String += "[trust]が+2された。<br>";
              break;
          }
        } else if (turn > 0) {
          this.String += "確率失敗。<br>";
        }
      } else {
        switch (Never.Probability[num] % 1000) {
          case 0:
            Sta.population -= 1;
            Sta.force += 1;
            this.String += "ここにはまともなことを表示しないよ。イラっとさせるためだから、しょうがないね。<br>もしちゃんと効果知りたかったら、継続効果カードを確認する画面でカードをクリックするんだよ。<br>正直、そこにもちゃんとした効果がちゃんと書いてあるかって聞かれると微妙だよ。<br>他の継続効果カードの文章がみずらくなっちゃったね。乙。<br>";
            break;
          case 1:
            Sta.trust -= 4;
            Sta.joy += 1;
            Sta.population += 1;
            Sta.force += 1;
            Sta.economy += 1;
            this.String += "[trust]が-4された代わりに、それ以外が+1された。<br>";
            break;
          case 2:
            Sta.trust += 1;
            Sta.joy -= 4;
            Sta.population += 1;
            Sta.force += 1;
            Sta.economy += 1;
            this.String += "[joy]が-4された代わりに、それ以外が+1された。<br>";
            break;
          case 3:
            Sta.trust += 1;
            Sta.joy += 1;
            Sta.population -= 4;
            Sta.force += 1;
            Sta.economy += 1;
            this.String += "[population]が-4された代わりに、それ以外が+1された。<br>";
            break;
          case 4:
            Sta.trust += 1;
            Sta.joy += 1;
            Sta.population += 1;
            Sta.force -= 4;
            Sta.economy += 1;
            this.String += "[force]が-4された代わりに、それ以外が+1された。<br>";
            break;
          case 5:
            Sta.trust += 1;
            Sta.joy += 1;
            Sta.population += 1;
            Sta.force += 1;
            Sta.economy -= 4;
            this.String += "[economy]が-4された代わりに、それ以外が+1された。<br>";
            break;
          case 6:
            switch (Random.Integer(4)) {
              case 0:
                Sta.trust += 3;
                this.String += "[trust]";
                break;
              case 1:
                Sta.joy += 3;
                this.String += "[joy]";
                break;
              case 2:
                Sta.population += 3;
                this.String += "[population]";
                break;
              case 3:
                Sta.force += 3;
                this.String += "[force]";
                break;
              case 4:
                Sta.economy += 3;
                this.String += "[economy]";
                break;
            }
            this.String += "が+3された。<br>";
            break;
        }
      }
    },
    String: ""
  }
}

/**
 * 初めの導入ストーリの文章
 */
const string1 = [
  "君に今日から、国を作ってもらう。",
  "ああ、安心したまえ。<br>国への評価は可視化している。",
  "ほら、下に書いてあるだろう？<br>これが国の現在の姿だ。",
  "上から順に説明していくぞ？",
  "一番上、[TRUST]は「信頼」だ。<br>これが行動が100%行われるかどうかに関わってくる。",
  "因みに計算方法があるが…それは、How To Playの最後の<br>「詳しいあそびかた」のリンクから見てくれ。",
  "How To Playは、キャラクター選択画面の「How To Play」の右にあるアイコンから移行できるぞ。",
  "次に、[Joy]だ。<br>要は「楽しさ」だが…これはあまり関わってこない。",
  "一つ言えば、下がると[POPULATION]も下がりやすくなるという事のみだな。",
  "次が一番大事。[POPULATION]だ。「人口」だな。<br>これが-50%に達したらGame Overだ。バットエンドだな。",
  "しかし、[ECONOMY]が2ターン毎に[POPULATION]の割合でプラスされるんだ。",
  "[POPULATION]は上げといて損はない。",
  "次は[FORCE]だ。「勢力」だな。",
  "外との戦闘イベントの時に、勝率が上がるようになるぞ。",
  "これは直接的にはGame Overに関わってこない。<br>しかし、戦闘イベントに負けてしまうので上げといたほうが良い。",
  "最後に[ECONOMY]だ。直訳は経済だが、考え方は「予算」の方が正しい。",
  "国王が使える金だ。減りやすく、増えづらい。<br>よく考えて使うべきだ。",
  "確率とか、詳しい計算は「詳しいあそびかた」で確認してくれ。",
  "ゲームは2ターンを一日として移行していく。<br>君には取り敢えず30日間何事もなく、国王を務めてもらおうと思っているよ。",
  "進め方は簡単だ。上に三つあるカードを一つ選んでいくだけだ。<br>でも、ちゃんと考えねば「詰み」になるぞ。",
  "安心しろ、選択したカードは無くなりはしない。<br>デッキからカードを削除するのは、特有の効果の時のみ。",
  "真ん中の四つのアイコンについて説明しよう。",
  "一番左は、ストーリーを表示されている時に次に進める。<br>今もクリックしているだろう？",
  "役割はそれしかない。<br>表示されたまま動かなくなったら、大抵ここをクリックするとよい。",
  "左から二番目はログを表示する。<br>会話ログだけならず、効果のログも表示する。",
  "ただそれのみ。もし、今までの遍歴を見たいなら見るべきであろう。",
  "また、解放したパスを見たいときもクリックするとよいだろう。<br>…あ。パスの解説は後にする。",
  "右から二番目は「建造物確認」だ。<br>継続効果系統…まぁ継続効果に使ったカードだな。",
  "それらはここに表示されるようになる。<br>PCだとカーソルを上に置けば、どどのような継続効果なのかが分かる。",
  "一番右にあるのは、「ステータス確認」だ。<br>今のデフォルト表示だな。",
  "では次に、イベントと目標など、細かいところについて説明しよう。",
  "少し休憩しても良いぞ。<br>（つーか、この文章打ち込み地味につらいのよ？ by製作者）",
  "イベントについての説明だ。<br>イベントとは、そのままの意味だが…。",
  "まぁ、急に人口が減ったり、戦争が起きるものだと思ってくれ！",
  "次に目標だが、今さっきも言った通り、何事もなく30日間生き残る事だ。",
  "生き残れる条件は以下の通りだ。",
  "[1.populationが-50%以下ではない]<br>[2.ステータスのどれかが-100%に達していない]<br>[3.イベントなどの敗北条件を満たしていない]",
  "これを30日まで持続することがお主の目標だ。",
  "そうだ、「固有カード」について話していなかったな。",
  "「固有カード」という物があって、背景が四角形ではなく星形の物があっただろう？",
  "それを「固有カード」と呼ぶ。<br>癖は強いが、必ず逆転に使えるカードばかりだ。",
  "では、パスについての説明だ。<br>説明も、あと少しで終わる。",
  "パスでいろいろな収集機能が出来るぞ。<br>キャラ選択画面の上にある[pass]の右の赤い枠に入力する用のパスコードだ。",
  "ただ、少し問題があってな…？",
  "パスコードを打ち込む場面が多くなり過ぎるという欠点があってだな…？",
  "パスコードを使うのは主に、【キャラ開放】【キャラ文献開放】【実績解除】【イベント開放】の四つなのだが…。",
  "パット見分かる通り、多すぎるのだ…。",
  "だから一応、【キャラ開放】だけで100%クリアにはするつもりだ。<br>(それで勘弁してね。全部開放していただいたらマジうれしみ。がちで。 by製作者)",
  "なんとなーくルール説明は終わりだ。何かあれば、「詳しいあそびかた」か、「詳しいあそびかた」サイトの下の「質問コーナー」二でもぶん投げとくれ。",
  "それでは30日間よろしく頼むぞ。<br>時々顔は出すつもりだ。",
  "そうだな…BGMでも流そうか。<br>まったりやってくれ。"
];

const string2 = [
  "やぁ。",
  "もうあんなに長いルール説明はしないぞ？",
  "それじゃいつも通り、bgmを流そう。",
  "ごゆっくりどうぞ。"
]

const Zatugaku = [
  "命の重さは約21gらしい。",
  "「空を見ろ！」 「鳥だ！」 「飛行機だ！」 「いや、○○だ！」",
  "ベイクドモチョチョ。",
  "このゲームは、色々なフリー素材のおかげで作られています。私は、絵と音楽が無理なのです。",
  "作業時間より作業BGMを選ぶ時間が多かった。",
  "…きのこ派です。",
  "オブジェクト指向って最高。",
  "友人にイラスト製作者も音楽製作者もいるけど、ビビってるのと自分の技術に自信がないので声かけられない。",
  "こんなゲームに5ヶ月はさ、個人製作とはいえ制作速度が遅い気がする。",
  "ハムメロン。",
  "だめだ、書くことない。",
  "会話のネタがプログラミング系なの辞めたい。",
  "因みに個人製作だからデバックと保守は楽々だぜ。",
  "カード増やしてとか、実績増やしてとか、ちゃんと○○な感じでって指定があれば増やせます。ハイ。",
  "ほぼバランス調整してないからね、バランスがおかしいところあれば教えてください。",
  "[宇宙の理]ってなんだよ。",
  "私のお気に入りキャラは【KMos-GP-108】です。",
  "質問に変なの送るのは私以外の確認担当に弾かれます。だからといって送ってきていいわけでは無いよ。",
  "お、みってるー？",
  "次回作どうしようかなー。RPG想定で、セーブロード概念作って…。",
  "[スペシャルサンクス【Tech Runway】]<br>このゲームの技術を得るために通った高校生限定の無料で通えるプログラミング教室です。行かなきゃ損！",
  "2023/12/30 公開予定！もし公開遅れたら、泣く。",
  "クリスマスにこの作業してたら、「うわぁ…。」って目で見られたよ☆",
  "どんなことでもいい！フィードバックをくれ！！",
  "このゲームはmade by javascriptです。なんでjsで作ったんだろうね。不思議だね。",
  "このゲームに使われてるjavascriptはね、とっつき易い言語だからおすすめだよ。",
  "最近ハマってることは？で、「プログラミングです。」の使用率が高すぎる。",
  "視力が怖い。ここ最近は「人間としての生活 < PCの前にいる時間」だもの。",
  "これはデモです、ただのデモです。出来たらグループ開発になった時にリメイク出したい。",
  "デスクトップパソコンを欲せるほどの技術はまだないやい。",
  "さてはて、ゲームの開発者専用のパスワードを見つける人はいるんでしょうかね…。",
  "このカードの文章のバリエーションは【丁度】32個だよ!!"
]

var Id = {
  /**
 * 記述用id
 */
  talk: document.getElementById("talk"),
  /**
   * カード名表示用ID
   */
  Info: [
    document.getElementById("info_action1")
    , document.getElementById("info_action2")
    , document.getElementById("info_action3")
  ],
  /**
   * ステータスバーid
   */
  bar: [
    document.getElementById("tru-bar")
    , document.getElementById("joy-bar")
    , document.getElementById("pop-bar")
    , document.getElementById("for-bar")
    , document.getElementById("eco-bar")
  ],
  /**
   * ステータスボックスid
   */
  box: [
    document.getElementById("tru-box")
    , document.getElementById("joy-box")
    , document.getElementById("pop-box")
    , document.getElementById("for-box")
    , document.getElementById("eco-box")
  ],
  /**
   * アクションボタンid
   */
  action: [
    document.getElementById("action1")
    , document.getElementById("action2")
    , document.getElementById("action3")
  ],
  /**
   * カード用id
   */
  card: [
    document.getElementById("click1")
    , document.getElementById("click2")
    , document.getElementById("click3")
  ],
  /**
   * ステータスid
   */
  status: [
    document.getElementById("trust")
    , document.getElementById("joy")
    , document.getElementById("population")
    , document.getElementById("force")
    , document.getElementById("economy")
    , document.getElementById("status")
  ]
}

/**
 * ステータスのオブジェクト
 */
var Sta = {
  //ステータス変数の宣言
  trust: 50,
  joy: 50,
  population: 15,
  force: 15,
  economy: 25,
  Probability: {
    act: 95,
    pop: [20, 5],
    eco: 1,
    win: 57
  },
  /**
   * ステータス変数を数字で取り扱う
   * 
   * @param {number} ban ステータス変数の上から何番目かの指定
   * @returns {number} 選んだステータス変数の内容を引き出す
   */
  pic: function (ban) {
    var num;
    switch (ban) {
      case 0:
        num = Sta.trust;
        break;
      case 1:
        num = Sta.joy;
        break;
      case 2:
        num = Sta.population;
        break;
      case 3:
        num = Sta.force;
        break;
      case 4:
        num = Sta.economy;
        break;
    }
    return num;
  },
  /**
   * ステータスバーの変数との同期
   */
  bar: function () {
    var i, num;
    for (i = 0; i < 5; i++) {
      num = Sta.pic(i);
      if (num > 100) {
        switch (i) {
          case 0:
            Sta.trust = 100;
            break;
          case 1:
            Sta.joy = 100;
            break;
          case 2:
            Sta.population = 100;
            break;
          case 3:
            Sta.force = 100;
            break;
          case 4:
            Sta.economy = 100;
            break;
        }
      }
      if (num < Stamin[i]) {
        switch (i) {
          case 0:
            Sta.trust = Stamin[i];
            break;
          case 1:
            Sta.joy = Stamin[i];
            break;
          case 2:
            Sta.population = Stamin[i];
            break;
          case 3:
            Sta.force = Stamin[i];
            break;
          case 4:
            Sta.economy = Stamin[i];
            break;
        }
      }
      if (num > 0) {
        Id.bar[i].style.width = num / 2 + 50 + "%";
      } else if (num < 0) {
        num = Math.abs(num);
        Id.bar[i].style.width = 50 - (num / 2) + "%";
      } else {
        Id.bar[i].style.width = 50 + "%";
      }
    }
  },
  /**
   * ステータスボックスの変数との同期
   */
  box: () => {
    var i, num;
    for (i = 0; i < 5; i++) {
      num = Sta.pic(i);
      if (num > 100) {
        switch (i) {
          case 0:
            Sta.trust = 100;
            break;
          case 1:
            Sta.joy = 100;
            break;
          case 2:
            Sta.population = 100;
            break;
          case 3:
            Sta.force = 100;
            break;
          case 4:
            Sta.economy = 100;
            break;
        }
      }
      if (num < Stamin[i]) {
        switch (i) {
          case 0:
            Sta.trust = Stamin[i];
            break;
          case 1:
            Sta.joy = Stamin[i];
            break;
          case 2:
            Sta.population = Stamin[i];
            break;
          case 3:
            Sta.force = Stamin[i];
            break;
          case 4:
            Sta.economy = Stamin[i];
            break;
        }
      }
      Id.box[i].textContent = num + "%";
    }
  },
  /**
   * ステータスと確立を同期
   */
  ProSta: function () {
    Sta.Probability.act = 90 + Math.floor(Sta.trust / 10);
    Sta.Probability.pop[0] = 10 + Math.floor(Sta.joy / 5);
    Sta.Probability.pop[1] = Math.floor(Sta.joy / 10);
    Sta.Probability.eco = Math.floor(Sta.population / 10);
    if (Sta.Probability.eco < 0) {
      Sta.Probability.eco = 0;
    }
    Sta.Probability.win = 50 + Math.floor(Sta.force / 2);
  }
};

/**
 * キャラクターのステータス
 */
var King = {
  /**名前 */
  Name: 0,
  /**
   * 中央の欄に送る情報の構造体
   */
  Info: {
    skill: [],
    deck: 0
  }
}

/**
 * カードの情報を保存するオブジェクト
 */
const Deck = {
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
  /**画像 */
  img: []
}

/**
 * カード全部の情報を保存するオブジェクト
 */
const DictionaryCard = {
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
  /**画像 */
  img: []
}

const Switch = {
  /**
 * スキルの文章を送る関数
 * @param {number} Which カードの番号
 * @returns {string} htmlに表示される文字列
 */
  Skill: function (Which) {
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
            str += `宗教によって変わる。このカードでは、` + Switch.Trust(Which);
        }
      } else {
        switch (Deck.skill.kinds[Which]) {
          case 0:
            str += `即座に発動する。 効果は`;
            break;
          case 1:
            str += `永続的に発生する。 効果は`;
            break;
          case 2:
            str += `不定期で効果を出し続ける。 効果は`;
            break;
          case 3:
            str += `宗教を変更する。 宗教名は`;
            break;
          default:
            return `なし`;
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
            str += `カードを` + Switch.or(Which);
            break;
          case 2:
            str += `もし` + strsta[Deck.skill.num1[Which][0]] + `が[` + Deck.skill.num1[Which][1] + `%]以下であれば、` + strsta[Deck.skill.num2[Which][0]] + `を[` + Deck.skill.num2[Which][1] + `]追加する。`;
            break;
          case 3:
            str += strsta[Deck.skill.num1[Which][0]] + `のステータスを[` + Deck.skill.num1[Which][1] + `%]未満に減らないようにする。`;
            break;
          case 4:
            str += Switch.Addreturn(Which);
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
  },

  /**
 * カードのスキル文章（宗教依存）を送る関数
 * @param {number} Which カードの番号
 * @returns {string} スキル詳細の文字列 
 */
  Trust: function (Which) {
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
  },

  /**
  * カードのスキル文章（デッキのやり取り）を送る関数
  * @param {number} Which カードの番号
  * @returns {string} スキル詳細の文字列
  */
  or: function (Which) {
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
  },

  /**
  * カードのスキル文章（増加減少）を送る関数
  * @param {number} Which カードの番号
  * @returns {string} スキル詳細の文字列
  */
  Addreturn: function (Which) {
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
  },

  /**
   * スキル実行用分岐
   * @param {number} num スキルの番号
   */
  Action: {
    String: "",
    Skill: function (num) {
      console.log(Deck);
      switch (Deck.skill.kinds[num]) {
        case 0:
          Switch.Action.String = "このスキルの効果で";
          Switch.Action.Kinds(num, 0);
          break;
        case 1:
          Switch.Action.String = "今後、永続的にこのスキルの効果で";
          Switch.Action.Kinds(num, 1);
          break;
        case 2:
          Switch.Action.String = "このスキルの効果で永続的に[" + Deck.skill.num1[num][1] + "%]の確率で";
          Switch.Action.Pro(num);
          break;
        case 3:
          Switch.Action.String = "国として信仰する宗教を";
          switch (Deck.skill.num1[num][1]) {
            case 0:
              Switch.Action.String += `[グリフォス教団]という、Forceが上がり続ける宗教に変更する。`;
              Religion = [0, 3, ""];
              break;
            case 1:
              Switch.Action.String += `[トルネクル]という、Joyが上がり続ける宗教に変更する。`;
              Religion = [1, 1, ""];
              break;
            case 2:
              Switch.Action.String += `[イフ・マザー]という、人をとどめる力を持つ宗教に変更する。`;
              Religion = [2, 3, 0];
              break;
            case 3:
              Switch.Action.String += `[明星神信仰]という、楽しさをとどめる力を持つ宗教に変更する。`;
              Religion = [3, 1, 3];
              break;
            case 4:
              Switch.Action.String += `[富豪の灯台]という、populationを犠牲にeconomyを上げる宗教に変更する。`;
              Religion = [4, 3, 4];
              break;
            case 5:
              Switch.Action.String += `[永劫回帰]という、ランダムにイベントを起こし続ける宗教に変更する。`;
              Religion = [5, "", ""];
              break;
          }
          break;
        case 4:
          play("閉幕。");
          setTimeout(() => {
            window.location.reload();
          }, 1500);
          break;
        default:
          this.Original(Deck.num[num], num);
          break;
      }
    },
    Kinds: function (num, kinds) {
      if (kinds == 1) {
        Switch.Action.String += "毎ターン次の効果がそのまま発動される。<br>"
      }
      switch (Deck.skill.pow[num]) {
        case 0:
          var UpNum = Random.BetweenInteger(Deck.skill.num1[num][1], Deck.skill.num2[num][1]);
          switch (Deck.skill.num1[num][0]) {
            case 0:
              Sta.trust += UpNum;
              break;
            case 1:
              Sta.joy += UpNum;
              break;
            case 2:
              Sta.population += UpNum;
              if (UpNum > 0 && Sta.Probability.pop[0] >= Random.Integer(100)) {
                Sta.population += Sta.Probability.pop[1];
                this.String += "<span class=\"txtI\">Info</span>:Joy増加のボーナスでpopulation増加量が<span class=\"txtP\">[+" + Sta.Probability.pop[1] + "]</span>増加した！<br>";
              }
              break;
            case 3:
              Sta.force += UpNum;
              break;
            case 4:
              Sta.economy += UpNum;
              break;
          }
          Switch.Action.String += strsta[Deck.skill.num2[num][0]] + "のステータスが[" + UpNum + "]上昇した。<br>";
          break;
        case 1:
          switch (Deck.skill.num1[num][0]) {
            case 5:
              if (Deck.skill.num1[num][0] == Deck.skill.num2[num][0]) {
                turn--;
                Switch.Action.String += "このターン、カードを入れ替えてもう一度行う。";
              }
              break;
            case 6:
              if (Deck.skill.num2[num][0] === "") {
                var Num = Random.BetweenInteger(0, DictionaryCard.num.length - 1);

                Deck.num.push(DictionaryCard.num[Num]);
                Deck.name.push(DictionaryCard.name[Num]);
                Deck.sta.economy.push(DictionaryCard.sta.economy[Num]);
                Deck.sta.force.push(DictionaryCard.sta.force[Num]);
                Deck.img.push(DictionaryCard.img[Num]);
                Deck.sta.joy.push(DictionaryCard.sta.joy[Num]);
                Deck.sta.population.push(DictionaryCard.sta.population[Num]);
                Deck.sta.trust.push(DictionaryCard.sta.trust[Num]);
                Deck.skill.kinds.push(DictionaryCard.skill.kinds[Num]);
                Deck.skill.pow.push(DictionaryCard.skill.pow[Num]);
                Deck.skill.num1.push(DictionaryCard.skill.num1[Num]);
                Deck.skill.num2.push(DictionaryCard.skill.num2[Num]);

                Switch.Action.String += "デッキに新たに[No." + DictionaryCard.num[Num] + " " + DictionaryCard.name[Num] + "]が追加された。"
              }
              break;
            case 8:
              NumSetting[0] = 1;
              NumSetting[1] = num;
              break;
          }
          break;
        case 2:
          if (Sta.pic(Deck.skill.num1[num][0]) <= Deck.skill.num1[num][1]) {
            switch (Deck.skill.num2[num][0]) {
              case 0:
                Sta.trust += Deck.skill.num2[num][1];
                break;
              case 1:
                Sta.joy += Deck.skill.num2[num][1];
                break;
              case 2:
                Sta.population += Deck.skill.num2[num][1];
                if (Sta.Probability.pop[0] >= Random.Integer(100)) {
                  Sta.population += Sta.Probability.pop[1];
                  this.String += "<span class=\"txtI\">Info</span>:Joy増加のボーナスでpopulation増加量が<span class=\"txtP\">[+" + Sta.Probability.pop[1] + "]</span>増加した！<br>";
                }
                break;
              case 3:
                Sta.force += Deck.skill.num2[num][1];
                break;
              case 4:
                Sta.economy += Deck.skill.num2[num][1];
                break;
            }
            Switch.Action.String += strsta[Deck.skill.num1[num][0]] + "が[" + Deck.skill.num1[num][1] + "%]以下だった為、" + strsta[Deck.skill.num2[num][0]] + "のステータスが[" + Deck.skill.num2[num][1] + "]上昇する。";
          } else {
            Switch.Action.String += strsta[Deck.skill.num2[num][0]] + "のステータスが[" + Deck.skill.num2[num][1] + "]上昇するはずだった";
            Switch.Action.String += "が、<br>" + strsta[Deck.skill.num1[num][0]] + "が[" + Deck.skill.num1[num][1] + "%]以下でなかった…。";
          }
          break;
        case 3:
          switch (Deck.skill.num1[num][0]) {
            case 0:
              if (Sta.trust < Deck.skill.num1[num][1]) {
                Sta.trust = Deck.skill.num1[num][1];
              }
              break;
            case 1:
              if (Sta.joy < Deck.skill.num1[num][1]) {
                Sta.joy = Deck.skill.num1[num][1];
              }
              break;
            case 2:
              if (Sta.population < Deck.skill.num1[num][1]) {
                Sta.population = Deck.skill.num1[num][1];
              }
              break;
            case 3:
              if (Sta.force < Deck.skill.num1[num][1]) {
                Sta.force = Deck.skill.num1[num][1];
              }
              break;
            case 4:
              if (Sta.economy < Deck.skill.num1[num][1]) {
                Sta.economy = Deck.skill.num1[num][1];
              }
              break;
          }
          Switch.Action.String += strsta[Deck.skill.num1[num][0]] + "は、[" + Deck.skill.num1[num][1] + "]未満に減らない。";
          break;
        case 4:
          var flag = 0;
          var NumSwitch = Deck.skill.num1[num][0];
          if (NumSwitch == 9) {
            NumSwitch = Religion[1];
            Switch.Action.String += "宗教によって上昇するステータスが決まる。";
          }
          switch (NumSwitch) {
            case 0:
              Sta.trust += Deck.skill.num1[num][1];
              break;
            case 1:
              Sta.joy += Deck.skill.num1[num][1];
              break;
            case 2:
              Sta.population += Deck.skill.num1[num][1];
              if (Sta.Probability.pop[0] >= Random.Integer(100)) {
                Sta.population += Sta.Probability.pop[1];
                this.String += "<span class=\"txtI\">Info</span>:Joy増加のボーナスでpopulation増加量が<span class=\"txtP\">[+" + Sta.Probability.pop[1] + "]</span>増加した！<br>";
              }
              break;
            case 3:
              Sta.force += Deck.skill.num1[num][1];
              break;
            case 4:
              Sta.economy += Deck.skill.num1[num][1];
              break;
            default:
              flag = 1;
          }
          if (flag != 1) {
            Switch.Action.String += strsta[Deck.skill.num1[num][0]] + "のステータスが[" + Deck.skill.num1[num][1] + "]上昇する。<br>";
          }
          flag = 0;
          var NumSwitch = Deck.skill.num2[num][0];
          if (NumSwitch == 9) {
            NumSwitch = Religion[2];
            Switch.Action.String += "宗教によって減少するステータスが決まる。";
          }
          switch (Deck.skill.num2[num][0]) {
            case 0:
              Sta.trust -= Deck.skill.num2[num][1];
              break;
            case 1:
              Sta.joy -= Deck.skill.num2[num][1];
              break;
            case 2:
              Sta.population -= Deck.skill.num2[num][1];
              break;
            case 3:
              Sta.force -= Deck.skill.num2[num][1];
              break;
            case 4:
              Sta.economy -= Deck.skill.num2[num][1];
              break;
            default:
              flag = 1;
          }
          if (flag != 1) {
            Switch.Action.String += strsta[Deck.skill.num2[num][0]] + "のステータスが[" + Deck.skill.num2[num][1] + "]減少してしまう。";
          }
          flag = 0;
          break;
        case 5:
          switch (Deck.skill.num1[num][0]) {
            case 0:
              Math.round(Sta.joy *= Deck.skill.num1[num][1]);
              break;
            case 1:
              Math.round(Sta.joy *= Deck.skill.num1[num][1]);
              break;
            case 2:
              Math.round(Sta.population *= Deck.skill.num1[num][1]);
              if (Sta.Probability.pop[0] >= Random.Integer(100)) {
                Sta.population += Sta.Probability.pop[1];
                this.String += "<span class=\"txtI\">Info</span>:Joy増加のボーナスでpopulation増加量が<span class=\"txtP\">[+" + Sta.Probability.pop[1] + "]</span>増加した！<br>";
              }
              break;
            case 3:
              Math.round(Sta.force *= Deck.skill.num1[num][1]);
              break;
            case 4:
              Math.round(Sta.economy *= Deck.skill.num1[num][1]);
              break;
          }
          Switch.Action.String += strsta[Deck.skill.num1[num][0]] + "のステータスが[" + Deck.skill.num1[num][1] + "]倍になる。"
          break;
        case 6:
          if (Sta.pic(Deck.skill.num1[num][0]) >= Deck.skill.num1[num][1]) {
            switch (Deck.skill.num2[num][0]) {
              case 0:
                Sta.trust += Deck.skill.num2[num][1];
                break;
              case 1:
                Sta.joy += Deck.skill.num2[num][1];
                break;
              case 2:
                Sta.population += Deck.skill.num2[num][1];
                if (Sta.Probability.pop[0] >= Random.Integer(100)) {
                  Sta.population += Sta.Probability.pop[1];
                  this.String += "<span class=\"txtI\">Info</span>:Joy増加のボーナスでpopulation増加量が<span class=\"txtP\">[+" + Sta.Probability.pop[1] + "]</span>増加した！<br>";
                }
                break;
              case 3:
                Sta.force += Deck.skill.num2[num][1];
                break;
              case 4:
                Sta.economy += Deck.skill.num2[num][1];
                break;
            }
            Switch.Action.String += strsta[Deck.skill.num1[num][0]] + "が[" + Deck.skill.num1[num][1] + "%]以上だった為、" + strsta[Deck.skill.num2[num][0]] + "のステータスが[" + Deck.skill.num2[num][1] + "]上昇する。";
          } else {
            Switch.Action.String += strsta[Deck.skill.num2[num][0]] + "のステータスが[" + Deck.skill.num2[num][1] + "]上昇するはずだった";
            Switch.Action.String += "が、<br>" + strsta[Deck.skill.num1[num][0]] + "が[" + Deck.skill.num1[num][1] + "%]以上でなかった…。";
          }
          break;
        case 7:
          ExEvent.stop = Deck.skill.num2[num][1];
          Switch.Action.String = Deck.skill.num2[num][1] + "ターンの間、イベントを止める。";
          break;
        case 8:
          for (var i = 0; i < CardRog.length; i++) {
            if (CardRog[i] == Deck.skill.num1[num][1]) {
              switch (Deck.skill.num2[num][0]) {
                case 0:
                  Sta.trust += Deck.skill.num2[num][1];
                  break;
                case 1:
                  Sta.joy += Deck.skill.num2[num][1];
                  break;
                case 2:
                  Sta.population += Deck.skill.num2[num][1];
                  if (UpNum > 0 && Sta.Probability.pop[0] >= Random.Integer(100)) {
                    Sta.population += Sta.Probability.pop[1];
                    this.String += "<span class=\"txtI\">Info</span>:Joy増加のボーナスでpopulation増加量が<span class=\"txtP\">[+" + Sta.Probability.pop[1] + "]</span>増加した！<br>";
                  }
                  break;
                case 3:
                  Sta.force += Deck.skill.num2[num][1];
                  break;
                case 4:
                  Sta.economy += Deck.skill.num2[num][1];
                  break;
              }
            }
          }
          break;
        default:
          break;
      }
      if (kinds == 1) {
        Never.Push(num, 100, "");
      }
    },
    Pro: function (num) {
      Never.Push(num, Deck.skill.num1[num][1], "");
      Switch.Action.String += strsta[Deck.skill.num2[num][0]] + "のステータスが[" + Deck.skill.num2[num][1] + "]上昇する。"
    },
    Original: function (num, posi) {
      switch (num - 100) {
        //国王1の固有カード
        case 0:
          var j = 0;
          var rand = Random.BetweenInteger(1, 6);
          this.String = "[建造物破壊]:このカードのスキルで、以下の継続効果が消去された。";
          for (var i = 0; i < rand; i++) {
            if (Never.name[0] != undefined) {
              Never.Probability.shift();
              Never.img.shift();
              Never.num.shift();
              Never.turn.shift();
              Never.skill.num1.shift();
              Never.skill.num2.shift();
              Never.skill.pow.shift();
              Sta.economy += 2;
              j++;
              this.String += " [" + Never.name[0] + "]";
              Never.name.shift();
            }
          }
          this.String += "<br>" + j + "個の継続効果を破壊したため、[economy]が+" + (j * 2) + "された。";
          break;
        case 1:
          Never.Push(posi, 100, "");
          this.String = "[蠟人間]:[population]が-20以下にならないが、[trust]は毎ターン-3ずつされてしまう。"
          break;
        case 2:
          var number = [];
          this.String = "[フリービルド]:この効果により継続効果に、";
          for (var i = 0; i < Deck.img.length; i++) {
            if (Deck.skill.kinds[i] == 1 || Deck.skill.kinds[i] == 2) {
              number.push(i);
            }
          }
          for (var i = 0; i < 2; i++) {
            var ans = Random.Integer(number.length - 1);
            if (Deck.skill.kinds[ans] == 1) {
              Never.Push(ans, 100, "");
            } else {
              Never.Push(ans, Deck.skill.num1[ans][1], "");
            }
            this.String += " [" + Deck.name[ans] + "]";
          }
          this.String += "が、追加された。";
          break;
        //国王2の固有カード
        case 3:
          Never.Push(posi, 100, 2);
          this.String = "[安堵の炎]:次のターン[population]が減少しない。";
          break;
        case 4:
          NumSetting = [1, 26];
          this.String = "[断罪の炎]:次のターン[安堵の炎]を必ず一枚ドローする。";
          break;
        case 5:
          if (Never.Probability.length != 0) {
            var temp = Random.Integer(Never.Probability.length - 1);
            var number = Never.num[temp];
            if (Deck.skill.kinds[number] == 1) {
              Never.Push(number, 100, "");
            } else {
              Never.Push(number, Deck.skill.num1[number][1], "");
            }
            this.String = "[知力を求めて]:このカードにより、継続効果カードに[" + Deck.name[number] + "]が複製された。";
          } else {
            this.String = "[知力を求めて]:継続効果カードがなかったため失敗。";
          }
          break;
        //国王3の固有カード
        case 6:
          this.String = "[伝説の鍛冶屋]:特殊スキルなし。";
          break;
        case 7:
          var flag = 0;
          for (var i = 0; i < CardRog.length; i++) {
            if (Deck.num[CardRog[i]] == 106) {
              flag = 1;
            }
          }
          if (flag == 1) {
            Sta.trust += 10;
            Sta.force += 5;
            Sta.population += 5;
            this.String = "[決闘]:[伝説の鍛冶屋]からもらった剣で決闘に勝った。<br><span class=\"txtT\">[trust]</span>+10<span class=\"txtF\">[force]</span>+5<span class=\"txtP\">[population]</span>+5";
          } else {
            this.String = "[決闘]:あの武器がなかったため、決闘には勝てなかった。"
          }
          break;
        case 8:
          var temp = "";
          var flag = 0;
          this.String = "[厄災の剣]:";
          for (var i = 0; i < 5; i++) {
            if (Sta.pic(i) < 0) {
              switch (i) {
                case 0:
                  Sta.trust = 10;
                  temp += "[trust]";
                  break;
                case 1:
                  Sta.joy = 10;
                  temp += "[joy]";
                  break;
                case 2:
                  Sta.population = 10;
                  temp += "[population]";
                  break;
                case 3:
                  Sta.force = 10;
                  temp += "[force]";
                  break;
                case 4:
                  Sta.economy = 10;
                  temp += "[economy]";
                  break;
              }
              temp += "が0以下だった為、10%にした。その後、";
              switch (Random.Integer(4)) {
                case 0:
                  Sta.trust -= 20;
                  temp += "[trust]";
                  break;
                case 1:
                  Sta.joy -= 20;
                  temp += "[joy]";
                  break;
                case 2:
                  Sta.population -= 20;
                  temp += "[population]";
                  break;
                case 3:
                  Sta.force -= 20;
                  temp += "[force]";
                  break;
                case 4:
                  Sta.economy -= 20;
                  temp += "[economy]";
                  break;
              }
              temp += "を代償として-20した。<br>";
              flag = 1;
            }
          }
          if (flag == 1) {
            this.String += "厄災の剣の能力が発動される。<br>" + temp;
          } else {
            this.String += "全てのステータスが正の値だった為、何も起きなかった。";
          }
          break;
        //国王4の固有カード
        case 9:
          this.String = "[あったかい犬]:";
          switch (Random.Integer(4)) {
            case 0:
              Sta.trust += 11;
              this.String += "[trust]";
              break;
            case 1:
              Sta.joy += 11;
              this.String += "[joy]";
              break;
            case 2:
              Sta.population += 11;
              this.String += "[population]";
              break;
            case 3:
              Sta.force += 11;
              this.String += "[force]";
              break;
            case 4:
              Sta.economy += 11;
              this.String += "[economy]";
              break;
          }
          this.String += "が11上昇したワン。<br>…ついでに「ホットキャット」もいかがかワン？<br>…そうだワン、質の低いパロディだワン。<br>";
          break;
        case 10:
          Sta.trust -= 11;
          Sta.joy -= 11;
          Sta.population -= 11;
          Sta.economy -= 11;
          Sta.force -= 11;
          this.String = "[犬小屋大盛況]:ほら、見るワン!"
          for (var i = 0; i < CardRog.length; i++) {
            if (Deck.num[CardRog[i]] == 111) {
              flag = 1;
            }
          }
          if (flag == 1) {
            this.String += "大盛況だワン!!<br>";
            switch (Random.Integer(4)) {
              case 0:
                Sta.trust += 111;
                this.String += "[trust]";
                break;
              case 1:
                Sta.joy += 111;
                this.String += "[joy]";
                break;
              case 2:
                Sta.population += 111;
                this.String += "[population]";
                break;
              case 3:
                Sta.force += 111;
                this.String += "[force]";
                break;
              case 4:
                Sta.economy += 111;
                this.String += "[economy]";
                break;
            }
            Sta.trust -= 20;
            Sta.joy -= 20;
            Sta.population -= 20;
            Sta.economy -= 20;
            Sta.force -= 20;
            this.String += "が111も上昇したワン!!<br>…代償に全部-20されたワン。";
          } else {
            this.String += "大盛況じゃないワン…。<br>ここに確か「あの犬」がいたはずワン…。";
          }
          break;
        case 11:
          Sta.trust -= 11;
          Sta.joy -= 11;
          Sta.population -= 11;
          Sta.economy -= 11;
          Sta.force -= 11;
          this.String = "[忠犬]:帰ってきたワン!僕の大親友が返ってきたワン!!<br>全てを代償に払ってよかったワン!!";
          break;
        //国王5の固有カード
        case 12:
          this.String = "[ダブルスクラッチ]:特殊スキルなし。"
          break;
        case 13:
          Never.Push(posi, 100, "");
          this.String = "[餌やり]:継続効果カードに獰猛な狼の上昇と減少が反転して、二倍する効果が追加された。";
          break;
        case 14:
          var j = 1;
          var flag = 0;
          for (var i = 0; i < Never.Probability.length; i++) {
            if (Deck.num[Never.num[i]] == 113) {
              j *= -2;
              flag += 1;
            }
          }
          if (j != 1) {
            Sta.trust += 3 - 3 * j;
            Sta.joy += 3 - 3 * j;
            Sta.population += 3 - 3 * j;
            Sta.economy += 1 - 1 * j;
            Sta.force += 1 - 1 * j;
            this.String = "[獰猛な狼]:このカードに特殊効果はないが、[餌やり]が" + flag + "個あったため、" + flag + "回上昇と減少が変更され、" + Math.abs(j) + "倍された。";
          } else {
            this.String = "[獰猛な狼]:このカードに特殊効果はない";
          }
          break;
        //国王6の固有カード
        case 15:
          Never.Push(posi, 100, "");
          this.String = "[鉱山発見]:継続効果カードに「（[population]の一桁目×２）した値分、[economy]を上昇させる」効果を追加する。";
          break;
        case 16:
          this.String = "[唐突な金塊]:特殊スキルなし。";
          break;
        case 17:
          this.String = "[インフレの眼]:[economy]が80%以";
          if (Sta.economy > 69) {
            Sta.economy = 30;
            Sta.joy += 15;
            Sta.population += 15;
            Sta.force += 15;
            Sta.trust += 15;
            this.String += "上だったため、[economy]を30%にしてそれ以外を+15した。";
          } else {
            this.String += "下だったため、スキルは発動されなかった。";
          }
          break;
        //国王7の固有カード
        case 18:
          this.String = "[守神【爪】]:最高の力を得た。";
          break;
        case 19:
          this.String = "[守神【壁】]:最高の守を得た。";
          break;
        case 20:
          var flag = [0, 0];
          this.String = "[守神【光】]:";
          for (var i = 0; i < CardRog; i++) {
            if (Deck.num[CardRog[i]] == 118) {
              flag[0] = 1;
            } else if (Deck.num[CardRog[i]] == 119) {
              flag[1] = 1;
            }
          }
          if (flag[0] == 1 && flag[1] == 1) {
            Sta.population = 60;
            this.String += "守と力の加護で、[population]が60%になった。";
          } else {
            this.String += "守と力さえあれば…。";
          }
          break;
        //国王8の固有カード
        case 21:
          this.String = "[見せしめ]:特殊スキルなし。";
          break;
        case 22:
          this.String = "[監視の眼]:特殊スキルなし。";
          break;
        case 23:
          Never.Push(posi, 100, "");
          Sta.population = 100;
          this.String = "[一時的安堵]:[popultaion]が100%になる代わりに、この後永遠に１ターン毎に[popultaion]が-3ずつされてしまう。";
          break;
        //国王9の固有カード
        case 24:
          this.String = "[苦しみと嘆きのハーモニー]:特殊スキルなし。";
          break;
        case 25:
          this.String = "[ギロチン]:特殊スキルなし。";
          break;
        case 26:
          Never.Push(posi, 100, "");
          this.String = "[死神]:継続効果カードに「[trust]と[population]を-1する代わりに、[economy]を+4する」カードを追加する。";
          break;
        //国王10の固有カード
        case 27:
          var flag = 0;
          this.String = "[OR]:";
          for (var i = 0; i < 5; i++) {
            if (Sta.pic(i) > 0) {
              Sta.trust = 0;
              Sta.population = 0;
              Sta.economy = 0;
              Sta.force = 0;
              Sta.joy = 0;
              flag = 1;
            }
          }
          if (flag == 1) {
            this.String += "0以上のステータスがあったため、全部0になった。";
          } else {
            this.String += "0以上のステータスがなかったため、スキルは発動しなかった。";
          }
          break;
        case 28:
          var flag = 0;
          var temp = -100;
          this.String = "[AND]:";
          var number = [0, 0];
          for (var i = 0; i < 5; i++) {
            for (var j = 0; j < 5; j++) {
              if (i != j && Sta.pic(i) == Sta.pic(j) && temp < Sta.pic(i)) {
                flag = 1;
                temp = Sta.pic(i);
                number[0] = i;
                number[1] = j;
              }
            }
          }
          if (flag == 1) {
            Sta.trust = temp;
            Sta.joy = temp;
            Sta.population = temp;
            Sta.economy = temp;
            Sta.force = temp;
            this.String += strsta[number[0]] + "と" + strsta[1] + "が一致していたので、全てのステータスが" + temp + "%になった。";
          } else {
            this.String += "一致するステータスがなかったため、スキルは発動しなかった。";
          }
          break;
        case 29:
          console.log("UNKO");
          this.String = "[USBmemory]:このカードのスキルで、デッキに";
          var rand = 0;
          for (var i = 0; i < 3; i++) {
            rand = Random.Integer(31);
            Deck.img.push(Deck.img[rand]);
            Deck.name.push(Deck.name[rand]);
            Deck.num.push(Deck.num[rand]);
            Deck.skill.kinds.push(Deck.skill.kinds[rand]);
            Deck.skill.num1.push(Deck.skill.num1[rand]);
            Deck.skill.num2.push(Deck.skill.num2[rand]);
            Deck.skill.pow.push(Deck.skill.pow[rand]);
            Deck.sta.economy.push(Deck.sta.economy[rand]);
            Deck.sta.joy.push(Deck.sta.joy[rand]);
            Deck.sta.trust.push(Deck.sta.trust[rand]);
            Deck.sta.population.push(Deck.sta.population[rand]);
            Deck.sta.force.push(Deck.sta.force[rand]);
            this.String += "[" + Deck.name[rand] + "]";
          }
          this.String += "が追加された。";
          break;
        //国王11の固有カード
        case 30:
          var number = Never.Probability.length;
          this.String = "[冥界へようこそ]:今ある継続効果カードが二倍になった。";
          for (var i = 0; i < number; i++) {
            Never.Push(Never.num[i], Never.Probability[i], Never.turn[i]);
          }
          break;
        case 31:
          this.String = "[骨の玩具]:";
          if (Never.Probability.length > 2) {
            for (var i = 0; i < 3; i++) {
              Never.Probability.shift();
              Never.img.shift();
              Never.num.shift();
              Never.turn.shift();
              Never.name.shift();
              Never.skill.num1.shift();
              Never.skill.num2.shift();
              Never.skill.pow.shift();
            }
            turn -= 3;
            this.String += "古い順に三つ継続効果カードを削除し、ターン数が3(1.5日分)増えた。";
          } else {
            this.String += "継続効果カードが三つ以上ないと発動できない。";
          }
          break;
        case 32:
          this.String = "[夜の遠吠え]:今ある継続効果カードの中から、";
          var rand = 0;
          for (var i = 0; i < 3; i++) {
            if (Never.Probability.length != 0) {
              rand = Random.Integer(Never.Probability.length - 1);
              this.String += "[" + Never.name[rand] + "]";
              Never.Probability.splice(rand, 1);
              Never.img.splice(rand, 1);
              Never.num.splice(rand, 1);
              Never.turn.splice(rand, 1);
              Never.name.splice(rand, 1);
              Never.skill.num1.splice(rand, 1);
              Never.skill.num2.splice(rand, 1);
              Never.skill.pow.splice(rand, 1);
            }
          }
          var number = Never.Probability.length;
          for (var i = 0; i < number; i++) {
            Never.Push(Never.num[i], Never.Probability[i], Never.turn[i]);
            Never.Push(Never.num[i], Never.Probability[i], Never.turn[i]);
          }
          this.String += "を消去し、継続効果カードを三倍にした。";
          break;
        //国王12の固有カード
        case 33:
          var rand = 0;
          for (var i = 0; i < 20; i++) {
            rand = Random.Integer(67);
            Deck.num.push(DictionaryCard.num[rand]);
            Deck.name.push(DictionaryCard.name[rand]);
            Deck.sta.economy.push(DictionaryCard.sta.economy[rand]);
            Deck.sta.force.push(DictionaryCard.sta.force[rand]);
            Deck.img.push(DictionaryCard.img[rand]);
            Deck.sta.joy.push(DictionaryCard.sta.joy[rand]);
            Deck.sta.population.push(DictionaryCard.sta.population[rand]);
            Deck.sta.trust.push(DictionaryCard.sta.trust[rand]);
            Deck.skill.kinds.push(DictionaryCard.skill.kinds[rand]);
            Deck.skill.pow.push(DictionaryCard.skill.pow[rand]);
            Deck.skill.num1.push(DictionaryCard.skill.num1[rand]);
            Deck.skill.num2.push(DictionaryCard.skill.num2[rand]);
          }
          for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 4; j++) {
              Deck.num.push(DictionaryCard.num[101 + i]);
              Deck.name.push(DictionaryCard.name[101 + i]);
              Deck.sta.economy.push(DictionaryCard.sta.economy[101 + i]);
              Deck.sta.force.push(DictionaryCard.sta.force[101 + i]);
              Deck.img.push(DictionaryCard.img[101 + i]);
              Deck.sta.joy.push(DictionaryCard.sta.joy[101 + i]);
              Deck.sta.population.push(DictionaryCard.sta.population[101 + i]);
              Deck.sta.trust.push(DictionaryCard.sta.trust[101 + i]);
              Deck.skill.kinds.push(DictionaryCard.skill.kinds[101 + i]);
              Deck.skill.pow.push(DictionaryCard.skill.pow[101 + i]);
              Deck.skill.num1.push(DictionaryCard.skill.num1[101 + i]);
              Deck.skill.num2.push(DictionaryCard.skill.num2[101 + i]);
            }
          }
          this.String = "[プレゼント!]:32枚のカードがデッキに追加された。"
          break;
        case 34:
          for (var i = 0; i < 5; i++) {
            Deck.num.push(DictionaryCard.num[101]);
            Deck.name.push(DictionaryCard.name[101]);
            Deck.sta.economy.push(DictionaryCard.sta.economy[101]);
            Deck.sta.force.push(DictionaryCard.sta.force[101]);
            Deck.img.push(DictionaryCard.img[101]);
            Deck.sta.joy.push(DictionaryCard.sta.joy[101]);
            Deck.sta.population.push(DictionaryCard.sta.population[101]);
            Deck.sta.trust.push(DictionaryCard.sta.trust[101]);
            Deck.skill.kinds.push(DictionaryCard.skill.kinds[101]);
            Deck.skill.pow.push(DictionaryCard.skill.pow[101]);
            Deck.skill.num1.push(DictionaryCard.skill.num1[101]);
            Deck.skill.num2.push(DictionaryCard.skill.num2[101]);
            Deck.num.push(DictionaryCard.num[103]);
            Deck.name.push(DictionaryCard.name[103]);
            Deck.sta.economy.push(DictionaryCard.sta.economy[103]);
            Deck.sta.force.push(DictionaryCard.sta.force[103]);
            Deck.img.push(DictionaryCard.img[103]);
            Deck.sta.joy.push(DictionaryCard.sta.joy[103]);
            Deck.sta.population.push(DictionaryCard.sta.population[103]);
            Deck.sta.trust.push(DictionaryCard.sta.trust[103]);
            Deck.skill.kinds.push(DictionaryCard.skill.kinds[103]);
            Deck.skill.pow.push(DictionaryCard.skill.pow[103]);
            Deck.skill.num1.push(DictionaryCard.skill.num1[103]);
            Deck.skill.num2.push(DictionaryCard.skill.num2[103]);
          }
          this.String = "[サンタクロース!]:デッキに[泥棒ノーム]と[プレゼント!]がそれぞれ5枚ずつ追加された。";
          break;
        case 35:
          var rand = 0;
          this.String = "[泥棒ノーム]:";
          if (Deck.img.length > 31) {
            for (var i = 0; i < 32; i++) {
              if (Deck.img.length != 0) {
                rand = Random.Integer(Deck.img.length - 1);
                Deck.num.splice(rand, 1);
                Deck.name.splice(rand, 1);
                Deck.sta.economy.splice(rand, 1);
                Deck.sta.force.splice(rand, 1);
                Deck.img.splice(rand, 1);
                Deck.sta.joy.splice(rand, 1);
                Deck.sta.population.splice(rand, 1);
                Deck.sta.trust.splice(rand, 1);
                Deck.skill.kinds.splice(rand, 1);
                Deck.skill.pow.splice(rand, 1);
                Deck.skill.num1.splice(rand, 1);
                Deck.skill.num2.splice(rand, 1);
              }
            }
            if (Never.Probability.length > 0) {
              for (var i = 0; i < Never.Probability.length; i++) {
                Never.name.shift();
                Never.Probability.shift();
                Never.img.shift();
                Never.num.shift();
                Never.turn.shift();
                Never.skill.num1.shift();
                Never.skill.num2.shift();
                Never.skill.pow.shift();
              }
            }
            for (var i = 0; i < 3; i++) {
              Deck.num.push(DictionaryCard.num[101 + i]);
              Deck.name.push(DictionaryCard.name[101 + i]);
              Deck.sta.economy.push(DictionaryCard.sta.economy[101 + i]);
              Deck.sta.force.push(DictionaryCard.sta.force[101 + i]);
              Deck.img.push(DictionaryCard.img[101 + i]);
              Deck.sta.joy.push(DictionaryCard.sta.joy[101 + i]);
              Deck.sta.population.push(DictionaryCard.sta.population[101 + i]);
              Deck.sta.trust.push(DictionaryCard.sta.trust[101 + i]);
              Deck.skill.kinds.push(DictionaryCard.skill.kinds[101 + i]);
              Deck.skill.pow.push(DictionaryCard.skill.pow[101 + i]);
              Deck.skill.num1.push(DictionaryCard.skill.num1[101 + i]);
              Deck.skill.num2.push(DictionaryCard.skill.num2[101 + i]);
            }
            this.String += "32枚のカードと継続効果カードが全て削除され、新たに固有カードが一枚ずつ追加された。";
          } else {
            Sta.economy -= 80;
            Sta.force -= 80;
            Sta.joy -= 80;
            Sta.trust -= 80;
            Sta.population -= 80;
            this.String += "32枚以上デッキがないため、スキルを発動できない。そのため、全てのステータスを-80される。";
          }
          break;
        //国王13の固有カード
        case 36:
          var temp = [Random.BetweenInteger(-10, 10), Random.BetweenInteger(-10, 10), Random.BetweenInteger(-10, 10), Random.BetweenInteger(-10, 10), Random.BetweenInteger(-10, 10)];
          Sta.trust += temp[0];
          Sta.joy += temp[1];
          Sta.population += temp[2];
          Sta.force += temp[3];
          Sta.economy += temp[4];
          this.String = "[cyanby]:ステータスが全てランダムに[-10~10]で増減する。<br><span class=\"txtT\">Trustが[" + temp[0] + "%]上昇</span><br><span class=\"txtJ\">Joyが[" + temp[1] + "%]上昇</span><br><span class=\"txtP\">Populationが[" + temp[2] + "%]上昇</span><br><span class=\"txtF\">Forceが[" + temp[3] + "%]上昇</span><br><span class=\"txtE\">Economyが[" + temp[4] + "%]上昇</span>";
          break;
        case 37:
          this.String = "[fyla]:このカードのスキルで、"
          switch (Random.Integer(4)) {
            case 0:
              Sta.trust -= 66;
              this.String += "[trust]";
              break;
            case 1:
              Sta.joy -= 66;
              this.String += "[joy]";
              break;
            case 2:
              Sta.population -= 66;
              this.String += "[population]";
              break;
            case 3:
              Sta.force -= 66;
              this.String += "[force]";
              break;
            case 4:
              Sta.economy -= 66;
              this.String += "[economy]";
              break;
          }
          this.String += "が-66され、";
          switch (Random.Integer(4)) {
            case 0:
              Sta.trust += 66;
              this.String += "[trust]";
              break;
            case 1:
              Sta.joy += 66;
              this.String += "[joy]";
              break;
            case 2:
              Sta.population += 66;
              this.String += "[population]";
              break;
            case 3:
              Sta.force += 66;
              this.String += "[force]";
              break;
            case 4:
              Sta.economy += 66;
              this.String += "[economy]";
              break;
          }
          this.String += "が+66された。";
          break;
        case 38:
          this.String = "[(fanmey)]:";
          if (Deck.img.length > 9) {
            for (var i = 0; i < 2; i++) {
              rand = Random.Integer(Deck.img.length - 1);
              this.String += "[" + Deck.name[rand] + "]";
              Deck.num.splice(rand, 1);
              Deck.name.splice(rand, 1);
              Deck.sta.economy.splice(rand, 1);
              Deck.sta.force.splice(rand, 1);
              Deck.img.splice(rand, 1);
              Deck.sta.joy.splice(rand, 1);
              Deck.sta.population.splice(rand, 1);
              Deck.sta.trust.splice(rand, 1);
              Deck.skill.kinds.splice(rand, 1);
              Deck.skill.pow.splice(rand, 1);
              Deck.skill.num1.splice(rand, 1);
              Deck.skill.num2.splice(rand, 1);
            }
            this.String += "の二つがデッキから削除され、";
            switch (Random.Integer(4)) {
              case 0:
                Sta.trust += 666;
                this.String += "[trust]";
                break;
              case 1:
                Sta.joy += 666;
                this.String += "[joy]";
                break;
              case 2:
                Sta.population += 666;
                this.String += "[population]";
                break;
              case 3:
                Sta.force += 666;
                this.String += "[force]";
                break;
              case 4:
                Sta.economy += 666;
                this.String += "[economy]";
                break;
            }
            this.String += "が+666された。";
          } else {
            this.String += "デッキが10枚以下なので、このカードのスキルは発動しなかった。";
          }
          break;
        //国王14の固有カード
        case 39:
          NumSetting = [1, 31];
          this.String = "[降り注ぐ『資金』]:ギャンブル祭りの始まり始まり。";
          break;
        case 40:
          Never.Push(posi, 100, "");
          this.String = "[宝石の明るみ]:今後[economy]が0以下にならなければ全ステータスが+4ずつされていく。<br>大丈夫、ギャンブルで稼げばいい…。";
          break;
        case 41:
          var rand = 0;
          var temp = 0;
          this.String = "[命懸けギャンブル]:さぁ…来い…!!<br>"
          rand = Random.BetweenInteger(-50, 50);
          temp += rand;
          Sta.trust += rand;
          this.String += "[trust] " + rand;
          rand = Random.BetweenInteger(-50, 50);
          temp += rand;
          Sta.joy += rand;
          this.String += "[joy] " + rand;
          rand = Random.BetweenInteger(-50, 50);
          temp += rand;
          Sta.force += rand;
          this.String += "[force] " + rand;
          rand = Random.BetweenInteger(-50, 50);
          temp += rand;
          Sta.economy += rand;
          this.String += "[economy] " + rand;
          if (temp > 80) {
            Sta.population += 45;
            this.String += "<br>高打点ボーナス!![population] 45";
          } else {
            this.String += "<br>高打点ならず。";
          }
          break;
        //国王15の固有カード
        case 42:
          var i;
          for (i = 0; i < Deck.img.length; i++) {
            if (Deck.num[i] == 143) {
              break;
            }
          }
          NumSetting = [1, i];
          this.String = "[魔力球三連]:次のターンに[運命の雫]を引く。";
          break;
        case 43:
          var i;
          if (Deck.num[CardRog[CardRog.length - 2]] == 142) {
            Sta.economy += 2;
            Sta.joy += 2;
            Sta.trust += 2;
            Sta.population += 2;
            Sta.force += 2;
            for (i = 0; i < Deck.img.length; i++) {
              if (Deck.num[i] == 142) {
                break;
              }
            }
            Deck.img.push(Deck.img[i]);
            Deck.name.push(Deck.name[i]);
            Deck.num.push(Deck.num[i]);
            Deck.skill.kinds.push(Deck.skill.kinds[i]);
            Deck.skill.num1.push(Deck.skill.num1[i]);
            Deck.skill.num2.push(Deck.skill.num2[i]);
            Deck.skill.pow.push(Deck.skill.pow[i]);
            Deck.sta.economy.push(Deck.sta.economy[i]);
            Deck.sta.joy.push(Deck.sta.joy[i]);
            Deck.sta.trust.push(Deck.sta.trust[i]);
            Deck.sta.population.push(Deck.sta.population[i]);
            Deck.sta.force.push(Deck.sta.force[i]);
            for (i = 0; i < Deck.img.length; i++) {
              if (Deck.num[i] == 144) {
                break;
              }
            }
            NumSetting = [1, i];
            this.String = "[運命の雫]:全ステータスを+2し、[魔力球三連]をデッキに追加し、次のターンに[落雷]を引く。";
          } else {
            this.String = "[運命の雫]:残念ながら、予言を当てられるほどの魔力球がないようだ。";
          }
          break;
        case 44:
          this.String = "[落雷]:";
          if (Deck.num[CardRog[CardRog.length - 2]] == 143 && Deck.num[CardRog[CardRog.length - 3]] == 142) {
            this.String += "予言通りだったため、";
            for (var i = 0; i < 3; i++) {
              rand = Random.Integer(Deck.img.length - 1);
              this.String += "[" + Deck.name[rand] + "]";
              Deck.num[rand] = DictionaryCard.num[110 + i];
              Deck.name[rand] = DictionaryCard.name[110 + i];
              Deck.sta.economy[rand] = DictionaryCard.sta.economy[110 + i];
              Deck.sta.force[rand] = DictionaryCard.sta.force[110 + i];
              Deck.img[rand] = DictionaryCard.img[110 + i];
              Deck.sta.joy[rand] = DictionaryCard.sta.joy[110 + i];
              Deck.sta.population[rand] = DictionaryCard.sta.population[110 + i];
              Deck.sta.trust[rand] = DictionaryCard.sta.trust[110 + i];
              Deck.skill.kinds[rand] = DictionaryCard.skill.kinds[110 + i];
              Deck.skill.pow[rand] = DictionaryCard.skill.pow[110 + i];
              Deck.skill.num1[rand] = DictionaryCard.skill.num1[110 + i];
              Deck.skill.num2[rand] = DictionaryCard.skill.num2[110 + i];
            }
            if (Never.Probability.length > 0) {
              for (var i = 0; i < Never.Probability.length; i++) {
                Never.name.shift();
                Never.Probability.shift();
                Never.img.shift();
                Never.num.shift();
                Never.turn.shift();
                Never.skill.num1.shift();
                Never.skill.num2.shift();
                Never.skill.pow.shift();
              }
            }
            Sta.trust += 8;
            Sta.joy += 8;
            Sta.economy += 8;
            Sta.force += 8;
            Sta.population += 8;
            this.String += "と継続効果カードが削除され、理想の形へ変わった。<br>更に全てのステータスを+8された。";
          } else {
            this.String += "予言に雷が落ちると書いてなかった…。";
          }
          break;
        //国王16の固有カード
        case 45:
          var flag = 0;
          this.String = "[増幅魔術【羽】]:";
          for (var i = 0; i < 5; i++) {
            if (Sta.pic(i) < 0) {
              flag = 1;
            }
          }
          if (flag != 1) {
            Sta.trust += 10;
            this.String += "全てのステータスが0以上だったため、[trust]が+10された。";
          } else {
            this.String += "どれかのステータスが0より下だったため、詠唱に失敗した。";
          }
          break;
        case 46:
          var flag = 0;
          this.String = "[増幅魔術【羽】]:";
          for (var i = 0; i < 5; i++) {
            if (Sta.pic(i) > -10) {
              flag = 1;
            }
          }
          if (flag != 1) {
            Sta.trust = 50;
            Sta.joy = 50;
            Sta.force = 50;
            Sta.economy = 50;
            Sta.population = 50;
            this.String += "全てのステータスが-10以下だったため、全ステータスが50%になった。";
          } else {
            this.String += "どれかのステータスが-10より上だったため、詠唱に失敗した。";
          }
          break;
        case 47:
          flag = [0, 0];
          for (var i = 0; i < CardRog.length; i++) {
            if (Deck.num[CardRog[i]] == 145) {
              flag[0] = 1;
            } else if (Deck.num[CardRog[i]] == 146) {
              flag[1] = 1;
            }
          }
          if (flag[0] == flag[1] && flag[0] == 1) {
            Sta.trust += 20;
            Sta.joy += 20;
            Sta.force += 20;
            Sta.economy += 20;
            Sta.population += 20;
            this.String = "[増幅魔術【光】]:空からの光により、全てのステータスが+20される。";
          } else {
            this.String = "[増幅魔術【光】]:詠唱準備が整っていなかった。";
          }
          break;
        //国王17の固有カード
        case 48:
          var flag = 0;
          var temp = 0;
          this.String = "[虫のびっくり箱]:";
          for (var i = 0; i < Never.Probability.length; i++) {
            if (Deck.num[Never.num[i]] == 150) {
              Never.Probability.splice(i, 1);
              Never.img.splice(i, 1);
              Never.num.splice(i, 1);
              Never.turn.splice(i, 1);
              Never.name.splice(i, 1);
              Never.skill.num1.splice(i, 1);
              Never.skill.num2.splice(i, 1);
              Never.skill.pow.splice(i, 1);
              temp++;
              flag = 1;
            }
          }
          if (flag == 1) {
            Sta.economy += temp * 2;
            Sta.joy += temp * 2;
            this.String += "びっくり箱に成功して、[economy]と[joy]が+" + (temp * 2) + "された。";
          } else {
            this.String += "虫がいなかった…。";
          }
          break;
        case 49:
          Never.Push(posi, 50, "");
          this.String = "[虫の巣]:これで虫が捕獲できるかもしれない…。";
          break;
        case 50:
          Never.Push(posi, 100, "");
          this.String = "[幸運を運ぶ虫]:この後、継続効果カードで[trust]を-1して[force]を+1し続ける。";
          break;
        //国王18の固有カード
        case 51:
          var j = 1;
          NumSetting = [1, posi];
          for (var i = 0; i < CardRog.length; i++) {
            if (Deck.num[CardRog[i]] == 153) {
              j *= -1;
            }
          }
          Sta.trust += Math.floor(Never.Probability.length / 5) * j;
          Sta.joy += Math.floor(Never.Probability.length / 5) * j;
          Sta.population += Math.floor(Never.Probability.length / 5) * j;
          Sta.economy += Math.floor(Never.Probability.length / 5) * j;
          Sta.force += Math.floor(Never.Probability.length / 5) * j;
          for (var i = 0; i < Never.Probability.length; i++) {
            if (Deck.num[Never.num[i]] == 153) {
              Never.Probability.splice(i, 1);
              Never.img.splice(i, 1);
              Never.num.splice(i, 1);
              Never.turn.splice(i, 1);
              Never.name.splice(i, 1);
              Never.skill.num1.splice(i, 1);
              Never.skill.num2.splice(i, 1);
              Never.skill.pow.splice(i, 1);
            }
          }
          this.String = "[呪縛の指輪]:このカードのスキルで次もこのカードを引く。さらに、全ステータスが" + ((Never.Probability.length / 5) * j) + "上昇して、継続効果カードから[宇宙の理]を全て削除した。";
          break;
        case 52:
          var i;
          for (i = 0; i < Deck.img.length; i++) {
            if (Deck.num[i] == 153) {
              break;
            }
          }
          NumSetting = [1, i];
          this.String = "[解呪の光線]:さて、呪いは解けた。あとは…。";
          break;
        case 53:
          var i;
          for (i = 0; i < CardRog.length; i++) {
            Never.Push(posi, 100, "");
          }
          this.String = "[宇宙の理]:意味のない継続効果カードが" + i + "個増えた。";
          break;
        //国王19の固有カード
        case 54:
          ExEvent.probability = 100;
          this.String = "[戦争宣言]:イベントが起こる。";
          break;
        case 55:
          this.String = "[衛生光線の準備]:特殊スキルなし。"
          break;
        case 56:
          var temp = Sta.force;
          Sta.force = Sta.population;
          Sta.population = temp;
          this.String = "[基盤変更]:人口と勢力が入れ替わった。";
          break;
        //国王20の固有カード
        case 57:
          this.String = "[ミチビキ]:";
          if (Religion[0] == 3) {
            Sta.economy += 3;
            Sta.joy += 3;
            Sta.population += 3;
            Sta.force += 3;
            Sta.trust += 3;
            this.String += "信仰済みだったため、国民が喜び全てのステータスが+3された。";
          } else {
            Religion = [3, 1, 3];
            this.String += "さぁ、太陽を称えましょう。";
          }
          break;
        case 58:
          this.String = "[ミチビキ]:これから道を紡いでいく。";
          Sta.trust += Math.floor(Sta.trust / 15);
          Sta.economy += Math.floor(Sta.economy / 15);
          Sta.force += Math.floor(Sta.force / 15);
          Sta.joy += Math.floor(Sta.joy / 15);
          Sta.population += Math.floor(Sta.population / 15);
          if (turn % 2 == 1) {
            Sta.trust += Math.floor(Sta.trust / 30);
            Sta.economy += Math.floor(Sta.economy / 30);
            Sta.force += Math.floor(Sta.force / 30);
            Sta.joy += Math.floor(Sta.joy / 30);
            Sta.population += Math.floor(Sta.population / 30);
            this.String += "さぁ行こう、太陽と共に。";
          }
          break;
        case 59:
          this.String = "[ハジマリ]:全ては始まりに等しく還った。";
          Sta.trust = -10;
          Sta.joy = 25;
          Sta.population = 7;
          Sta.force = 7;
          Sta.economy = 12;
          if (Religion[0] == 3) {
            Sta.trust += 20;
            Sta.joy += 20;
            Sta.population += 20;
            Sta.force += 20;
            Sta.economy += 20;
            this.String += "そして、太陽の加護を得た。";
          }
          break;
        //国王21の固有カード
        case 60:
          this.String = "[循環]:";
          if (turn % 2 == 1) {
            Sta.trust += Deck.sta.trust[posi] * -2;
            Sta.joy += Deck.sta.joy[posi] * -2;
            Sta.population += Deck.sta.population[posi] * -2;
            Sta.economy += Deck.sta.economy[posi] * -2;
            Sta.force += Deck.sta.force[posi] * -2;
            this.String += "循環のマイナスだ。";
          } else {
            this.String += "循環のプラスだ。";
          }
          break;
        case 61:
          var temp = Random.BetweenInteger(-1, 1);
          Sta.population += temp;
          this.String = "[漏出]:これにより[population]が" + temp + "上昇した。";
          break;
        case 62:
          this.String = "[怨炎魔術【異端者】]:スキルが1/2で無視される。";
          break;
        //国王22の固有カード
        case 63:
          this.String = "[スパイ]:このターンのイベントは無視される。また、";
          switch (Random.Integer(4)) {
            case 0:
              Sta.trust += 5;
              this.String += "[trust]";
              break;
            case 1:
              Sta.joy += 5;
              this.String += "[joy]";
              break;
            case 2:
              Sta.population += 5;
              this.String += "[population]";
              break;
            case 3:
              Sta.force += 5;
              this.String += "[force]";
              break;
            case 4:
              Sta.economy += 5;
              this.String += "[economy]";
              break;
          }
          ExEvent.probability = 0;
          this.String += "が+5された。";
          break;
        case 64:
          var flag = 1;
          this.String = "[血塗られたナイフ]:";
          for (var i = 0; i < CardRog.length; i++) {
            if (Deck.num[CardRog[i]] == 163) {
              Sta.trust += 20;
              this.String += "この時のための［スパイ］だったのだ。";
            }
          }

          if (flag == 1) {
            this.String += "なぜだろうか、信用が下がってしまった。";
          }
          break;
        case 65:
          Kingflag = 6;
          this.String = "少し待つんだ…。辛抱強くな…。";
          break;
        //国王23の固有カード
        case 66:
          this.String = "[乱雑詠唱]:";
          if (Never.Probability.length != 0) {
            var rand = Random.Integer(Never.Probability.length - 1);
            var j = Random.BetweenInteger(1, 6);
            for (var i = 0; i < j; i++) {
              if (Never.num[rand] != 136) {
                Never.Push(Never.num[rand], 100, "");
              } else {
                Never.num.push(136);
                Never.img.push(DictionaryCard.img[136]);
                Never.Probability.push(1000);
                Never.turn.push("");
                Never.name.push(DictionaryCard.name[136]);
                Never.skill.num1.push(DictionaryCard.skill.num1[136]);
                Never.skill.num2.push(DictionaryCard.skill.num2[136]);
                Never.skill.pow.push(DictionaryCard.skill.pow[136]);
              }
            }
            this.String += "乱雑な詠唱をした結果、[" + Never.name[rand] + "]が" + j + "個増えた。";
          } else {
            this.String += "継続効果カードが存在しなかった。";
          }
          break;
        case 67:
          var temp = Math.floor(Never.Probability.length / 2) + 2;
          for (var i = 0; i < temp; i++) {
            Never.num.push(136);
            Never.img.push(DictionaryCard.img[136]);
            Never.Probability.push(1000);
            Never.turn.push("");
            Never.name.push(DictionaryCard.name[136]);
            Never.skill.num1.push(DictionaryCard.skill.num1[136]);
            Never.skill.num2.push(DictionaryCard.skill.num2[136]);
            Never.skill.pow.push(DictionaryCard.skill.pow[136]);
          }
          this.String = "[恨みの書]:" + temp + "個[恨み]が継続効果カードに追加された。";
          break;
        case 68:
          var j = 0;
          var temp = Never.Probability.length;
          for (var i = 0; i < temp; i++) {
            if (Never.num[i - j] == 136) {
              Never.Probability.splice(i - j, 1);
              Never.img.splice(i - j, 1);
              Never.num.splice(i - j, 1);
              Never.turn.splice(i - j, 1);
              Never.name.splice(i - j, 1);
              Never.skill.num1.splice(i - j, 1);
              Never.skill.num2.splice(i - j, 1);
              Never.skill.pow.splice(i - j, 1);
              j++;
            }
          }
          Sta.economy += 2 * j;
          Sta.joy += 2 * j;
          Sta.trust += 2 * j;
          Sta.force += 2 * j;
          Sta.population += 2 * j;
          this.String = "[怨炎魔術【怨恨】]:全ステータスが" + (j * 2) + "上昇した。";
          break;
        //国王24の固有カード
        case 69:
          var rand = Random.Integer(4);
          Never.num.push(139 + rand);
          Never.img.push(DictionaryCard.img[139 + rand]);
          Never.Probability.push(1001 + rand);
          Never.turn.push("");
          Never.name.push(DictionaryCard.name[139 + rand]);
          Never.skill.num1.push(DictionaryCard.skill.num1[139 + rand]);
          Never.skill.num2.push(DictionaryCard.skill.num2[139 + rand]);
          Never.skill.pow.push(DictionaryCard.skill.pow[139 + rand]);
          this.String = "[降臨]:シークレット継続効果カードの【デビル】から" + DictionaryCard.name[139 + rand] + "を召喚した。";
          break;
        case 70:
          var devil = [0, 0, 0, 0, 0];
          var temp = Never.Probability.length;
          var add = 0;
          for (var i = 0; i < temp; i++) {
            if (Never.num[i - add] > 138 && Never.num[i - add] < 144) {
              Never.Probability.splice(i - add, 1);
              Never.img.splice(i - add, 1);
              Never.num.splice(i - add, 1);
              Never.turn.splice(i - add, 1);
              Never.name.splice(i - add, 1);
              Never.skill.num1.splice(i - add, 1);
              Never.skill.num2.splice(i - add, 1);
              Never.skill.pow.splice(i - add, 1);
              devil[Never.num[i - add] - 139]++;
              add++;
            }
          }
          var temp = [devil[1] * 2 + devil[2] * 2 + devil[3] * 2 + devil[4] * 2,
          devil[0] * 2 + devil[2] * 2 + devil[3] * 2 + devil[4] * 2,
          devil[0] * 2 + devil[1] * 2 + devil[3] * 2 + devil[4] * 2,
          devil[0] * 2 + devil[1] * 2 + devil[2] * 2 + devil[4] * 2,
          devil[0] * 2 + devil[1] * 2 + devil[2] * 2 + devil[3] * 2
          ];
          Sta.trust += temp[0];
          Sta.joy += temp[1];
          Sta.population += temp[2];
          Sta.force += temp[3];
          Sta.economy += temp[4];
          this.String = "[悪夢を喰う]:このスキルで、全ての【デビル】が付く継続効果カードを消去し、それぞれのステータスが上昇した。<br>[trust]:" + temp[0] + "  [joy]:" + temp[1] + "  [population]:" + temp[2] + "  [force]:" + temp[3] + "  [economy]:" + temp[4];
          break;
        case 71:
          for (var i = 0; i < 5; i++) {
            for (var j = 0; j < 2; j++) {
              Never.num.push(139 + i);
              Never.img.push(DictionaryCard.img[139 + i]);
              Never.Probability.push(1001 + i);
              Never.turn.push("");
              Never.name.push(DictionaryCard.name[139 + i]);
              Never.skill.num1.push(DictionaryCard.skill.num1[139 + i]);
              Never.skill.num2.push(DictionaryCard.skill.num2[139 + i]);
              Never.skill.pow.push(DictionaryCard.skill.pow[139 + i]);
            }
          }
          this.String = "[最後の晩餐]:さぁ、会合の時間だ。";
          break;
        //国王25の固有カード
        case 72:
          Sta.trust -= 50;
          for (var i = 0; i < 4; i++) {
            Never.Push(29, 100, "");
          }
          this.String = "[崩壊の運命]:[trust]が-50された。代わりに、[呪いの触手]が継続効果カードに四枚追加された。";
          break;
        case 73:
          Never.Push(posi, 100, "");
          this.String = "[呪いの触手]:[trust]を+2し続ける[呪いの触手]を継続効果カードに追加した。";
          break;
        case 74:
          var add = [0, 0, 0, 0, 0];
          var rand = 0;
          for (var i = 0; i < Never.Probability.length; i++) {
            if (Deck.num[Never.num[i]]) {
              rand = Random.Integer(4);
              switch (rand) {
                case 0:
                  Sta.trust += 3;
                  break;
                case 1:
                  Sta.joy += 3;
                  break;
                case 2:
                  Sta.population += 3;
                  break;
                case 3:
                  Sta.force += 3;
                  break;
                case 4:
                  Sta.economy += 3;
                  break;
              }
              add[rand] += 3;
              rand = Random.Integer(4);
              switch (rand) {
                case 0:
                  Sta.trust -= 1;
                  break;
                case 1:
                  Sta.joy -= 1;
                  break;
                case 2:
                  Sta.population -= 1;
                  break;
                case 3:
                  Sta.force -= 1;
                  break;
                case 4:
                  Sta.economy -= 1;
                  break;
              }
              add[rand] -= 1;
            }
          }
          this.String = "[導きの指]:導き通りへ進んだ。<br>[trust]:" + add[0] + "  [joy]:" + add[1] + "  [population]:" + add[2] + "  [force]:" + add[3] + "  [economy]:" + add[4];
          break;
        //国王26の固有カード
        case 75:
          Religion = ["", "", ""];
          this.String = "[蛇の加護]:信じる物はなくなった。";
          break;
        case 76:
          this.String = "[殺戮の意志]:特殊スキルなし。";
          break;
        case 77:
          var Ave = Math.floor((Sta.trust + Sta.joy + Sta.population + Sta.force + Sta.economy) / 5);
          Sta.trust = Ave;
          Sta.joy = Ave;
          Sta.population = Ave;
          Sta.force = Ave;
          Sta.economy = Ave;
          this.String = "[偏りなき正義]:これにより、平均の[" + Ave + "]に均された。";
          break;
        //国王27の固有カード
        case 78:
          Never.Push(posi, 100, "");
          this.String = "[猿化計画]:継続効果カードに[trust]を+4し続ける、[猿化計画]を追加する。";
          break;
        case 79:
          ExEvent.clear = 1;
          this.String = "[獲物]:次のイベントは報酬を必ず得る。";
          break;
        case 80:
          Never.Push(26, 100, "");
          this.String = "[眼光]:継続効果カードに[trust]を+4し続ける、[猿化計画]を追加する。";
          break;
        //国王28の固有カード
        case 81:
          for (var i = 0; i < Never.Probability.length; i++) {
            if (Never.num[i] == 136) {
              Never.Probability[i] = 1006;
              Never.img[i] = DictionaryCard.img[156];
              Never.num[i] = 156;
              Never.turn[i] = "";
              Never.name[i] = DictionaryCard.name[156];
              Never.skill.num1[i] = DictionaryCard.skill.num1[156];
              Never.skill.num2[i] = DictionaryCard.skill.num2[156];
              Never.skill.pow[i] = DictionaryCard.skill.pow[156];
            }
          }
          this.String = "[忘却される苦しみ]:[恨み]は[幸福]へと忘れられた。";
          break;
        case 82:
          var days = (Math.floor(turn / 2) + 1) * 2;
          for (var i = 0; i < days; i++) {
            Never.num.push(136);
            Never.img.push(DictionaryCard.img[136]);
            Never.Probability.push(1000);
            Never.turn.push("");
            Never.name.push(DictionaryCard.name[136]);
            Never.skill.num1.push(DictionaryCard.skill.num1[136]);
            Never.skill.num2.push(DictionaryCard.skill.num2[136]);
            Never.skill.pow.push(DictionaryCard.skill.pow[136]);
          }
          this.String = "[焼却]:" + days + "個の【恨み】を追加した。";
          break;
        case 83:
          var i;
          for (i = 0; i < Never.Probability.length; i++) {
            Never.Probability.shift();
            Never.img.shift();
            Never.num.shift();
            Never.turn.shift();
            Never.skill.num1.shift();
            Never.skill.num2.shift();
            Never.skill.pow.shift();
          }
          Sta.economy += i;
          Sta.trust += i;
          this.String = "[燃やし尽くす]:継続効果カードを全て削除し、[trust]と[economy]を+" + i + "する。";
          break;
        //国王29の固有カード
        case 84:
          for (var i = 0; i < 5; i++) {
            Never.num.push(139 + i);
            Never.img.push(DictionaryCard.img[139 + i]);
            Never.Probability.push(1001 + i);
            Never.turn.push("");
            Never.name.push(DictionaryCard.name[139 + i]);
            Never.skill.num1.push(DictionaryCard.skill.num1[139 + i]);
            Never.skill.num2.push(DictionaryCard.skill.num2[139 + i]);
            Never.skill.pow.push(DictionaryCard.skill.pow[139 + i]);
          }
          this.String = "[スーパーファイアー]:悪魔を全て召喚した。";
          break;
        case 85:
          var temp = Never.Probability.length;
          var add = 0;
          for (var i = 0; i < temp; i++) {
            if (Never.num[i - add] > 138 && Never.num[i - add] < 144) {
              Never.Probability.splice(i - add, 1);
              Never.img.splice(i - add, 1);
              Never.num.splice(i - add, 1);
              Never.turn.splice(i - add, 1);
              Never.name.splice(i - add, 1);
              Never.skill.num1.splice(i - add, 1);
              Never.skill.num2.splice(i - add, 1);
              Never.skill.pow.splice(i - add, 1);
              devil[Never.num[i - add] - 139]++;
              add++;
            }
          }
          Sta.economy += add;
          Sta.trust += add;
          Sta.joy += add;
          Sta.force += add;
          Sta.population += add;
          this.String = "[魔払い]:全ての悪魔が糧になった。";
          break;
        case 86:
          var rand;
          this.String = "[オーバーサモン]:このスキルにより、";
          for (var i = 0; i < 20; i++) {
            rand = Random.Integer(4);
            this.String += "[" + DictionaryCard.name[139 + rand] + "]";
            Never.num.push(139 + rand);
            Never.img.push(DictionaryCard.img[139 + rand]);
            Never.Probability.push(1001 + rand);
            Never.turn.push("");
            Never.name.push(DictionaryCard.name[139 + rand]);
            Never.skill.num1.push(DictionaryCard.skill.num1[139 + rand]);
            Never.skill.num2.push(DictionaryCard.skill.num2[139 + rand]);
            Never.skill.pow.push(DictionaryCard.skill.pow[139 + rand]);
          }
          this.String += "が召喚された。";
          break;
        //国王30の固有カード
        case 87:
        case 88:
        case 89:
          this.String = "[王の夢]:";
          for (var i = 0; i < 7; i++) {
            switch (Random.Integer(4)) {
              case 0:
                Sta.trust += 25;
                this.String += "[trust]";
                break;
              case 1:
                Sta.joy += 25;
                this.String += "[joy]";
                break;
              case 2:
                Sta.population += 25;
                this.String += "[population]";
                break;
              case 3:
                Sta.force += 25;
                this.String += "[force]";
                break;
              case 4:
                Sta.economy += 25;
                this.String += "[economy]";
                break;
            }
            this.String+="が+25、";
          }
          this.String+="された。";
          break;
        //最後の国王の固有カード
        case 9899:
          break;
      }
    }
  },

  Day: function (now) {
    var day;
    switch (now) {
      case 0:
        day = "朝";
        break;
      case 1:
        day = "夜";
        break;
    }
    return day;
  },

  /**
   * 王の固有スキルのswitch
   * @param {Number} type 確認のタイミング  0=使用直後 1=ゲーム開始時 2=カードドロー時 -1=ゲームオーバ時
   * @param {Number} num 何のカードを使ったか
   */
  King: function (type, num) {
    var flag = 0;
    switch (url_char) {
      case 0:
        if (Deck.skill.kinds[num] == 1 && Deck.sta.economy[num] < 0 && type == 0) {
          Sta.economy -= 2;
          flag = 1;
        }
        break;
      case 1:
        if (type == 0) {
          if (Deck.sta.economy[num] > 0) {
            Sta.trust += 2;
            Sta.joy += 2;
            Sta.population += 2;
            Sta.economy += 2;
            Sta.force += 2;
            flag = 1;
          } else if (Deck.sta.economy[num] < 0) {
            Sta.trust -= 3;
            Sta.joy -= 3;
            Sta.population -= 3;
            Sta.economy -= 3;
            Sta.force -= 3;
            flag = 1;
          }
          if (Deck.sta.trust[num] > 0) {
            Sta.trust += 2;
            Sta.joy += 2;
            Sta.population += 2;
            Sta.economy += 2;
            Sta.force += 2;
            flag = 1;
          } else if (Deck.sta.trust[num] < 0) {
            Sta.trust -= 3;
            Sta.joy -= 3;
            Sta.population -= 3;
            Sta.economy -= 3;
            Sta.force -= 3;
            flag = 1;
          }
          if (Deck.sta.population[num] > 0) {
            Sta.trust += 2;
            Sta.joy += 2;
            Sta.population += 2;
            Sta.economy += 2;
            Sta.force += 2;
            flag = 1;
          } else if (Deck.sta.population[num] < 0) {
            Sta.trust -= 3;
            Sta.joy -= 3;
            Sta.population -= 3;
            Sta.economy -= 3;
            Sta.force -= 3;
            flag = 1;
          }
          if (Deck.sta.joy[num] > 0) {
            Sta.trust += 2;
            Sta.joy += 2;
            Sta.population += 2;
            Sta.economy += 2;
            Sta.force += 2;
            flag = 1;
          } else if (Deck.sta.joy[num] < 0) {
            Sta.trust -= 3;
            Sta.joy -= 3;
            Sta.population -= 3;
            Sta.economy -= 3;
            Sta.force -= 3;
            flag = 1;
          }
          if (Deck.sta.force[num] > 0) {
            Sta.trust += 2;
            Sta.joy += 2;
            Sta.population += 2;
            Sta.economy += 2;
            Sta.force += 2;
            flag = 1;
          } else if (Deck.sta.force[num] < 0) {
            Sta.trust -= 3;
            Sta.joy -= 3;
            Sta.population -= 3;
            Sta.economy -= 3;
            Sta.force -= 3;
            flag = 1;
          }
        }
        break;
      case 2:
        if (type == 1) {
          Sta.force += 20;
          Sta.trust += 20;
          flag = 1;
        }
        break;
      case 3:
        drow = 2;
        if (type == 1) {
          flag = 1;
        }
        break;
      case 4:
        drow = 5;
        if (type == 1) {
          flag = 1;
        }
        break;
      case 5:
        if (type == 1 && Deck.sta.economy[num] > 0 && Sta.population > 0) {
          Sta.economy += Deck.sta.economy[num] * Math.floor(Sta.population / 100);
          flag = 1;
        }
        break;
      case 6:
        if (type == 1 && Deck.sta.population[num] < 0) {
          Sta.population -= Deck.sta.population[num];
        } else if (type == 1 && Deck.sta.population[num] > 0) {
          Sta.population -= Math.floor(Deck.sta.population[num]);
        }
        break;
      case 7:
        if (type == 1) {
          Sta.force -= 20;
          Sta.trust -= 10;
          Sta.force += 40;
          flag = 1;
        }
        break;
      case 8:
        if (type == 0 && Deck.sta.population[num] < 0) {
          Sta.trust += 2;
          flag = 1;
        }
        break;
      case 9:
        if (type == -1) {
          var search = 0;
          Sta.economy -= 10;
          Sta.force -= 10;
          Sta.population -= 10;
          Sta.trust -= 10;
          Sta.joy -= 10;
          for (i = 1; i < 5; i++) {
            if (pic(search) > pic(i)) {
              search = i;
            }
          }
          switch (search) {
            case 0:
              Sta.trust += 20;
              break;
            case 1:
              Sta.joy += 20;
              break;
            case 2:
              Sta.population += 20;
              if (Sta.Probability.pop[0] >= Random.Integer(100)) {
                Sta.population += Sta.Probability.pop[1];
                this.String += "<span class=\"txtI\">Info</span>:Joy増加のボーナスでpopulation増加量が<span class=\"txtP\">[+" + Sta.Probability.pop[1] + "]</span>増加した！<br>";
              }
              break;
            case 3:
              Sta.force += 20;
              break;
            case 4:
              Sta.economy += 20;
              break;
          }
        }
        break;
      case 10:
        if (type == 0) {
          Cardsystem(num);
        }
        break;
      case 11:
        if (type == 0) {
          var temp = [0, 0, 0, 0, 0];
          var sta = [0, 1, 2, 3, 4];
          for (var i = 0; i < temp.length; i++) {
            var tempI = Random.Integer(4);
            temp[i] = Sta.pic(sta[tempI]);
            sta[tempI] = null;
          }
          for (var i = 0; i < temp.length; i++) {
            switch (i) {
              case 0:
                Sta.trust = temp[i];
                break;
              case 1:
                Sta.joy = temp[i];
                break;
              case 2:
                Sta.population = temp[i];
                break;
              case 3:
                Sta.force += temp[i];
                break;
              case 4:
                Sta.economy += temp[i];
                break;
            }
          }
          flag = 1;
        }
        break;
      case 12:
        if (type == 0 && turn % 5 == 0 && turn != 0) {
          switch (Random.Integer(4)) {
            case 0:
              Sta.trust = 30;
              break;
            case 1:
              Sta.joy = 30;
              break;
            case 2:
              Sta.population = 30;
              break;
            case 3:
              Sta.force += 30;
              break;
            case 4:
              Sta.economy += 30;
              break;
          }
          flag = 1;
        }
        break;
      case 13:
        break;
      case 14:
        break;
      case 15:
        break;
      case 16:
        break;
      case 17:
        if (Deck.num[num] != 151) {

        }
        break;
      case 18:

        break;
      case 19:

        break;
      case 20:
        if (Deck.num[num] != 151 || Random.Integer(1) == 0) {

        }
        break;
      case 21:
        if (Deck.num[num] != 151 || Random.Integer(1) == 0) {

        }
        if (type == 1 && Kingflag != 1) {
          Kingflag--;
          if (Kingflag == 1) {
            Sta.joy += 70;
            Sta.trust += 70;
            Sta.population += 70;
            Sta.economy += 70;
            Sta.force += 70;
          }
        }
        break;
    }
    if (flag == 1) {
      StrRog += "<br>" + King.Name + "のスキル発動『" + King.Info.skill[0] + "』<br>[効果内容:" + King.Info.skill[1] + "]<br><br>"
    }
  }
}

/**
 * 乱数生成用オブジェクト
 */
let Random = {
  /**
   * 整数乱数生成
   * 
   * @param {number} max 最大値（最小値は0で規定） 
   * @returns {number} 生成された乱数
   */
  Integer: (max) => {
    return Math.floor(Math.random() * (max + 1));
  },
  /**
   * 一定間の整数乱数生成
   * 
   * @param {number} from 最小値
   * @param {number} to 最大値
   * @returns {number} 生成された乱数
   */
  BetweenInteger: (from, to) => {
    return Random.Integer(to - from) + from;
  }
}

/**
 * 文章用のボックスに出力する関数
 * @param {string} str 出力文 
 */
function play(str) {
  const talk = document.getElementById("talk");
  talk.innerHTML = str;
}

//変数宣言
/**整数の仮箱 */
var int = 0;
/**ステージ管理 */
var stage = 0;
//準備
let params = new URLSearchParams(document.location.search);
/**キャラクターナンバー */
var url_char = 0;
//Number(params.get("Charname"));

/**
 * 次のステージに進む判定
 * @param {Number} Bool 理論値
 * @param {Number} Ture 成功値
 */
let StageNext = (Bool, Ture) => { if (Bool == Ture) stage++ }

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
    spinner.className = "Lode fade-out";
    spinner.addEventListener('animationend', () => {
      spinner.style.display = "none";
    })
  }
}

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
  /**死体処理班１　一回適当な変数においておく */
  const response1 = await fetch(apiURL);
  /**死体処理班２　一回適当な変数においておく */
  const response2 = await fetch(apiURL_deck);
  /**ここでやっとクリア１　キャラクターのデータ羅列 */
  const data = await response1.json();
  /**ここでやっとクリア２　カードのデータ羅列 */
  const deck = await response2.json();

  //push祭りじゃー！//
  /*キャラクターソイ！*/
  King.Name = data[url_char].jp_name;
  King.Img = data[url_char].img;
  King.Info.skill = [data[url_char].skillname, data[url_char].skillinfo];
  King.Info.deck = data[url_char].deck;


  /*カードーソイ！*/
  for (var i = 0; i < 32; i++) {
    Deck.num.push(deck[King.Info.deck[i]].num);
    Deck.name.push(deck[King.Info.deck[i]].name);
    Deck.sta.economy.push(deck[King.Info.deck[i]].economy);
    Deck.sta.force.push(deck[King.Info.deck[i]].force);
    Deck.img.push("." + deck[King.Info.deck[i]].img);
    Deck.sta.joy.push(deck[King.Info.deck[i]].joy);
    Deck.sta.population.push(deck[King.Info.deck[i]].population);
    Deck.sta.trust.push(deck[King.Info.deck[i]].trust);
    Deck.skill.kinds.push(deck[King.Info.deck[i]].s_kinds);
    Deck.skill.pow.push(deck[King.Info.deck[i]].s_pow);
    Deck.skill.num1.push([deck[King.Info.deck[i]].s_kn1, deck[King.Info.deck[i]].s_n1]);
    Deck.skill.num2.push([deck[King.Info.deck[i]].s_kn2, deck[King.Info.deck[i]].s_n2]);
  }

  King.Info.deck = data[url_char].deck;

  for (var i = 0; i < deck.length; i++) {
    console.log(deck, i);
    DictionaryCard.num.push(deck[i].num);
    DictionaryCard.name.push(deck[i].name);
    DictionaryCard.sta.economy.push(deck[i].economy);
    DictionaryCard.sta.force.push(deck[i].force);
    DictionaryCard.img.push("." + deck[i].img);
    DictionaryCard.sta.joy.push(deck[i].joy);
    DictionaryCard.sta.population.push(deck[i].population);
    DictionaryCard.sta.trust.push(deck[i].trust);
    DictionaryCard.skill.kinds.push(deck[i].s_kinds);
    DictionaryCard.skill.pow.push(deck[i].s_pow);
    DictionaryCard.skill.num1.push([deck[i].s_kn1, deck[i].s_n1]);
    DictionaryCard.skill.num2.push([deck[i].s_kn2, deck[i].s_n2]);
  }
}

/**
 * カードをセットする関数
 * @param {number} set 0,正常　1,番号に付随
 * @param {number} num カード番号
 */
function cardSet(set, num) {
  var cardNum;

  console.log(num);
  if (set == 0) {
    for (var i = 0; i < drow; i++) {
      cardNum = Random.BetweenInteger(0, Deck.img.length - 1);
      cardPosi[i] = cardNum;
      Id.action[i].src = Deck.img[cardNum];
      Id.card[i].setAttribute('onclick', "cardClick(" + cardNum + ")");
      Id.Info[i].textContent = Deck.name[cardNum];
      Id.Info[i].style.display = "block"
      Id.card[i].style.display = "block"
    }
    for (var i = 0; i < drow; i++) {
      Id.card[i].className = "fade-in";
      Id.Info[i].className = "info_action fade-in";
    }
  } else {
    cardPosi[0] = num;
    Id.action[0].src = Deck.img[num];
    Id.card[0].setAttribute('onclick', "cardClick(" + num + ")");
    Id.Info[0].textContent = Deck.name[num];
    for (var i = 1; i < 3; i++) {
      cardNum = Random.BetweenInteger(0, Deck.img.length - 1);
      cardPosi[i] = cardNum;
      Id.action[i].src = Deck.img[cardNum];
      Id.card[i].setAttribute('onclick', "cardClick(" + cardNum + ")");
      Id.Info[i].textContent = Deck.name[cardNum];
      Id.card[i].style.display = "block"
      Id.Info[i].style.display = "block"
    }
    for (var i = 0; i < 3; i++) {
      Id.card[i].className = "fade-in";
      Id.Info[i].className = "info_action fade-in";
    }
  }
}

/**
 * オーディオ、キャラクター選択画面を開始する処理
 */
function start() {
  //オーディオ再生
  if (OK != 1) {
    var audio = new Audio('sham.mp3');
    audio.loop = true;
    audio.play();
  }
  OK = 1;
}

/**
 * ゲームを始める前の処理
 */
async function setting() {
  await SetData();
  onLode(1);
  Switch.King(1, -1);
  //初めのディレイでのbarとbox同期
  setTimeout(function () { Sta.bar(); Sta.box(); }
    , 250);
  cardSet(0, 0);
  onLode(0);
  document.getElementById('dis').className = "";
}

/**
 * クリック音の関数
 */
function SoundPlay() {
  document.getElementById('sound').currentTime = 0; //連続クリックに対応
  document.getElementById('sound').play(); //クリックしたら音を再生
}

/**
 * 特殊効果音の関数
 */
function SEPlay() {
  document.getElementById('pow-SE').currentTime = 0; //連続クリックに対応
  document.getElementById('pow-SE').play(); //クリックしたら音を再生
}

/**
 * カードホバー時のSE
 * @param {Number} num 位置保存変数
 */
function SECard(num) {
  document.getElementById('card-SE').currentTime = 0;
  document.getElementById('card-SE').play();
  Id.action[num].className = ""; window.requestAnimationFrame(function (time) {
    window.requestAnimationFrame(function (time) {
      Id.action[num].className = "UDani";
    });
  });
}

/**
 * ターン数計算と、それに付随した計算
 */
function story() {

  console.log(turn, stage);
  switch (stage) {
    case 0:
      console.log(string2.length, int);
      if (localStorage.getItem("key") == '1') {
        play(string2[int])
        if (int <= string2.length - 1) {
          StrRog += string2[int] + "<br>";
        }
      } else {
        play(string1[int]);
        if (int <= string1.length - 1) {
          StrRog += string1[int] + "<br>";
        }
        StageNext(int, string1.length);
      }
      console.log(string1.length, int);
      int++;
      if (localStorage.getItem("key") == 1 && int == string2.length + 1) {
        console.log("OK");
        StageNext(1, 1);
        Turnflag = 1;
        int = -1;
      }
      if (int == string1.length + 1 || int < 0) {
        console.log("let");
        start();
        StrRog += "<br>";
        Turnflag = 1;
      }
      break;
    case 1:
      StageNext(turn, 21);
      break;
    case 2:
      break;
  }
  if (Turnflag == 1) {
    localStorage.setItem("key", 1);
    var str = Math.floor(turn / 2 + 1) + "日目:" + Switch.Day(turn % 2) + "（" + (turn + 1) + "ターン目）<br>このターンに何かのイベントが発生する確率:" + ExEvent.probability + "%<br>";
    if (Math.floor(turn / 2 + 1) % 5 == 0 && turn != 0 && turn % 2 == 1) {
      var j = Never.Probability.length;
      var add = 0;
      for (var i = 0; i < j; i++) {
        if (Never.num[i - add] > 138 && Never.num[i - add] < 144) {
          Never.Probability.splice(i - add, 1);
          Never.img.splice(i - add, 1);
          Never.num.splice(i - add, 1);
          Never.turn.splice(i - add, 1);
          Never.name.splice(i - add, 1);
          Never.skill.num1.splice(i - add, 1);
          Never.skill.num2.splice(i - add, 1);
          Never.skill.pow.splice(i - add, 1);
          devil[Never.num[i - add] - 139]++;
          add++;
        }
      }
      Sta.economy += add;
      Sta.trust += add;
      Sta.joy += add;
      Sta.force += add;
      Sta.population += add;
      str += "[魔払い]:5日経ったため、全ての悪魔が糧になった。";
    }
    turn++;
    StrRog += str;
    str += "今の国王:" + King.Name;
    play(str);
    cardOk = 1;
    temp = str;
  }
}

/**
 * カードの処理関数
 * @param {number} num カード識別番号
 */
function Cardsystem(num) {
  var string;
  NumSetting[0] = 0;
  NumSetting[1] = 0;
  cardOk = 0;
  CardRog.push(num);
  Old_sta = [Sta.trust, Sta.joy, Sta.population, Sta.economy, Sta.force];
  Sta.trust += Deck.sta.trust[num];
  Sta.joy += Deck.sta.joy[num];
  Sta.population += Deck.sta.population[num];
  Sta.economy += Deck.sta.economy[num];
  Sta.force += Deck.sta.force[num];
  string = "<span class=\"txtT\">Trustが[" + Deck.sta.trust[num] + "%]上昇</span><br><span class=\"txtJ\">Joyが[" + Deck.sta.joy[num] + "%]上昇</span><br><span class=\"txtP\">Populationが[" + Deck.sta.population[num] + "%]上昇</span><br><span class=\"txtF\">Forceが[" + Deck.sta.force[num] + "%]上昇</span><br><span class=\"txtE\">Economyが[" + Deck.sta.economy[num] + "%]上昇</span>";
  Sta.ProSta();
  if (Deck.sta.population[num] > 0 && Sta.Probability.pop[0] >= Random.Integer(100)) {
    Sta.population += Sta.Probability.pop[1];
    string += "<br><span class=\"txtI\">Info</span>:Joy増加のボーナスでpopulation増加量が<span class=\"txtP\">[+" + Sta.Probability.pop[1] + "]</span>増加した！<br>";
  }
  Sta.ProSta();
  Sta.bar();
  Sta.box();
  play(string);
  SEPlay();
  StrRog += "<span class=\"txtO\">" + Deck.name[num] + "</span>:<br>" + string + "<br><br>";
  setTimeout(() => {
    if (Deck.skill.kinds[num] !== "" && Sta.Probability.act >= Random.Integer(100)) {
      Switch.Action.Skill(num);
      play(Switch.Action.String);
      SEPlay();
      StrRog += "<span class=\"txtO\">" + Deck.name[num] + "</span>:<br>" + Switch.Action.String + "<br><br>";
      setTimeout(() => {
        Sta.ProSta();
        Sta.bar();
        Sta.box();
        checkNever();
      }, 3000);
    } else if (Deck.skill.kinds[num] !== "") {
      play(Deck.name[num] + ":確率に失敗し100%行動できず、スキルが無効化されてしまった。");
      StrRog += Deck.name[num] + ":確率に失敗し100%行動できず、スキルが無効化されてしまった。<br><br>";
      setTimeout(() => {
        Sta.ProSta();
        Sta.bar();
        Sta.box();
        checkNever();
      }, 3000);
    } else {
      Sta.ProSta();
      Sta.bar();
      Sta.box();
      checkNever();
    }
  }, 3000);

}

function checkNever() {
  var flag = 0;
  Never.Switch.Religion();
  for (var i = 0; i < Never.skill.num1.length; i++) {
    Never.Switch.Action(i);
    flag = 1;
  }
  if (flag == 1) {
    SEPlay();
  }
  Sta.ProSta();
  Sta.bar();
  Sta.box();
  play(Never.Switch.String);
  StrRog += Never.Switch.String;
  Never.Switch.String = "";
  setTimeout(() => {
    cardSet(NumSetting[0], NumSetting[1]);
    story();
    cardOk = 1;
  }, IFtime(Never.skill.num1.length));
}

const IFtime = (num) => { if (num < 8) { return num * 1000 } else { return 8000 } };

//////////////////////////////////////////////////////////////////////////

/******************************************************************
 * 初めの呼ばれる関数たち
 */
onLode(0);
setting();
/**
 * 
 ******************************************************************/


/*******************************************************************
*clickされたときの関数たち
*/

function ClickStory() {
  SoundPlay();
  switch (stage) {
    case 0:
      story();
      break;
  }
  if (stage != 0) {
    modeOk = 1;
  }
}

function cardClick(num) {
  if (cardOk == 1 && modeOk == 1) {
    SoundPlay();

    for (var i = 0; i < drow; i++) {
      Id.card[i].className += " fade-out";
      Id.Info[i].className += " fade-out";
    }

    Cardsystem(num);
    Switch.King(0, num);
  }
}

function StrLog() {
  SoundPlay();
  modeOk = 0;
  document.getElementById("stats").innerHTML = "<p class=\"talk\" id=\"Log\"><b>※ステータスバーに戻らないと、カード選択はできません。</b><br>" + StrRog + "</p>";
}

function Default() {
  SoundPlay();
  if (stage != 0) {
    modeOk = 1;
  }
  document.getElementById("stats").innerHTML = `<div class="status" id="trust">
  <p class="info">trust</p>
  <p class="box" id="tru-box"></p>
  <div class="frame">
      <div class="bar" id="tru-bar"></div>
  </div>
</div>
<div class="status" id="joy">
  <p class="info">joy</p>
  <p class="box" id="joy-box"></p>
  <div class="frame">
      <div class="bar" id="joy-bar"></div>
  </div>
</div>
<div class="status" id="population">
  <p class="info">population</p>
  <p class="box" id="pop-box"></p>
  <div class="frame">
      <div class="bar" id="pop-bar"></div>
  </div>
</div>
<div class="status" id="force">
  <p class="info">force</p>
  <p class="box" id="for-box"></p>
  <div class="frame">
      <div class="bar" id="for-bar"></div>
  </div>
</div>
<div class="status" id="economy">
  <p class="info">economy</p>
  <p class="box" id="eco-box"></p>
  <div class="frame">
      <div class="bar" id="eco-bar"></div></div></div>`;
  Id.status = [
    document.getElementById("trust")
    , document.getElementById("joy")
    , document.getElementById("population")
    , document.getElementById("force")
    , document.getElementById("economy")
    , document.getElementById("status")
  ];
  Id.card = [
    document.getElementById("click1")
    , document.getElementById("click2")
    , document.getElementById("click3")
  ];
  Id.action = [
    document.getElementById("action1")
    , document.getElementById("action2")
    , document.getElementById("action3")
  ];
  Id.box = [
    document.getElementById("tru-box")
    , document.getElementById("joy-box")
    , document.getElementById("pop-box")
    , document.getElementById("for-box")
    , document.getElementById("eco-box")
  ];
  Id.bar = [
    document.getElementById("tru-bar")
    , document.getElementById("joy-bar")
    , document.getElementById("pop-bar")
    , document.getElementById("for-bar")
    , document.getElementById("eco-bar")
  ];
  Id.status[0].addEventListener("mouseover", function (event) {
    if (stage != 0 && cardOk == 1) {
      Outof = 0;
      play("現在の信頼度:<span class=\"txtT\">[" + Sta.trust + "%]</span><br>行動が100%実行される確率:<span class=\"txtT\">[" + Sta.Probability.act + "%]</span>");
    }
  }, false);

  Id.status[1].addEventListener("mouseover", function (event) {
    if (stage != 0 && cardOk == 1) {
      Outof = 0;
      play("現在の国の楽しさ:<span class=\"txtJ\">[" + Sta.joy + "%]</span><br>populationが増えやすくなる確率:<span class=\"txtJ\">[" + Sta.Probability.pop[0] + "%]</span><br>populationが増えた時の増加量:<span class=\"txtJ\">[+" + Sta.Probability.pop[1] + "%]</span>");
    }
  }, false);

  Id.status[2].addEventListener("mouseover", function (event) {
    if (stage != 0 && cardOk == 1) {
      Outof = 0;
      play("現在の人口:<span class=\"txtP\">[" + Sta.population + "%]</span><br>" + (turn % 9 + 1) + "ターン後に増えるeconomyの量:<span class=\"txtP\">[" + Sta.Probability.eco + "%]</span>");
    }
  }, false);

  Id.status[3].addEventListener("mouseover", function (event) {
    if (stage != 0 && cardOk == 1) {
      Outof = 0;
      play("現在の国の勢力:<span class=\"txtF\">[" + Sta.force + "%]</span><br>戦闘系イベントにおいての勝率:<span class=\"txtF\">[" + Sta.Probability.act + "%]</span>");
    }
  }, false);

  Id.status[4].addEventListener("mouseover", function (event) {
    if (stage != 0 && cardOk == 1) {
      Outof = 0;
      play("現在の保持金額:<span class=\"txtE\">[" + Sta.economy + "%]</span>");
    }
  }, false);
  Sta.ProSta();
  Sta.box();
  Sta.bar();
}

function bilding() {
  modeOk = 0;
  document.getElementById("stats").innerHTML = "<p class=\"talk\" id=\"Log\"><b>※ステータスバーに戻らないと、カード選択はできません。<br>   クリックすると詳細が見れるよ。</b><br><span id=\"bilding\"></span><p>";
  for (i = 0; i < Never.img.length; i++) {
    const html = document.createRange().createContextualFragment(`
    <picture id="bilding" onclick="BildInfo(`+ Never.num[i] + `)" style="display: block;"><img class="bilding" src="` + Never.img[i] + `"></picture>
    `);

    document.getElementById("bilding").appendChild(html);
  }

}

function BildInfo(num) {
  if (Deck.name[num] != undefined) {
    play("[" + Deck.name[num] + "]<br>" + Switch.Skill(num));
  } else {
    play("[" + DictionaryCard.name[num] + "]<br>" + DictionaryCard.skill.kinds[num]);
  }
}

/*
********************************************************************/

/*////////////////////////////////////////////////////////////////////////////////



/**
* 拡大縮小禁止
*/
document.documentElement.addEventListener('touchstart', function (e) {
  if (e.touches.length >= 2) { e.preventDefault(); }
}, { passive: false });

//カーソルが乗った時処理

Id.action[0].addEventListener("mouseover", function (event) {
  var hobnum;
  Outof = 0;
  console.log("Hov of 1");
  if (stage != 0 && cardOk == 1) {
    hobnum = cardPosi[0];
    play("カード名 『" + Deck.name[hobnum] + "』<br>ステータス: <span class=\"txtT\">Trust[" + Deck.sta.trust[hobnum] + "]</span>   <span class=\"txtJ\">Joy[" + Deck.sta.joy[hobnum] + "]</span>   <span class=\"txtP\">Population[" + Deck.sta.population[hobnum] + "]</span>   <span class=\"txtF\">Force[" + Deck.sta.force[hobnum] + "]</span>   <span class=\"txtE\">Economy[" + Deck.sta.economy[hobnum] + "]</span><br>スキル:" + Switch.Skill(hobnum));
    SECard(0);
  }
}, false);

Id.action[1].addEventListener("mouseover", function (event) {
  var hobnum;
  console.log("Hov of 2");
  if (stage != 0 && cardOk == 1) {
    Outof = 0;
    hobnum = cardPosi[1];
    play("カード名 『" + Deck.name[hobnum] + "』<br>ステータス: <span class=\"txtT\">Trust[" + Deck.sta.trust[hobnum] + "]</span>   <span class=\"txtJ\">Joy[" + Deck.sta.joy[hobnum] + "]</span>   <span class=\"txtP\">Population[" + Deck.sta.population[hobnum] + "]</span>   <span class=\"txtF\">Force[" + Deck.sta.force[hobnum] + "]</span>   <span class=\"txtE\">Economy[" + Deck.sta.economy[hobnum] + "]</span><br>スキル:" + Switch.Skill(hobnum));
    SECard(1);
  }
}, false);

Id.action[2].addEventListener("mouseover", function (event) {
  var hobnum;
  console.log("Hov of 3");
  if (stage != 0 && cardOk == 1) {
    Outof = 0;
    hobnum = cardPosi[2];
    play("カード名 『" + Deck.name[hobnum] + "』<br>ステータス: <span class=\"txtT\">Trust[" + Deck.sta.trust[hobnum] + "]</span>   <span class=\"txtJ\">Joy[" + Deck.sta.joy[hobnum] + "]</span>   <span class=\"txtP\">Population[" + Deck.sta.population[hobnum] + "]</span>   <span class=\"txtF\">Force[" + Deck.sta.force[hobnum] + "]</span>   <span class=\"txtE\">Economy[" + Deck.sta.economy[hobnum] + "]</span><br>スキル:" + Switch.Skill(hobnum));
    SECard(2);
  }
}, false);

const buttons = document.getElementById("buttons");
buttons.addEventListener("mouseover", function (event) {
  if (stage != 0 && cardOk == 1) {
    play(temp);
  }
}, false)


Id.status[0].addEventListener("mouseover", function (event) {
  if (stage != 0 && cardOk == 1) {
    Outof = 0;
    play("現在の信頼度:<span class=\"txtT\">[" + Sta.trust + "%]</span><br>行動が100%実行される確率:<span class=\"txtT\">[" + Sta.Probability.act + "%]</span>");
  }
}, false);

Id.status[1].addEventListener("mouseover", function (event) {
  if (stage != 0 && cardOk == 1) {
    Outof = 0;
    play("現在の国の楽しさ:<span class=\"txtJ\">[" + Sta.joy + "%]</span><br>populationが増えやすくなる確率:<span class=\"txtJ\">[" + Sta.Probability.pop[0] + "%]</span><br>populationが増えた時の増加量:<span class=\"txtJ\">[+" + Sta.Probability.pop[1] + "%]</span>");
  }
}, false);

Id.status[2].addEventListener("mouseover", function (event) {
  if (stage != 0 && cardOk == 1) {
    Outof = 0;
    play("現在の人口:<span class=\"txtP\">[" + Sta.population + "%]</span><br>" + (turn % 9 + 1) + "ターン後に増えるeconomyの量:<span class=\"txtP\">[" + Sta.Probability.eco + "%]</span>");
  }
}, false);

Id.status[3].addEventListener("mouseover", function (event) {
  if (stage != 0 && cardOk == 1) {
    Outof = 0;
    play("現在の国の勢力:<span class=\"txtF\">[" + Sta.force + "%]</span><br>戦闘系イベントにおいての勝率:<span class=\"txtF\">[" + Sta.Probability.act + "%]</span>");
  }
}, false);

Id.status[4].addEventListener("mouseover", function (event) {
  if (stage != 0 && cardOk == 1) {
    Outof = 0;
    play("現在の保持金額:<span class=\"txtE\">[" + Sta.economy + "%]</span>");
  }
}, false);