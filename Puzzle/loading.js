phina.globalize();

// titleSceneの次に来るところ
// titleSceneからSELECTED_MODEが来てるのでそれに応じて動きを変える

phina.define("MyLoadingScene", {
    // 継承
    superClass: 'DisplayScene',
    // 初期化
    init: async function() {
        // 親クラス初期化
        this.superInit();
        loadingScene = this;

        switch(SELECTED_MODE) {
            case "casual":
                fetch("./EDIT/Test/1.level")
                .then(response => response.json())
                .then(data => {
                    loadingScene.exit("select");
                });
                break;
            
            case "endless":
                endless();
                break;

            case "daily":
                let date = new Date();
                var d1 = date.getFullYear() + ('0' + (date.getMonth() + 1)).slice(-2) +('0' + date.getDate()).slice(-2) // 日付をseedに

                fetch("./EDIT/Test/0.level")
                .then(response => response.json())
                .then(data => {
                    loadingScene.exit("main", {
                        stage: gen(d1, 7, 7)
                    });
                });
                break;

            case "edit":
                location.href = './EDIT/'
                break;
        };

        // 背景色
        this.backgroundColor = '#f2f3f4';
    },
});

function endless() {
    var seed = Math.floor( Math.random() * (999999999 + 1 - 0) ) + 0 // 約10億通り
    var x = Math.floor( Math.random() * (10 + 1 - 3) ) + 3
    var y = Math.floor( Math.random() * (10 + 1 - 3) ) + 3
    console.log(seed, x, y)

    var genstage = gen(seed, x, x) // とりあえずどっちも同じ数字で 正方形に
    console.log(typeof genstage)

    var min = 0;
    var max = 15;
    var ran = Math.floor( Math.random() * (max + 1 - min) ) + min ;

    // var genstage = generatePuzzle(5, 5) 
    
    // fetch("./EDIT/Test/レーザー.level")
    fetch("./EDIT/Test/"+ran+'.level')
    .then(response => response.json())
    .then(data => {
        loadingScene.exit("main", {
            stage: genstage //data
        });
    });
};