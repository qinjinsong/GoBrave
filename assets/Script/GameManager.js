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
        maskRoot:{
            default: null,
            type: cc.Node
        },
        labelMaskHint:{
            default: null,
            type: cc.Label
        },
        lableScore:{
            default: null,
            type: cc.Label
        },
        gridNodes: {
            default: Array,
            type: cc.GridRode
        },
        player: {
            default: null,
            type: cc.Player
        },
        startGame: false,
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
        this.lableScore.node.active = false
        this.maskRoot.active = true
        this.labelMaskHint.string = "CLICK\nTO\nSTART"
        var noderoot = this.node.getChildByName("NodeRoot")
        var childs = noderoot.children
        for(var i=0; i<childs.length; i++)
        {
            var child = childs[i]
            var gridnode = child.getComponent("GridNode")
            gridnode.initData(this.moveTime, this.moveOffset)
            this.gridNodes[i] = gridnode
        }

        var player = this.node.getChildByName('Player')
        this.player = player.getComponent('Player')
        this.player.initData(this.moveTime, this.moveOffset, this._callbackScore, this._callbackOver)
        this.player.setActive(false)

        this._setInputControl()
    },
    _gameStart(){
        console.log('start ')
        this.startGame = true
        this.maskRoot.active = false
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
        GameManager.Instance.maskRoot.active = true
        GameManager.Instance.labelMaskHint.string = "YOU SCORE\n" + GameManager.Instance.currentScore + "\n\nCLICK TO\nRESTART"
    }
});