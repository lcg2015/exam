/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var MyLayer = cc.Layer.extend({
    isMouseDown: false,
    helloImg: null,
    helloLabel: null,
    circle: null,
    sprite: null,

    init: function () {

        this._super();

        if( 'touches' in sys.capabilities )
            this.setTouchEnabled(true);
        else if ('mouse' in sys.capabilities )
            this.setMouseEnabled(true);

        var size = cc.Director.getInstance().getWinSize();

        this.sprite = new Array();

        for (var i = 0 ; i < 20; i++)
        {
            col = parseInt(i / 5);
            row = i % 5;
            this.sprite[i] = cc.Sprite.createWithSpriteFrameName("front.png");
            //this.sprite[i].setAnchorPoint(,0.5);
            this.sprite[i].setPosition((row + 1) * this.sprite[i].getContentSize().width + 10 * row,
                (col + 1) * this.sprite[i].getContentSize().height + 10 * col);
            this.addChild(this.sprite[i]);
        }
    },

    onMouseDown: function(event){
        for (sp in this.sprite )
        {
            rect = this.sprite[sp].getBoundingBox();
            if(cc.rectContainsPoint(rect,event.getLocation()))
            {
                var actionTo = cc.ScaleTo.create(0.5, 0, 1);
                var actionBack = cc.ScaleTo.create(0.5,1.0,1.0);
                var delay = cc.DelayTime.create(0.5);
                var actionAnimation = cc.Animation.create();
                var spriteFrameCache = cc.SpriteFrameCache.getInstance();
                var frame1 = spriteFrameCache.getSpriteFrame("front.png");
                var frame2 = spriteFrameCache.getSpriteFrame("error.png");
                actionAnimation.addSpriteFrame(frame1);
                actionAnimation.addSpriteFrame(frame2);
                actionAnimation.setDelayPerUnit(0.0000001);
                var actionAnimate = cc.Animate.create(actionAnimation);

                this.sprite[sp].runAction(cc.Sequence.create(actionTo,actionAnimate,actionBack));

            }
        }
    },

    onTouchBegan: function(touches,event){
        alert(2);
    }

});

var MyScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var spriteFrameCache = cc.SpriteFrameCache.getInstance();
        spriteFrameCache.addSpriteFrames("res/resource.plist","res/resource.png");
        var layer = new MyLayer();
        this.addChild(layer);
        layer.init();
    }
});
