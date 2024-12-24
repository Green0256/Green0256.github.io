phina.globalize();
alert("Edit Modeで起動しています。");

SELECTED = null; // 選択してる矢印をここに代入しておく
SELECTED_R = null; // 選択してる矢印の向きをここに代入しておく

const SCREEN_WIDTH = 640; // 画面幅X
const SCREEN_HEIGHT = 960; // 画面幅Y

const BOARD_WIDTH = parseInt(window.prompt("縦のタイル数を入力してください", "3")); // 縦のタイルの数
const BOARD_HEIGHT = parseInt(window.prompt("横のタイル数を入力してください", "3"));; // 横のタイルの数

const OFFSET = 318; // 3x3を適当に調整してたら106でズレなかったからそれの3倍

const BOARD_GRID_X = Grid({
    width: SCREEN_WIDTH,
    columns: BOARD_WIDTH,
    offset:OFFSET / BOARD_WIDTH
});

const BOARD_GRID_Y = Grid({
    width: SCREEN_WIDTH, // 正方形にしたい
    columns: BOARD_HEIGHT,
    offset:OFFSET / BOARD_HEIGHT
});

const BTN_GRID = Grid({
    width: SCREEN_WIDTH,
    columns: 8,
    offset:106
});


phina.define("Board", {
    superClass: 'DisplayElement',
    init: function(x,y,n) {
        this.superInit();
        this.setSize(SCREEN_WIDTH/BOARD_WIDTH,SCREEN_WIDTH/BOARD_WIDTH); // 判定を調整

        this.shape = RectangleShape({
            fill: "gray",
            width: SCREEN_WIDTH/BOARD_WIDTH,
            height: SCREEN_WIDTH/BOARD_HEIGHT,
            padding: 0
        }).addChildTo(this);

        this.arrow = null;
        this.arrow_rot = null;
    
        this.setInteractive(true);
        this.onpointstart = function() {
            if (SELECTED == "削除") {
                this.children.eraseIf(function(elem) {
                    if (elem.fontSize == 80) {
                        return true;
                    }  
                });

                // idが一致してるoutだけ消す
                outgroup.children.eraseIf(function(o) {
                    if (o.id == n) {
                        return true
                    }
                });
            } else {
                if (SELECTED == null) {
                    alert("矢印が選択されていません！");
                    return
                } else if (SELECTED_R == null) {
                    alert("矢印の向きが選択されていません！");
                    return
                };
                var arr = Label({
                    text: SELECTED_R,
                    fontSize: 80,
                    fill: SELECTED
                }).addChildTo(this);

                if (SELECTED == "skyblue") {
                    arr.text = "┃"
                    if (SELECTED_R == "→" || SELECTED_R == "←") {
                        arr.rotation = 90
                    }
                };
                if (SELECTED == "midnightblue") {
                    arr.text = "■"
                };

                Out(n, x, y).addChildTo(outgroup);
            };

            this.arrow = SELECTED;
            this.arrow_rot = SELECTED_R;
        };
    },

    
});

phina.define("Arrow", {
    superClass: 'DisplayElement',
    init: function(color="black") {
        this.superInit();

        Shape().addChildTo(this);

        this.color = color;
        this.rot = 0;
        this.label = Label({
            text: "↑",
            fontSize: 32,
            fill: color
        }).addChildTo(this);

        if (color == "skyblue") {
            this.label.text = "┃"
        };
        if (color == "midnightblue") {
            this.label.text = "■"
        };

        if (color == "削除") {
            this.label.text = "削除";
        };

        this.setInteractive(true);
        this.onpointstart = function() {
            SELECTED = this.color;
        };
    },

    
});

phina.define("Btns", {
    superClass: 'DisplayElement',
    init: function(rot="上") {
        this.superInit();

        Shape().addChildTo(this);

        this.rot = rot;
        this.label = Label({
            text: rot,
            fontSize: 32,
            fill: "white"
        }).addChildTo(this);

        this.setInteractive(true);
        this.onpointstart = function() {
            SELECTED_R = this.rot;
        };
    },

    
});


phina.define("Out", {
    superClass: 'DisplayElement',
    init: function(id=0, x, y) {
        this.superInit();

        this.id = id;
        this.color = color;

        var out1 = RectangleShape({
            fill: SELECTED
        }).addChildTo(this).setPosition(BOARD_GRID_X.span(x), BOARD_GRID_Y.span(y));

        var out2 = RectangleShape({
            fill: SELECTED
        }).addChildTo(this);

        var out3 = RectangleShape({
            fill: SELECTED
        }).addChildTo(this);


        // 初期化処理
        out1.alpha = 0.3;
        out2.alpha = 0.3;
        out3.alpha = 0;

        // 選択状態の確認
        console.log(SELECTED);

        if (SELECTED === "blue") {
            out3.alpha = 0.3;
        } else if (SELECTED === "yellow") {
            out2.alpha = 0;
            out3.alpha = 0.3;
        }

        // 位置設定処理
        let positionOffset = { x: 0, y: 0 };
        let oppositeOffset = { x: 0, y: 0 };

        switch (SELECTED_R) {
            case "↑":
                positionOffset = { x: 0, y: -1 };
                oppositeOffset = { x: 0, y: 1 };
                break;
            case "↓":
                positionOffset = { x: 0, y: 1 };
                oppositeOffset = { x: 0, y: -1 };
                break;
            case "←":
                positionOffset = { x: -1, y: 0 };
                oppositeOffset = { x: 1, y: 0 };
                break;
            case "→":
                positionOffset = { x: 1, y: 0 };
                oppositeOffset = { x: -1, y: 0 };
                break;
        }

        // 位置の適用
        out2.setPosition(
            BOARD_GRID_X.span(x + positionOffset.x),
            BOARD_GRID_Y.span(y + positionOffset.y)
        );
        out3.setPosition(
            BOARD_GRID_X.span(x + oppositeOffset.x),
            BOARD_GRID_Y.span(y + oppositeOffset.y)
        );
    },
});


