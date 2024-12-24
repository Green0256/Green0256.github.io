phina.globalize();

SCREEN_WIDTH = 640; // 画面幅X
SCREEN_HEIGHT = 960; // 画面幅Y

const OFFSET = 320; // 3x3を適当に調整してたら106でズレなかったからそれの3倍+ちょっと調整
SELECTED_TILE = null; // 選択中のタイル

var clear = false; // クリア状態

phina.define("MainScene", {
    // 継承
    superClass: 'DisplayScene',
    // 初期化
    init: function(param) {
        // 親クラス初期化
        this.superInit(param);
        mainScene = this; // mainSceneにこのシーンを代入 他のファイルからも変更可能になる
        console.log("yaa")

        BOARD = DisplayElement().addChildTo(this);
        ARROW = DisplayElement().addChildTo(this);
        // 背景色
        this.backgroundColor = '#f2f3f4';

        // ステージデータの読み込み
        var stage = param.stage;
        console.log(stage)

        BOARD_WIDTH = stage["sizeX"]; // 横のタイルの数
        BOARD_HEIGHT = stage["sizeY"]; // 縦のタイルの数

        // Grid Classを作成
        BOARD_GRID_X = Grid({
            width: SCREEN_WIDTH,
            columns: BOARD_WIDTH,
            offset:OFFSET / BOARD_WIDTH
        });

        BOARD_GRID_Y = Grid({
            width: SCREEN_WIDTH, // 正方形にしたい
            columns: BOARD_HEIGHT,
            offset:OFFSET / BOARD_HEIGHT
        });

        if (stage.user) {
            Label({
                text: "レベル製作者: " + stage.user,
                fontSize: 32
            }).addChildTo(mainScene).setPosition(mainScene.gridX.center(), mainScene.gridY.span(15));
        }

        if (stage.msg) {
            Label({
                text: stage.msg,
                fontSize: 32
            }).addChildTo(mainScene).setPosition(mainScene.gridX.center(), mainScene.gridY.span(15));
        }

        var n = 0;
        // タイルを生成
        Array.range(0,BOARD_WIDTH).each(function(x) {
            Array.range(0,BOARD_HEIGHT).each(function(y) {
                n++;
                Board(n).addChildTo(BOARD).setPosition(BOARD_GRID_X.span(x), BOARD_GRID_Y.span(y));

                // 矢印を置く
                s_tile = stage[String(n)]; // 対応するタイルの矢印を読み込み
                if (s_tile.arrow != null && s_tile.arrow != "削除") {
                    Arrow(n, s_tile.arrow, s_tile.rot, x, y).addChildTo(ARROW).setPosition(BOARD_GRID_X.span(x), BOARD_GRID_Y.span(y))

                    // 青矢印だったら反対方向にも矢印を作る
                    if (s_tile.arrow == "blue") {
                        var nr = null;
                        nr = s_tile.rot == "↑" ? "↓" : nr;
                        nr = s_tile.rot == "↓" ? "↑" : nr;
                        nr = s_tile.rot == "→" ? "←" : nr;
                        nr = s_tile.rot == "←" ? "→" : nr;
                        Arrow(n, s_tile.arrow, nr, x, y).addChildTo(ARROW).setPosition(BOARD_GRID_X.span(x), BOARD_GRID_Y.span(y));
                    };
                };
            });
        });

        
        // 確定ボタン
        var confirmBtn = RectangleShape({
            fill: "yellowgreen",
            width: 300,
            height: 175
        }).addChildTo(mainScene).setPosition(mainScene.gridX.center(), mainScene.gridY.center(5));
        this.confirmBtn = confirmBtn;

        Label({
            text: "確定する",
            fontSize: 50
        }).addChildTo(this.confirmBtn);

        // 指定された色が存在するか確認する
        var hasArrowColor = function(data, color) {
            return Object.values(data).some(item => item.arrow === color);
        }

        confirmBtn.onpointend = async function() {
            SELECTED_TILE = null; // このボタンを反応しなくするために
            BOARD.children.each(function(b) {
                b.setInteractive(false);
            });

            ARROW.children.each(function(ar) { // 全部動かす
                var times = {
                    black: 1,
                    yellow: 1000,
                    blue: 2500,
                    red: 3500
                } // ミリ秒


                // 速攻終わるのを防止する

                if (hasArrowColor(stage, "blue") == 0) { // 青なし
                    times = {
                        black: 1,
                        yellow: 1000,
                        blue: 1,
                        red: 1500
                    }
                }
                // 黒がなかったら
                if (hasArrowColor(stage, "black") == 0) {
                    times = {
                        black: 1,
                        yellow: 1,
                        blue: 1500,
                        red: 2500
                    }

                    if (hasArrowColor(stage, "yellow") == 0) { // 黄もなかったら
                        times = {
                            black: 1,
                            yellow: 1,
                            blue: 1,
                            red: 2500
                        }
                    }

                    if (hasArrowColor(stage, "blue") == 0) { // 更に青もなかったら
                        times = {
                            black: 1,
                            yellow: 1,
                            blue: 1,
                            red: 1
                        }
                    }
                }

                if (times[ar.arrow]) {
                    window.setTimeout(function(){ar.move()}, times[ar.arrow]);
                }
            });
        
            const times = {
                black: 1100,
                yellow: 1000,
                blue: 1400,
                red: 1300,
                skyblue: 1000 // 鏡があったら増やしておく
            }

            var waitSec = 0
            for (var color in times) {
                var setTime = hasArrowColor(stage, color);
                if (setTime) {waitSec += times[color]}
            }

            console.log(waitSec)
            window.setTimeout(function() {
                BOARD.children.each(function(b) {
                    if (b.shape.fill == "white") {
                        clear = true;
                        alert("Clear!");
                    };
                });

                if (clear == false) {
                    alert("失敗");
                };

                let url = new URL(window.location.href);
                let params = url.searchParams;
                var param = params.get('stage')
                var self = this;
               
                // stageから直接プレイしている場合は無限ループしてしまうので クエリパラメータを上書きする
                if (param) {
                    const qparams = new URLSearchParams(window.location.search) // クエリパラメータを操作するためのオブジェクト
                    qparams.delete('stage') // クエリパラメータに存在しない場合は追加、存在しているときは更新を行う
                    window.location.search = qparams.toString() // 新たなクエリパラメータとして設定
                    // mainScene.exit('title', {'loadStage':false});
                }

                mainScene.exit();
            }, waitSec); // 指定秒数後にクリア判定  不正できるかも？
            
        };
    },

    update: function(app) {
        if (SELECTED_TILE != null) {
            this.confirmBtn.alpha = 1;
            this.confirmBtn.setInteractive(true);
        } else {
            this.confirmBtn.alpha = 0;
            this.confirmBtn.setInteractive(false);
        };
    },
});

