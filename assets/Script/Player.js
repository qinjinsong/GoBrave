cc.Class({
    extends: cc.Component,

    properties: {
        moveTime: 0.2,
        moveOffset: 50,
        moveRight: true,
        callbackScore: null,
        callbackOver: null
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    initData(movetime, moveoffset, cbScore, cbOver){
        this.moveTime = movetime
        this.moveOffset = moveoffset
        this.callbackScore = cbScore
        this.callbackOver = cbOver
    },
    setDirection(right){
        this.moveRight = right
    },
    setActive(state){
        this.node.active = state
    },
    move(){
        var pos = cc.p(this.node.position)
        pos.y += this.moveOffset
        var tempx = this.moveRight ? this.moveOffset : -this.moveOffset
        pos.x += tempx

        var mt = cc.moveTo(this.moveTime, pos)
        var cb = cc.callFunc(this._moveFinish, this)
        var sequence = cc.sequence(mt, cb)
        this.node.runAction(sequence)
    },

    _moveFinish(){
        var py = this.node.position.y - this.moveOffset
        this.node.position = cc.p(this.node.position.x, py)
        this._callbackScore(1)
    },
    _callbackScore(score){
        if(this.node.position.x < -350 || this.node.position.x > 350)
        {
            if(this.callbackOver != null)
                this.callbackOver()
        }
        else
        {
            if(this.callbackScore != null)
                this.callbackScore(score)
        }
    }
});
