/**
 * Created by lvchenguang on 14-3-19.
 */

var TipsLayer = cc.Layer.extend({
    lblMessage : null,

    init : function(){
        this._super();

        var size = cc.Director.getInstance().getWinSize();

        this.lblMessage = cc.LabelTTF.create('','宋体',30);
        this.lblMessage.setAnchorPoint(0.5,0.5);
        this.lblMessage.setPosition(size.width / 2,size.height / 2);
        this.addChild(this.lblMessage);

    },

    setMessage : function(message){
        this.lblMessage.setString(message);
        this.lblMessage.setColor(cc.c3b(255,0,0));
    },
});