phina.define("MainScene", {
    // 継承
    superClass: 'DisplayScene',
    // 初期化
    init: function(option) {
        // 親クラス初期化
        this.superInit(option);
        mainScene = this; // mainSceneにこのシーンを代入 他のファイルからも変更可能になる

        lscheck(); // ls初期化
        lsload(); // ls読み込み

        if (EDIT_NAME == "NO NAME") {
            EDIT_NAME = String(window.prompt("ユーザー名を入力してください！後から変更できません。", ""));
            if (EDIT_NAME == null) {
                EDIT_NAME = "";
            };
            lssave();
        }

        BOARD = DisplayElement().addChildTo(this);
        outgroup = DisplayElement().addChildTo(this);
        // 背景色
        this.backgroundColor = 'black';

        // タイルを生成
        var n=0;
        Array.range(0,BOARD_WIDTH).each(function(x) {
            Array.range(0,BOARD_HEIGHT).each(function(y) {
                n++;
                var tile = Board(x,y,n).addChildTo(BOARD).setPosition(BOARD_GRID_X.span(x), BOARD_GRID_Y.span(y));
                var tx = Label({text: n, fontSize: SCREEN_WIDTH/BOARD_WIDTH/5}).addChildTo(tile);
                tx.alpha = 0.5;
            });
        });

        colors = ["black", "yellow", "blue", "red", "skyblue", "midnightblue", "削除"]
        Array.range(0,colors.length).each(function(c) {
            Arrow(color=colors[c]).addChildTo(mainScene).setPosition(BTN_GRID.span(c), mainScene.gridY.center(4));
        });

        rots = ["↑", "↓", "→", "←"]
        Array.range(0,rots.length).each(function(r) {
            Btns(rot=rots[r]).addChildTo(mainScene).setPosition(BTN_GRID.span(r), mainScene.gridY.center(5.5));
        });

        this.selected = Label({
            text: "選択中: null",
            fontSize: 24,
            fill: "white"
        }).addChildTo(this).setPosition(BTN_GRID.span(0), mainScene.gridY.center(3))

        this.selected_r = Label({
            text: "方向: null",
            fontSize: 24,
            fill: "white"
        }).addChildTo(this).setPosition(BTN_GRID.span(1), mainScene.gridY.center(3))

        var writeBtn = RectangleShape({
            width:800
        }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center(7)).addChildTo(this);

        Label({text: "書き出し"}).addChildTo(writeBtn);

        writeBtn.setInteractive(true);
        writeBtn.onpointstart = function() {
            var board = {"sizeX":BOARD_WIDTH, "sizeY": BOARD_HEIGHT};
            var n = 0;
            BOARD.children.each(function(e) {
                n++;
                console.log(e.arrow);
                console.log(e.arrow_rot);

                var arrow = e.arrow;
                var arrow_rot = e.arrow_rot;
                if (e.arrow == "削除") {
                    arrow = null;
                    arrow_rot = null;
                };

                const obj = {"arrow": arrow, "rot": arrow_rot};
                board[n] = obj;
            });

            board['user'] = EDIT_NAME; // ユーザー名

            console.log(board);
            alert(JSON.stringify(board));
            // navigator.clipboard.writeText(JSON.stringify(board)); // クリップボードに保存

            var formatBoard = JSON.stringify(board);
            var board_lz = compressData(formatBoard)

            const blob = new Blob([board_lz], { type: 'text/plain' });
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            // sha256(formatBoard).then(hash => {
            //     link.download = hash+".level";
            //     link.click();
            // }); // fileとして保存

          
            let date = new Date();
            var d1 = date.getFullYear() + ('0' + (date.getMonth() + 1)).slice(-2) +('0' + date.getDate()).slice(-2) + ('0' + date.getHours()).slice(-2) + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2);
            
            link.download = d1 + ".level";
            document.body.appendChild(link);
            link.click(); // 自動ダウンロード

            var ref = document.referrer + "?stage=" + board_lz
            alert(ref)
            // location.href = ref;
            window.open(ref); // 別ダブで開く
        };


        // var outBtn = RectangleShape({
        //     width:400
        // }).addChildTo(this).setPosition(this.gridX.center(-5), this.gridY.center(7.5)).addChildTo(this);
        // outBtn.setInteractive(true);

        // Label({text: "アウトを表示する"}).addChildTo(outBtn);
        // outBtn.onpointstart = function() {
        //     outgroup.children.each(function(o) {
        //         o.alpha = 0.3;
        //     });
        // };


        // var nooutBtn = RectangleShape({
        //     width:400
        // }).addChildTo(this).setPosition(this.gridX.center(5), this.gridY.center(7.5)).addChildTo(this);
        // nooutBtn.setInteractive(true);

        // Label({text: "アウトを表示しない"}).addChildTo(nooutBtn);
        // nooutBtn.onpointstart = function() {
        //     outgroup.children.each(function(o) {
        //         o.alpha = 0;
        //     });
        // };


    },

    update: function(app) {
        this.selected.text = "選択中: " + SELECTED;
        this.selected_r.text = "選択中: " + SELECTED_R;
    },
});

async function sha256(text){
    const uint8  = new TextEncoder().encode(text)
    const digest = await crypto.subtle.digest('SHA-256', uint8)
    return Array.from(new Uint8Array(digest)).map(v => v.toString(16).padStart(2,'0')).join('')
}