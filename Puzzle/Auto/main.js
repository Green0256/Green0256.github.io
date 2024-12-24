class Random {
    constructor(seed) {
        this.x = 123456789;
        this.y = 362436069;
        this.z = 521288629;
        this.w = seed;
    }
    
    // XorShift
    next() {
        let t;
    
        t = this.x ^ (this.x << 11);
        this.x = this.y; this.y = this.z; this.z = this.w;
        return this.w = (this.w ^ (this.w >>> 19)) ^ (t ^ (t >>> 8)); 
    }
    
    // min以上max以下の乱数を生成する
    nextInt(min, max) {
        const r = Math.abs(this.next());
        return min + (r % (max + 1 - min));
        }
}

function gen(seed=101010, sizeX=3, sizeY=3) {
    const random = new Random(seed);
    const size = sizeX * sizeY; // タイル数

    var n = 0;
    var arrow = JSON.parse(JSON.stringify((new Array(sizeX)).fill((new Array(sizeY)).fill("空")))); // 矢印の情報が入る配列
    
    const arrowType = ["黒↑", "黒↓", "黒←", "黒→", "黄↑", "黄↓", "黄←", "黄→", "青↑", "青→",  "空", "鏡↑", "鏡←", "レ↑", "レ↓", "レ←", "レ→"];

    Array.range(0,sizeY).each(function(y) {
        Array.range(0,sizeX).each(function(x) {
            var r = random.nextInt(0,arrowType.length-1); // 置く矢印をランダムに選択
            arrow[y][x] = arrowType[r];
        })
    })

    // ランダムに一箇所空にする
    var ranx = random.nextInt(0, sizeX-1);
    var rany = random.nextInt(0, sizeY-1);
    console.log("x", ranx+1, "y", rany+1)
    arrow[ranx][rany] = "空"

    var fixedboard = fixBoard(arrow, sizeX, sizeY, [ranx, rany])

    formatarrow = format(fixedboard, sizeX, sizeY)

    return formatarrow;
}

function format(arrow, sizeX, sizeY) {
    example = {"1":{"arrow":"black","rot":"→"},"2":{"arrow":null,"rot":null},"3":{"arrow":"black","rot":"↑"},"4":{"arrow":null,"rot":null},"5":{"arrow":"black","rot":"→"},"6":{"arrow":null,"rot":null},"7":{"arrow":null,"rot":null},"8":{"arrow":null,"rot":null},"9":{"arrow":"black","rot":"←"},"sizeX":3,"sizeY":3}
    
    var board = {}
    var n = 0

    for (var arx in arrow) {
        arxList = arrow[arx]
        for (var ar in arxList) {
            n++;
            a = arxList[ar].match(/.{1}/g)
            if (a[0] == "空") {a = [null, null]} else {
                var nr = null;
                nr = a[0] == "黒" ? "black" : nr;
                nr = a[0]== "黄" ? "yellow" : nr;
                nr = a[0]== "青" ? "blue" : nr;
                nr = a[0]== "r" ? "block" : nr;
                nr = a[0]== "鏡" ? "skyblue" : nr;
                nr = a[0]== "x" ? "xtta" : nr;
                nr = a[0]== "レ" ? "red" : nr;

                a = [nr, a[1]]
            }

            board[String(n)] = {"arrow": a[0], "rot": a[1]}
        }
    }
    board["sizeX"] = sizeX;
    board["sizeY"] = sizeY; // gyakuかも

    console.log(board)
    return board
}

// format前のボードが対象
function fixBoard(board, sizeX, sizeY, safeTile) {
    console.log(board);

    _ = 0;
    for (let i = 0; i < sizeY; i++) {
        for (let j = 0; j < sizeX; j++) {
           
            if (j+1 != sizeX) {
                // 各タイルを比較する
                var n1 = board[j][i].match(/.{1}/g)
                var n2 = board[j+1][i].match(/.{1}/g)
     
                if (n1[1] == "←" || n1[1] == "→") { // 右または左のみ
                    if (n1[0] == n2[0] && n1[1] == n2[1]) { // 方向、色ともに全く同じ矢印が左右に並んでいたら片方を削除
                        board[j+1][i] = "空";
                    } else if (n1[0] != "黄" && n2[0] != "黄") { // 黄色以外の矢印で→←のようになっている意味のない矢印があったら片方を削除
                        if (n1[1] == "→" && n2[1] == "←") {
                            board[j+1][i] = "空";
                        }
                    } else if (n1[0] == "黄" && n2[0] == "黄") { // 黄色矢印で←→のようになっている意味のない矢印があったら片方を削除
                        if (n1[1] == "←" && n2[1] == "→") {
                            board[j+1][i] = "空";
                        }

                    } else if (n1[0] == "黒" && n2[0] == "黄") { // 黒→黄色→意味ない
                        if (n1[1] == "→" && n2[1] == "→") {
                            board[j][i] = "空";
                        }
                    } else if (n1[0] == "黄" && n2[0] == "黒") { // 黄←黒←意味ない
                        if (n1[1] == "←" && n2[1] == "←") {
                            board[j+1][i] = "空";
                        }
                    } else if (n1[0] == "青" && n2[0] == "黄") { // 青→黄色→意味ない
                        if (n1[1] == "→" && n2[1] == "→") {
                            board[j+1][i] = "空";
                        }
                    } else if (n1[0] == "黄" && n2[0] == "青") { // 黄←青→意味ない
                        if (n1[1] == "←" && n2[1] == "→") {
                            board[j][i] = "空";
                        }
                    }
                }
            }

            if (i+1 != sizeY) {
                var n1 = board[j][i].match(/.{1}/g)
                var n2 = board[j][i+1].match(/.{1}/g)
                
                if (n1[1] == "↑" || n1[1] == "↓") { // 縦方向のみ
                    if (n1[0] == n2[0] && n1[1] == n2[1]) { // 方向、色ともに全く同じ矢印が上下に並んでいたら片方を削除
                        board[j][i+1] = "空";
                    } else if (n1[0] != "黄") {
                        if (n1[1] == "↓" && n2[1] == "↑") { // 黄色以外の矢印で→←(を90度回転)のようになっている意味のない矢印があったら片方を削除
                            board[j][i+1] = "空";
                        }
                    } else if (n1[0] == "黄") {
                        if (n1[1] == "↑" && n2[1] == "↓") { // 黄色矢印で←→(を90度回転)のようになっている意味のない矢印があったら片方を削除
                            board[j][i+1] = "空";
                        }
                    } else if (n1[0] == "黒" && n2[0] == "黄") { // 黒→黄色→(90)意味ない
                        if (n1[1] == "↓" && n2[1] == "↓") {
                            board[j][i+1] = "空";
                        }
                    } else if (n1[0] == "青" && n2[0] == "黄") { // 青→黄色→(90)意味ない
                        if (n1[1] == "↑" && n2[1] == "↓") {
                            board[j][i+1] = "空";
                        }
                    } else if (n1[0] == "黄" && n2[0] == "青") { // 黄←青←(90)意味ない
                        if (n1[1] == "↑" && n2[1] == "↑") {
                            board[j][i] = "空";
                        }
                    }
                }
            }
        }
    }

    var fixedBoard = board;
    return fixedBoard
}