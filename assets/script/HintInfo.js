cc.Class({
    extends: cc.Component,

    properties: {
        labelHint:{
            default: null,
            type: cc.Label
        }
    },

    setInfo(text){
        this.labelHint.string = text
    },
    setActive(state){
        this.node.active = state
    },
    setParent(parent){
        this.node.parent = parent
    }
});
