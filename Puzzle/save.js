function lsinit() {
    var datas = ["EDIT_NAME", "SELECT_CATE"];
    var amount = ["NO NAME", 0];

    // datasにはセーブしたい情報の変数名、amountには初期値を入れる
    // 例: ["LEVEL", "COLOR"]; [1, "BLACK"];

    var save = "";
    var load = ""

    for (var item in datas) {
        if (typeof(amount[item]) != 'string') {
            save += "localStorage.setItem('" + datas[item] + "', " + datas[item] + ");";
            load += datas[item] + " = " + localStorage.getItem(datas[item]) + ";";
        } else { // 文字列だったら
            save += "localStorage.setItem('" + datas[item] + "', " + datas[item] + ");";
            load += datas[item] + " = '" + localStorage.getItem(datas[item]) + "';";
        };
    };

    return [datas, amount, save, load];
};

function lscheck() { // データが存在するか確認して なかったら追加
    var datas = lsinit()[0];
    var defaults = lsinit()[1];

    for (var item_info in lsinit()[0]) { // 全てのデータ名を取得
        var item = localStorage.getItem(datas[item_info]); // そのデータがあるか確認

        // if (datas[item_info] == "player_items" && item == null) {
        //     localStorage.setItem(datas[item_info], JSON.stringify(defaults[item_info])); // データ追加
        // };

        if (item == null) { // 無かったら
            localStorage.setItem(datas[item_info], defaults[item_info]); // データ追加
        };
    };
};

function myEval(expr) {
    Function(expr)();
};

function lssave() { // 現在のゲーム進行状況をセーブする。
    datas = lsinit()[2]; // データを保存するコードを取得する。
    myEval(datas); // 上のコードを実行する。
};

function lsload() { // 現在のデータを取得する。
    datas = lsinit()[3]; // データを読み込むコードを取得する。
    myEval(datas); // 上のコードを実行する。
};