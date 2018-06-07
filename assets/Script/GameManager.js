var GameManager = cc.Class({
    extends: cc.Component,

    statics:{
        Instance: null
    },

    properties: {
        intervalRate: 1,
        moveTime: 0.2,
        moveOffset: 50,
        currentScore: 0,
        gridNodes: {
            default: Array,
            type: cc.GridRode
        },
        startGame: false,
        lableScore: null,
        player: null,
        playerPrefab: {
            default: null,
            type: cc.Prefab
        },
        gridNodePrefab: {
            default: null,
            type: cc.Prefab
        },
        hintInfo: null,
        hintInfoPrefab: {
            default: null,
            type: cc.Prefab
        }
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        GameManager.Instance = this
     },
    start () {
        this._init()
    },
    // update (dt) {},

    _init(){
        // cc.loader.loadRes("prefabs/HintInfo", function (err, prefab) {
        //     // if (err) {
		//     //     cc.error(err.message || err)
		//     //     return
        //     // }
        //     cc.error(err)
        //     var hi = cc.instantiate(prefab);
        //     this.hintInfo = hi.getComponent("HintInfo")
        //     this.hintInfo.setInfo("CLICK\nTO\nSTART")
        // })
        cc.log('init')

        var hi = cc.instantiate(this.hintInfoPrefab)
        this.hintInfo = hi.getComponent('HintInfo')
        this.hintInfo.setParent(this.node)
        this.hintInfo.setActive(true)
        this.hintInfo.setInfo("CLICK\nTO\nSTART")

        var ls = this.node.getChildByName("labelScore")
        this.lableScore = ls.getComponent(cc.Label)
        this.lableScore.node.active = false

        var noderoot = this.node.getChildByName("NodeRoot")
        var childLen = 13
        for(var i=0; i<=childLen; i++)
        {
            var child = cc.instantiate(this.gridNodePrefab)
            var gridnode = child.getComponent("GridNode")
            gridnode.setParent(noderoot)
            gridnode.setPositionY((i-6) * 100)
            gridnode.initData(this.moveTime, this.moveOffset)
            this.gridNodes[i] = gridnode
        }

        var p = cc.instantiate(this.playerPrefab)
        this.player = p.getComponent('Player')
        this.player.setParent(this.node)
        this.player.resetPosition()
        this.player.initData(this.moveTime, this.moveOffset, this._callbackScore, this._callbackOver)
        this.player.setActive(false)

        this._setInputControl()
    },
    _gameStart(){
        console.log('start ')
        this.startGame = true
        this.hintInfo.setActive(false)
        this.lableScore.node.active = true
        this.player.setActive(true)
        this._resetPlayerPosition()
        this.schedule(this._start, this.intervalRate)
        this.currentScore = 0
        this._callbackScore(0)
    },
    _start(){
        this._moveBgGrid()
        this._movePlayer()
    },
    _moveBgGrid(){
        var count = this.gridNodes.length
        for(var i=0; i<count; i++)
        {
            var item = this.gridNodes[i] 
            if(item.node.active)
                item.move()
        }
    },
    _movePlayer(){
        this.player.move()
    },
    _resetPlayerPosition(){
        this.player.resetPosition()
    },
    _setPlayerDirection(moveRight){
        this.player.setDirection(moveRight)
    },
    _setInputControl(){
        var self = this
        var listener = {
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function(touches, event){
                var target = event.getCurrentTarget()
                var touchPos = target.convertToNodeSpace(touches.getLocation())
                var moveRight = touchPos.x >= cc.view.getVisibleSize().width * 0.5

                if(!self.startGame)
                    self._gameStart()

                self._setPlayerDirection(moveRight)
            },
            onTouchMoved: function (touches, event) {
              
            },
            onTouchEnded: function (touches, event) {
           
            },
            onTouchCancelled: function (touches, event) {
            }
        }
        cc.eventManager.addListener(listener, self.node)
    },
    _callbackScore(score){
        GameManager.Instance.currentScore += score
        GameManager.Instance.lableScore.string = "Score: " + GameManager.Instance.currentScore
    },
    _callbackOver(){
        console.log('over')
        GameManager.Instance.startGame = false
        GameManager.Instance.unschedule(GameManager.Instance._start)

        GameManager.Instance.player.setActive(false)
        GameManager.Instance.lableScore.node.active = false
        GameManager.Instance.hintInfo.setActive(true)
        GameManager.Instance.hintInfo.setInfo("YOU SCORE\n" + GameManager.Instance.currentScore + "\n\nCLICK TO\nRESTART")
    }
});