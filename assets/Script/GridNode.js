// var GameManager = require('GameManager')

cc.Class({
    extends: cc.Component,

    properties: {
        chlids:{
            default: Array,
            type: cc.Node
        },
        moveTime: 0.2,
        moveOffset: 50
    },

    // onLoad () {},

    initData(movetime, moveoffset){
        this.moveTime = movetime
        this.moveOffset = moveoffset
        this.chlids = this.node.children
    },
    move(){
        var pos = cc.p(this.node.position)
        pos.y -= this.moveOffset

        var mt = cc.moveTo(this.moveTime, pos)
        var cb = cc.callFunc(this._moveFinish, this)
        var sequence = cc.sequence(mt, cb)
        this.node.runAction(sequence)
    },

    _moveFinish(){
        if(this.node.position.y < -650)
            this.node.position = cc.p(this.node.position.x, 600)
    }
});
