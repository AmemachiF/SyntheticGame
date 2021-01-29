import Main from "./Main";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Ball extends cc.Component {

    level: number
    index: number
    main: Main

    destroyed: boolean = false
    
    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact (contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
        // console.log(contact, selfCollider, otherCollider);
        const sn = selfCollider.node
        const on = otherCollider.node
        let otherBall = otherCollider.node.getComponent(Ball)
        if (!otherBall) {
            return
        } else {
            if (this.destroyed || otherBall.destroyed) {
                contact.disabled = true
            } else if (otherBall.level === this.level && this.level < this.main.levelCount && otherBall.index < this.index) {
                this.destroyed = true
                otherBall.destroyed = true
                contact.disabled = true
                const x = otherCollider.node.position.x
                const y = otherCollider.node.position.y
                sn.removeComponent(cc.Collider)
                sn.removeComponent(cc.RigidBody)
                sn.runAction(
                    cc.sequence(
                        cc.moveTo(0.05, x, y),
                        cc.callFunc(() => {
                            sn.destroy()
                            on.destroy()
                            this.main.setPhysics(this.main.reSpawnBall(++this.level, x, y))
                        })
                    )
                )
            }
        }
    }

    // // 只在两个碰撞体结束接触时被调用一次
    // onEndContact (contact, selfCollider, otherCollider) {
    // }

    // // 每次将要处理碰撞体接触逻辑时被调用
    // onPreSolve (contact, selfCollider, otherCollider) {
    // }

    // // 每次处理完碰撞体接触逻辑时被调用
    // onPostSolve (contact, selfCollider, otherCollider) {
    // }
}