// タイルのクラス
phina.define("Board", {
    superClass: 'DisplayElement',
    init: function(n) {
        this.superInit();
        this.setSize(SCREEN_WIDTH/BOARD_WIDTH,SCREEN_WIDTH/BOARD_WIDTH); // 判定を調整

        this.n = n;
        
        this.shape = RectangleShape({
            fill: "gray",
            width: SCREEN_WIDTH/BOARD_WIDTH,
            height: SCREEN_WIDTH/BOARD_HEIGHT,
            padding: 2
        }).addChildTo(this);
        this.shape.alpha = 0;

        this.shape.tweener.fade(1, 1000/n);

        this.setInteractive(true);
        this.onpointstart = function() { // タイルがタッチされたら

            // 矢印がいるタイルと同じタイルは選択できないように
            var self = this;
            var hit = 0;
            ARROW.children.each(function(t) {
                if (t.id == self.n) {// idが一致
                    hit++;
                };
            });

            // 矢印がいないタイルだったら
            if (hit == 0) {
                BOARD.children.each(function(b) {
                    b.shape.fill = "gray"; // 全タイルを未選択状態の色に
                });
                this.shape.fill = "white"
                SELECTED_TILE = n; // 選択中のタイルを上書き
            };
        };
    },
});

// 矢印の基本動作
phina.define("Arrow", {
    superClass: 'DisplayElement',
    init: function(n, arrow, rot, x, y) {
        // n: 矢印のid
        // arrow: 矢印の色
        // rot: 矢印の向き
        // x, y: GridClass上の位置

        this.superInit();
        this.setSize(SCREEN_WIDTH/BOARD_WIDTH/5,SCREEN_WIDTH/BOARD_WIDTH/5); // 判定を調整

        this.id = n;
        this.rot = rot;
        this.arrow = arrow;
        this.gx = x;
        this.gy = y;

        this.nomove = false;
        if (arrow == "block" || arrow == "skyblue" || arrow == "xtta" || arrow == "midnightblue"
        ) {
            this.nomove = true;
        };

        this.moveis = false; // 動き始めたらtrue
        var direction = null; // 回転率
        var move_dir = []; // 動く方向の座標
        var invert_dir = []; // 動く方向の逆のタイル(黄色反転用)
        this.moveCount = 0; // 何回動いたか
        this.mirrorTouch = false; // 現在鏡に当たっているか   ではなく一回でも当たったらtrue

        // 向きを修正する
        switch(rot) {
            case "↑":
                direction = 0;
                move_dir = [this.gx, this.gy-1];
                invert_dir = [this.gx, this.gy+1];
                break
            case "↓":
                direction = 180;
                move_dir = [this.gx, this.gy+1];
                invert_dir = [this.gx, this.gy-1];
                break
            case "→":
                direction = 90;
                move_dir = [this.gx+1, this.gy];
                invert_dir = [this.gx-1, this.gy];
                break
            case "←":
                direction = 270;
                move_dir = [this.gx-1, this.gy];
                invert_dir = [this.gx+1, this.gy];
                break
        };
        this.direction = direction;
        this.move_dir = move_dir;
        this.invert_dir = invert_dir;

        if (arrow == "black" || arrow == "yellow" || arrow == "blue" || arrow == "red") {
            // 矢印本体
            this.ARROW = Label({
                text: "↑",
                fill: arrow,
                fontSize: SCREEN_WIDTH/BOARD_WIDTH/2.5
            }).addChildTo(this);
        } else {
            if (arrow == "block") { // 赤マス
                this.ARROW = Label({
                    text: "/",
                    fill: "red",
                    fontSize: SCREEN_WIDTH/BOARD_WIDTH/2.5
                }).addChildTo(this)
            } else if (arrow == "skyblue") { // 鏡
                this.ARROW = Label({
                    text: "┃",
                    fill: "skyblue",
                    fontSize: SCREEN_WIDTH/BOARD_WIDTH
                }).addChildTo(this);
                this.setSize(SCREEN_WIDTH/BOARD_WIDTH, SCREEN_WIDTH/BOARD_HEIGHT);

            } else if (arrow == "midnightblue") { // 壁
                this.ARROW = Label({
                    text: "■",
                    fill: "midnightblue",
                    fontSize: SCREEN_WIDTH/BOARD_WIDTH
                }).addChildTo(this);
                this.setSize(SCREEN_WIDTH/BOARD_WIDTH, SCREEN_WIDTH/BOARD_HEIGHT);

            } else if (arrow == "xtta") { // 自動生成で削った所
                this.ARROW = Label({
                    text: "削",
                    fill: "purple",
                    fontSize: SCREEN_WIDTH/BOARD_WIDTH/2.5
                }).addChildTo(this)
            }
        };
        

        // 矢印の向き
        this.ARROW.rotation = this.direction;
    },

    move: function() {
        if (this.nomove == false) {
            // 矢印を動かす
            this.moveis = true;
            this.moveCount++; // 回数を増やしておく(なんかの制御に使えるかも)
            
            if (this.arrow === "black" || this.arrow === "blue") {
                // 黒と青の矢印は move_dir に基づいて移動
                this.tweener
                    .moveTo(
                        BOARD_GRID_X.span(this.move_dir[0]),
                        BOARD_GRID_Y.span(this.move_dir[1]),
                        750
                    )
                    .play();
            } else if (this.arrow === "yellow") {
                // 黄の矢印は反転してから invert_dir に基づいて移動
                this.tweener.rotateBy(180, 500);
                this.tweener
                    .moveTo(
                        BOARD_GRID_X.span(this.invert_dir[0]),
                        BOARD_GRID_Y.span(this.invert_dir[1]),
                        500
                    )
                    .play();
            } else if (this.arrow === "red") {
                // 赤の矢印は方向に基づいて移動
                const moveTargets = {
                    0: [this.gx, 0], // ↑
                    180: [this.gx, BOARD_HEIGHT - 1], // ↓
                    90: [BOARD_WIDTH - 1, this.gy], // →
                    270: [0, this.gy], // ←
                };
            
                const target = moveTargets[this.direction];
                if (target) {
                    this.tweener
                        .moveTo(
                            BOARD_GRID_X.span(target[0]),
                            BOARD_GRID_Y.span(target[1]),
                            1000
                        )
                        .play();
                }
            }            
        }
    },

    update: function() {
        var self = this;

        // 動き始めたら 通ったところが示される
        BOARD.children.each(function(b) {
            if (b.hitTestElement(self) && self.moveis == true) {
                b.shape.fill = "tomato";
            };
        });

        if (this.arrow == "skyblue") {
            let mx = this.rot;

            // 横向きの場合は上下、縦向きの場合は左右が効果対象
            if (this.rot === "↓") {
                mx = "↑";
            } else if (this.rot === "→") {
                mx = "←";
            }

            let ok = [];
            switch (mx) {
                case "↑":
                    ok = ["→", "←"];
                    break;
                case "←":
                    ok = ["↑", "↓"];
                    break;
            }

            // 鏡
            ARROW.children.each(function(arr) {  // 鏡に当たっていてかつ条件を達成している場合
                if (arr.hitTestElement(self) == true && 
                    arr.arrow != "skyblue" && 
                    ok.indexOf(arr.rot) !== -1 && 
                    arr.mirrorTouch == false && 
                    arr.nomove == false ) { 
                    
                    arr.mirrorTouch = true; // 当たった
                    arr.tweener.clear();

                    var nr = null;
                    nr = arr.rot == "↑" ? "↓" : nr;
                    nr = arr.rot == "↓" ? "↑" : nr;
                    nr = arr.rot == "→" ? "←" : nr;
                    nr = arr.rot == "←" ? "→" : nr;

                    // 向きを修正する
                    switch(nr) { // 基準はself (mirrorの位置)
                        case "↑":
                            arr.direction = 0;
                            arr.move_dir = [self.gx, self.gy-2];
                            arr.invert_dir = [self.gx, self.gy+2];
                            break
                        case "↓":
                            arr.direction = 180;
                            arr.move_dir = [self.gx, self.gy+2];
                            arr.invert_dir = [self.gx, self.gy-2];
                            break
                        case "→":
                            arr.direction = 90;
                            arr.move_dir = [self.gx+2, self.gy];
                            arr.invert_dir = [self.gx-2, self.gy];
                            break
                        case "←":
                            arr.direction = 270;
                            arr.move_dir = [self.gx-2, self.gy];
                            arr.invert_dir = [self.gx+2, self.gy];
                            break
                    };

                    if (arr.arrow != "yellow") {
                        arr.tweener.rotateBy(180, 500).play();
                    };
                    
                    arr.move(); // もう一回移動
                }
            })
        }

        if (this.arrow == "midnightblue") {
            // 壁
            ARROW.children.each(function(arr) {
                if (arr.hitTestElement(self) == true && arr.arrow != "midnightblue" && arr.nomove == false) { // 壁に当たっていてかつ条件を達成
                    arr.tweener.clear(); // 強制停止
                };
            });
        };

    },
});