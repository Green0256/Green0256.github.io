phina.globalize();

VERSION = "Dev.1.0";
SELECTED_MODE = null;

phina.define("MyTitleScene", {
    // 継承
    superClass: 'DisplayScene',
    // 初期化
    init: async function(param) {
        // 親クラス初期化
        this.superInit(param);
        titleScene = this;

        // 背景色
        this.backgroundColor = '#f2f3f4';
        
        var logo = Sprite("logo").addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(3));
        logo.setScale(0.7,0.7);
        var version = Label({
            text: "Ver." + VERSION,
            fontSize: 20
        }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(5));

        var copyright = Label({
            text: "© 2024 256project.net",
            fontSize: 22
        }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(15.7))

        var modeGroup = DisplayElement().addChildTo(this);
        const modes = {
            "カジュアル": "casual",
            "エンドレス": "endless",
            "デイリー": "daily",
            "エディット": "edit"
        };

        var y = 5;
        for (var item in modes) {
            y+=2;
            TitleBtn(item, modes[item]).addChildTo(modeGroup).setPosition(titleScene.gridX.center(), titleScene.gridY.span(y));
        };

        if (param.loadStage != false) {
            let url = new URL(window.location.href);
            let params = url.searchParams;
            var param_stage = params.get('stage')
            var self = this;
            // urlのstageにデータがあれば即プレイ
            if (param_stage) {
                fetch("./EDIT/Test/0.level")
                .then(response => response.json())
                .then(data => {
                    self.exit("main", {
                        stage: JSON.parse(decompressData(param_stage))
                    });
                });
            }
        }

    },
});


phina.define("TitleBtn", {
    superClass: 'DisplayElement',
    init: function(jname, ename) {
        this.superInit();
        this.setSize(200,100);

        var label = Label({
            text: jname,
            fill: "skyblue",
            stroke: "white",
            fontSize: 50
        }).addChildTo(this).setPosition();

        var underLine = RectangleShape({
            width: label.text.length*50, // 文字数に応じて長さを変える
            height: 3,
            stroke: null,
            fill: "skyblue"
        }).addChildTo(this).setPosition(0, 30);
        underLine.alpha = 0;

        this.setInteractive(true);
        this.onpointover = function() {
            underLine.alpha = 1;
        };
        this.onpointout = function() {
            underLine.alpha = 0;
        };
        this.onpointstart = function() {
            SELECTED_MODE = ename; titleScene.exit("load");
        };
    },
});