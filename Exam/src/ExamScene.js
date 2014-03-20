/**
 * Created by lvchenguang on 14-3-17.
 */

var ExamScene = cc.Scene.extend({
    gameLayer : null,
    scoreLayer : null,
    tipsLayer : null,
    level : 3,
    mode : '练习',
    errorCount : 0,
    indexArray : [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],
    exerciseCount : 0,
    examCount : 0,
    tipsBackgroundLayer : null,


    onEnter : function(){
        this._super();

        var spriteFrameCache = cc.SpriteFrameCache.getInstance();
        spriteFrameCache.addSpriteFrames('res/resource.plist','res/resource.png');

        var gameBackgroundLayer = cc.LayerColor.create(cc.c4b(255,255,255,255),800,600);
        gameBackgroundLayer.setPosition(0,0);
        this.addChild(gameBackgroundLayer,1);

        this.gameLayer = new GameLayer();
        this.gameLayer.setPosition(0,0);

        gameBackgroundLayer.addChild(this.gameLayer);
        this.gameLayer.init();

        var cfFinish = cc.CallFunc.create(this.onFinish,this);
        var cfSuccess = cc.CallFunc.create(this.onSuccess,this);
        var cfError = cc.CallFunc.create(this.onError,this);
        this.gameLayer.setSuccessCallFunc(cfSuccess);
        this.gameLayer.setErrorCallFunc(cfError);
        this.gameLayer.setFinishCallFunc(cfFinish);

        var scoreBackgroundLayer = cc.LayerColor.create(cc.c4b(50,128,0,255),800,200);
        scoreBackgroundLayer.setAnchorPoint(0,0);
        scoreBackgroundLayer.setPosition(0,600);
        this.addChild(scoreBackgroundLayer,2);

        this.scoreLayer = new ScoreLayer();
        scoreBackgroundLayer.addChild(this.scoreLayer);
        this.scoreLayer.init(3,'练习',0);

        this.tipsBackgroundLayer = cc.LayerColor.create(cc.c4b(128,128,100,255),800,800);
        this.tipsBackgroundLayer.setAnchorPoint(0.5,0.5);
        this.tipsBackgroundLayer.setPosition(0,0);
        this.addChild(this.tipsBackgroundLayer,3);

        this.tipsLayer = new TipsLayer();
        this.tipsBackgroundLayer.addChild(this.tipsLayer);
        this.tipsLayer.init();
        this.tipsLayer.setMessage('练习模式，准备开始。');

        var actionScaleTo = cc.ScaleTo.create(1.0,0.5,0.5);
        var actionFadeOut = cc.FadeOut.create(1.0);
        var delay = cc.DelayTime.create(3);
        var cfGameStart = cc.CallFunc.create(this.onExerciseGameStart,this);

        this.tipsBackgroundLayer.runAction(cc.Sequence.create(delay,actionFadeOut,cfGameStart));
        this.tipsLayer.lblMessage.runAction(cc.Sequence.create(delay.clone(),actionFadeOut.clone()));
    },

    onExerciseGameStart : function(target){
        this.gameLayer.start(this.getNewArray(3));
    },

    onExamGameStart : function(target){
        this.gameLayer.start(this.getNewArray(this.level));
    },

    onSuccess : function(){
        if(this.mode == '正式')
        this.scoreLayer.addScore(10);
    },

    onError : function(){
        if(this.mode == '正式'){
            this.errorCount++;
            this.scoreLayer.levelRestore();
        }
    },

    onFinish : function(){
        if(this.mode == '练习'){
            this.exerciseCount++;

            if(this.exerciseCount < 3){
                this.gameLayer.start(this.getNewArray(3));
            }
            else{
                this.beginExamGame();
            }
        }
        else{
            this.examCount++;

            if (this.errorCount > 0 )
            {
                this.level = 3;
            }
            else
            {
                this.level++;
                if(this.level > 10)
                {
                    this.level = 10;
                }

                this.scoreLayer.setLevel(this.level);
            }

            this.errorCount = 0;
            if(this.examCount < 10){
                this.gameLayer.start(this.getNewArray(this.level));
            }
            else
            {
                this.tipsLayer.setMessage('游戏结束。');

                var actionFadeIn = cc.FadeIn.create(0.001);
                var actionFadeOut = cc.FadeOut.create(0.5);
                var delay = cc.DelayTime.create(3);
                var cfGameStart = cc.CallFunc.create(this.onExamGameStart,this);

                this.mode = '正式';
                this.scoreLayer.reset(3,'正式',0);
                this.tipsBackgroundLayer.runAction(cc.Sequence.create(actionFadeIn,delay,actionFadeOut));
                this.tipsLayer.lblMessage.runAction(cc.Sequence.create(actionFadeIn.clone(),delay.clone(),actionFadeOut.clone()));
            }
        }


    },

    beginExamGame : function(){
        this.tipsLayer.setMessage('正式模式，准备开始。');

        var actionFadeIn = cc.FadeIn.create(0.001);
        var actionFadeOut = cc.FadeOut.create(1.0);
        var delay = cc.DelayTime.create(3);
        var cfGameStart = cc.CallFunc.create(this.onExamGameStart,this);

        this.mode = '正式';
        this.scoreLayer.reset(3,'正式',0);
        this.tipsBackgroundLayer.runAction(cc.Sequence.create(actionFadeIn,delay,actionFadeOut,cfGameStart));
        this.tipsLayer.lblMessage.runAction(cc.Sequence.create(actionFadeIn.clone(),delay.clone(),actionFadeOut.clone()));
    },

    getNewArray : function(level){
        this.indexArray.sort(function(){ return 0.5 - Math.random();});

        var items =  this.indexArray.slice(0,level);

        var message = '';
        for(index in items){
            message += items[index] + ' ';
        }

        cc.log(message);

        return items;
    }
});