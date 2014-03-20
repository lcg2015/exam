    /**
 * Created by lvchenguang on 14-3-17.
 */

var GameLayer = cc.Layer.extend({
        row: 4,
        col: 5,
        voidSpace: 10,
        sprites: null,
        currentSpriteIndex: NaN,
        correctIndexes: null,
        selectedIndexes: null,
        selectedCount: 0,
        cfSelectedError: null,
        cfSelectedSuccess: null,
        cfFinish: null,

        init: function () {
            this._super();

            this.enableUserInterface(false);

            var size = cc.SizeMake(800, 600);
            var frameRect = cc.SpriteFrameCache.getInstance().getSpriteFrame('front.png').getRect();

            var orignPointer = cc.PointMake(
                parseInt((size.width - frameRect.width * this.col - this.voidSpace * (this.col - 1)) / 2),
                parseInt((size.height - frameRect.height * this.row - this.voidSpace * (this.row - 1)) / 2)
            );

            this.sprites = new Array();

            for (var i = 0; i < 20; i++) {
                row = parseInt(i / 5);
                col = i % 5;

                this.sprites[i] = cc.Sprite.createWithSpriteFrameName('front.png');
                this.sprites[i].setPosition(
                    orignPointer.x + col * this.sprites[i].getContentSize().width + col * 10 + frameRect.width / 2,
                    orignPointer.y + row * this.sprites[i].getContentSize().height + row * 10 + frameRect.height / 2
                );
                this.addChild(this.sprites[i]);
            }
        },

        setSuccessCallFunc: function (callFunc) {
            this.cfSelectedSuccess = callFunc;
        },

        setErrorCallFunc: function (callFunc) {
            this.cfSelectedError = callFunc;
        },

        setFinishCallFunc: function (callFunc) {
            this.cfFinish = callFunc;
        },

        onMouseDown: function (event) {
            this.currentSpriteIndex = this.getSpriteIndex(event.getLocation());
        },

        onMouseUp: function (event) {
            var index = this.getSpriteIndex(event.getLocation());
            if(!index){
                this.currentSpriteIndex = NaN;
                return ;
            }
            if (this.currentSpriteIndex != NaN &&
                this.currentSpriteIndex == index) {
                this.onSelect(index);
            }

            this.currentSpriteIndex = NaN;
        },

        onTouchBegan: function (touch, event) {
            this.currentSpriteIndex = this.getSpriteIndex(touch.getLocation());
        },

        onTouchEnd: function (touch, evnet) {
            var index = this.getSpriteIndex(touch.getLocation())

            if (this.currentSpriteIndex != NaN &&
                this.currentSpriteIndex == index) {
                this.onSelect(index);
            }

            this.currentSpriteIndex = NaN;
        },

        getSpriteIndex: function (location) {
            for (index in this.sprites) {
                if (cc.rectContainsPoint(this.sprites[index].getBoundingBox(), location)) {
                    return index;
                }
            }

            return NaN;
        },

        onSelect: function (index) {
            cc.log('onSelect ' + index);
            if (this.selectedIndexes != null && cc.ArrayGetIndexOfObject(this.selectedIndexes, index) != -1) {

                return;
            }

            if (cc.ArrayGetIndexOfObject(this.correctIndexes, index) == -1) {
                this.onSelectedError(index);
            }
            else {
                this.onSelectedSuccess(index);
            }

            this.selectedCount--;

            cc.ArrayAppendObject(this.selectedIndexes,index);
            this.selectedIndexes.push(index);

            if (this.selectedCount <= 0) {
                this.enableUserInterface(false);
                this.scheduleOnce(this.finish, 1);
            }

        },

        onSelectedSuccess: function (index) {
            cc.ArrayRemoveObject(this.correctIndexes, index);
            if (this.cfSelectedSuccess) {
                this.cfSelectedSuccess.execute();
            }

            this.showSprite(index, 'back.png');
        },

        onSelectedError: function (index) {
            if (this.cfSelectedError) {
                this.cfSelectedError.execute();
            }

            this.showSprite(index, 'error.png');
        },

        enableUserInterface: function (enable) {
            if ('touches' in sys.capabilities) {
                this.setTouchEnabled(enable);
            }
            else if ('mouse' in sys.capabilities) {
                this.setMouseEnabled(enable);
            }
        },

        start: function (arrIndex) {
            this.correctIndexes = arrIndex;
            this.selectedCount = arrIndex.length;
            this.selectedIndexes = new Array();

            var cfShowCorrectCompete = cc.CallFunc.create(this.onShowCorrectComplete, this);
            for (var i = 0; i < arrIndex.length; i++) {
                if (i == arrIndex.length - 1) {
                    this.showSprite(arrIndex[i], 'back.png', cfShowCorrectCompete);
                }
                else {
                    this.showSprite(arrIndex[i], 'back.png');
                }
            }
        },

        finish: function () {
            this.resetSprite(this.selectedIndexes, false);

            this.scheduleOnce(this.callFuncFinish,1);
        },

        callFuncFinish : function(){
            if(this.cfFinish){
                this.cfFinish.execute();
            }

            cc.log('game is finished.');
        },

        onShowCorrectComplete: function () {
            this.scheduleOnce(this.restoreSprite, 3);
        },

        restoreSprite: function () {
            this.resetSprite(this.correctIndexes, true);
        },

        resetSprite: function (indexArray, touchEnable) {
            for (var i = 0; i < indexArray.length; i++) {
                if (i == indexArray.length - 1) {
                    this.showSprite(indexArray[i], 'front.png');
                }
                else {
                    this.showSprite(indexArray[i], 'front.png');
                }
            }

            this.enableUserInterface(touchEnable);
        },

        showSprite: function (spriteIndex, spriteName, cfComplete) {
            var scaleToAction = cc.ScaleTo.create(0.3, 0, 1.0);
            var scalebackAction = cc.ScaleTo.create(0.3, 1.0, 1.0);

            var data = [spriteIndex, spriteName];

            var cfChangeFrame = cc.CallFunc.create(this.onChangeFrame, this, data);
            cc.log('showSprite ' + spriteIndex);
            if (cfComplete == undefined) {
                this.sprites[spriteIndex].runAction(cc.Sequence.create(scaleToAction, cfChangeFrame, scalebackAction));
            }
            else {
                this.sprites[spriteIndex].runAction(cc.Sequence.create(scaleToAction, cfChangeFrame, scalebackAction, cfComplete));
            }
        },

        onChangeFrame: function (target, data) {
            this.sprites[parseInt(data[0])].setDisplayFrame(
                cc.SpriteFrameCache.getInstance().getSpriteFrame(data[1])
            );
        },
    })
    ;