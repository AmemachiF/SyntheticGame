import Ball from "./Ball";
import Balls from "./Balls";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    @property({
        type: Balls
    })
    balls: Balls = null

    ballArr: cc.Prefab[]

    currentNode: cc.Node

    isMousedown: boolean = false

    index: number = 0

    levelCount: number = 11

    onLoad () {
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onMousedown())
        this.node.on(cc.Node.EventType.MOUSE_MOVE, this.onMousemove())
        this.node.on(cc.Node.EventType.MOUSE_UP, this.onMouseup())
        let manager = cc.director.getPhysicsManager();
        manager.enabled = true;
        manager.gravity = cc.v2(0, -960);

        
        this.createWall('LeftWall', -this.node.width / 2)
        this.createWall('RightWall', this.node.width / 2)

        this.ballArr = this.balls.getBalls()
        this.spawnNewBall(0)
    }

    reSpawnBall (level: number, x: number, y: number) {
        var node = cc.instantiate(this.balls.getBalls()[level])
        node.setPosition(x, y)
        node.scale = 0.7
        var ball = node.addComponent(Ball)
        ball.main = this
        ball.level = level
        ball.index = this.index++
        this.node.addChild(node)
        return node
    }

    spawnNewBall (level: number) {
        var node = cc.instantiate(this.balls.getBalls()[level])
        node.setPosition(0, this.node.height / 2 - 60)
        var ball = node.addComponent(Ball)
        ball.main = this
        ball.level = level
        ball.index = this.index++
        this.scheduleOnce(() => {
            node.scale = 0
            this.node.addChild(node)
            this.currentNode = node
            node.runAction(cc.scaleTo(0.2, 0.7).easing(cc.easeBackOut()))
        }, 1)
    }

    setPhysics (node: cc.Node) {
        var rig = node.addComponent(cc.RigidBody)
        rig.enabledContactListener = true
        var phy = node.addComponent(cc.PhysicsCircleCollider)
        phy.radius = node.width / 2
        phy.restitution = 0.1
        phy.density = 1
        phy.apply()
    }

    onMousedown (this: Main) {
        return (event: cc.Event.EventMouse) => {
            if (this.currentNode) {
                this.isMousedown = true
                let lx = event.getLocationX()
                if (lx < this.currentNode.width / 2 * this.currentNode.scaleX) {
                    lx = this.currentNode.width / 2 * this.currentNode.scaleX
                } else if (lx > this.node.width - this.currentNode.width / 2 * this.currentNode.scaleX) {
                    lx = this.node.width - this.currentNode.width / 2 * this.currentNode.scaleX
                }
                this.currentNode.setPosition(cc.v2(lx - this.node.width / 2, this.currentNode.position.y))
            }
        }
    }

    onMousemove (this: Main) {
        return (event: cc.Event.EventMouse) => {
            if (this.isMousedown && this.currentNode) {
                let lx = event.getLocationX()
                if (lx < this.currentNode.width / 2 * this.currentNode.scaleX) {
                    lx = this.currentNode.width / 2 * this.currentNode.scaleX
                } else if (lx > this.node.width - this.currentNode.width / 2 * this.currentNode.scaleX) {
                    lx = this.node.width - this.currentNode.width / 2 * this.currentNode.scaleX
                }
                this.currentNode.setPosition(cc.v2(lx - this.node.width / 2, this.currentNode.position.y))
            }
        }
    }

    onMouseup (this: Main) {
        return (event: cc.Event.EventMouse) => {
            if (this.isMousedown && this.currentNode) {
                let lx = event.getLocationX()
                if (lx < this.currentNode.width / 2 * this.currentNode.scaleX) {
                    lx = this.currentNode.width / 2 * this.currentNode.scaleX
                } else if (lx > this.node.width - this.currentNode.width / 2 * this.currentNode.scaleX) {
                    lx = this.node.width - this.currentNode.width / 2 * this.currentNode.scaleX
                }
                this.currentNode.setPosition(cc.v2(lx - this.node.width / 2, this.currentNode.position.y))
                this.setPhysics(this.currentNode)
                this.currentNode = null
                this.spawnNewBall(Math.round(Math.random() * 4))
            }
            this.isMousedown = false
        }
    }

    createWall (name: string, x: number) {
        let wall = new cc.Node(name)

        wall.anchorX = 0
        wall.anchorY = 0
        wall.setPosition(x, 0)
        wall.height = this.node.height
        wall.width = 0

        var rigid = wall.addComponent(cc.RigidBody)
        rigid.type = cc.RigidBodyType.Static
        var collider = wall.addComponent(cc.PhysicsBoxCollider)
        collider.size = cc.size(wall.width, wall.height)
        collider.apply()

        this.node.addChild(wall)
    }
}
