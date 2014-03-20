/**
 * Created by lvchenguang on 14-3-17.
 */

const LEVEL_PRE_STRING = '等级：';
const MODE_PRE_STRING = '模式：';
const SCORE_PRE_STRING = '分数：';

var ScoreLayer = cc.Layer.extend({
    level : 3,
    mode : '练习',
    score : 0,
    lblLevel : null,
    lblMode : null,
    lblScore : null,


    init: function (level,mode,score) {
        this._super();

        this.level = level;
        this.mode = mode;
        this.score = score;

        var size = cc.SizeMake(800,200);

        this.lblLevel = cc.LabelTTF.create(LEVEL_PRE_STRING + this.level,'宋体',30);
        this.lblLevel.setPosition(100 + this.lblLevel.getContentSize().width / 2, 100);
        this.addChild(this.lblLevel);

        this.lblMode = cc.LabelTTF.create(MODE_PRE_STRING + this.mode,'宋体',30);
        this.lblMode.setPosition(300 + this.lblMode.getContentSize().width / 2, 100);
        this.addChild(this.lblMode);

        this.lblScore = cc.LabelTTF.create(SCORE_PRE_STRING + this.score,'宋体',30);
        this.lblScore.setPosition(500 + this.lblScore.getContentSize().width / 2, 100);
        this.addChild(this.lblScore);
    },

    reset : function(level,mode,score){
        this.level = level;
        this.mode = mode;
        this.score = score;

        this.lblLevel.setString(LEVEL_PRE_STRING + this.level);
        this.lblMode.setString(MODE_PRE_STRING + this.mode);
        this.lblScore.setString(SCORE_PRE_STRING + this.score);
    },

    setLevel : function(level){
        this.level = level;
        this.lblLevel.setString(LEVEL_PRE_STRING + this.level);
    },

    levelRestore : function(){
        this.level = 3;
        this.lblLevel.setString(LEVEL_PRE_STRING + this.level);
    },

    addScore : function(score){
        this.score += score;
        this.lblScore.setString(SCORE_PRE_STRING + this.score);
    },

});