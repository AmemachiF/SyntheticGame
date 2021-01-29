const {ccclass, property} = cc._decorator;

@ccclass
export default class Balls extends cc.Component {
    @property({
        type: cc.Prefab
    })
    ball1: cc.Prefab = null

    @property({
        type: cc.Prefab
    })
    ball2: cc.Prefab = null

    @property({
        type: cc.Prefab
    })
    ball3: cc.Prefab = null

    @property({
        type: cc.Prefab
    })
    ball4: cc.Prefab = null

    @property({
        type: cc.Prefab
    })
    ball5: cc.Prefab = null

    @property({
        type: cc.Prefab
    })
    ball6: cc.Prefab = null

    @property({
        type: cc.Prefab
    })
    ball7: cc.Prefab = null

    @property({
        type: cc.Prefab
    })
    ball8: cc.Prefab = null

    @property({
        type: cc.Prefab
    })
    ball9: cc.Prefab = null

    @property({
        type: cc.Prefab
    })
    ball10: cc.Prefab = null

    @property({
        type: cc.Prefab
    })
    ball11: cc.Prefab = null

    getBalls () {
        return [
            this.ball1,
            this.ball2,
            this.ball3,
            this.ball4,
            this.ball5,
            this.ball6,
            this.ball7,
            this.ball8,
            this.ball9,
            this.ball10,
            this.ball11,
        ]
    }
}
