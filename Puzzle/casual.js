phina.globalize();

SCREEN_WIDTH = 640; // 画面幅X
SCREEN_HEIGHT = 960; // 画面幅Y

const STAGE_GRID_X = Grid({
    width: SCREEN_WIDTH,
    columns: 5
});

const STAGE_GRID_Y = Grid({
    width: SCREEN_HEIGHT,
    columns: 6
});

phina.define("StageBtn", {
    // 継承
    superClass: 'DisplayElement',
    // 初期化
    init: function(number, path) {
        // 親クラス初期化
        this.superInit();

        this.setScale(1.3,1.3)

        this.shape = Shape().addChildTo(this);
        Label({
            text: number
        }).addChildTo(this.shape)

        this.path = "./Stages/" + path + "/" + number + ".level"
    },
});

phina.define("StageSelect", {
    // 継承
    superClass: 'DisplayScene',
    // 初期化
    init: function() {
        // 親クラス初期化
        this.superInit();
        selectScene = this;
        // 背景色
        this.backgroundColor = '#f2f3f4';
        this.page = 0

        STAGES = DisplayElement().addChildTo(this);

        lscheck(); // ls初期化
        lsload(); // ls読み込み

        this.categories = {
            0: "チュートリアル",
            1: "通常"
        }
        this.stages = {
            "チュートリアル": [0, 11],
            "通常": [0, 0]
        }

        this.categoryLabel = Label({
            text: "カテゴリー名",
            fontSize: 46,
            fill: "black"
        }).addChildTo(selectScene).setPosition(this.gridX.span(4), this.gridY.span(1))

        var pageChangeBtn = Shape().addChildTo(this).setPosition(this.gridX.span(10), this.gridY.span(1));
        pageChangeBtn.setInteractive(true);
        Label({text:"切り替え"}).addChildTo(pageChangeBtn)

        var backBtn = Shape().addChildTo(this).setPosition(this.gridX.span(14), this.gridY.span(1));
        backBtn.setInteractive(true);
        Label({text:"back"}).addChildTo(backBtn)


        pageChangeBtn.onpointstart = function() {
            selectScene.page++;
            selectScene.pageChange();
        }

        backBtn.setInteractive(true);
        backBtn.onpointend = function() {
            selectScene.exit('title')
        }

        this.page = SELECT_CATE;
        this.pageChange()
    },

    pageChange: function() {
        STAGES.children.clear();

        SELECT_CATE = selectScene.page;
        lssave();

        if (Object.keys(this.categories).length <= selectScene.page) {
            selectScene.page = 0
        }
        var selectCategory = this.categories[selectScene.page]
        var categoryStages = this.stages[selectCategory]

        this.categoryLabel.text = selectCategory

        var i = 0
        var j = 2
        for (var s=0; s <= categoryStages[1]; s++) {
            i++;
            if (i == 5) {
                j++;
                i=1;
            }
            var stgbtn = StageBtn(s,path=selectScene.page).addChildTo(STAGES).setPosition(STAGE_GRID_X.span(i), STAGE_GRID_Y.span(j))
            stgbtn.setInteractive(true)

            stgbtn.onpointend = function() {
                fetch(this.path)
                .then(response => response.json())
                .then(data => {
                    selectScene.exit("main", {
                        stage: data
                    });
                });
            }
        }

    }
});