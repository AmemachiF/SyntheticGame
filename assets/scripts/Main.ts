import Ball from "./Ball";
import Balls from "./Balls";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    @property({
        type: Balls
    })
    balls: Balls = null

    @property({
        type: cc.SpriteFrame
    })
    wallColor: cc.SpriteFrame = null

    ballArr: cc.Prefab[]

    currentNode: cc.Node

    isMousedown: boolean = false

    index: number = 0

    levelCount: number = 11

    width: number = 480
    height: number = 840

    wallWidth: number = 1
    wallHeight: number = 1920

    leftWall: cc.Node
    rightWall: cc.Node

    onLoad () {
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onMousedown())
        this.node.on(cc.Node.EventType.MOUSE_MOVE, this.onMousemove())
        this.node.on(cc.Node.EventType.MOUSE_UP, this.onMouseup())
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.onMouseup())
        this.node.on(cc.Node.EventType.TOUCH_START, this.onMousedown())
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onMousemove())
        this.node.on(cc.Node.EventType.TOUCH_END, this.onMouseup())
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onMouseup())
        let manager = cc.director.getPhysicsManager();
        manager.enabled = true;
        manager.gravity = cc.v2(0, -960);

        this.width = this.node.width
        if (this.width > 1920) {
            this.width = 1920
        }
        this.leftWall =  this.createWall('LeftWall', -this.width / 2)
        this.rightWall = this.createWall('RightWall', this.width / 2)

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
            cc.tween(node)
                .to(0.2, { scale: 0.7 }, { easing: 'backOut' })
                .start()
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
                this.currentNode.setPosition(this.getMouseBallPosition(event.getLocationX()))
            }
        }
    }

    onMousemove (this: Main) {
        return (event: cc.Event.EventMouse) => {
            if (this.isMousedown && this.currentNode) {
                this.currentNode.setPosition(this.getMouseBallPosition(event.getLocationX()))
            }
        }
    }

    onMouseup (this: Main) {
        return (event: cc.Event.EventMouse) => {
            if (this.isMousedown && this.currentNode) {
                this.currentNode.setPosition(this.getMouseBallPosition(event.getLocationX()))
                this.setPhysics(this.currentNode)
                this.currentNode = null
                this.spawnNewBall(Math.round(Math.random() * 4))
            }
            this.isMousedown = false
        }
    }

    getMouseBallPosition (locX: number) {
        let lx = locX
        if (lx < this.currentNode.width / 2 * this.currentNode.scaleX) {
            lx = this.currentNode.width / 2 * this.currentNode.scaleX
        } else if (lx > this.node.width - this.currentNode.width / 2 * this.currentNode.scaleX) {
            lx = this.node.width - this.currentNode.width / 2 * this.currentNode.scaleX
        }
        return cc.v2(lx - this.node.width / 2, this.currentNode.position.y)
    }

    createWall (name: string, x: number) {
        let wall = new cc.Node(name)
        var sprite = wall.addComponent(cc.Sprite)
        sprite.spriteFrame = this.wallColor
        sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM
        
        wall.anchorX = 0.5
        wall.anchorY = 0.5
        wall.setPosition(x, 0)
        wall.height = this.wallHeight
        wall.width = this.wallWidth
        
        var rigid = wall.addComponent(cc.RigidBody)
        rigid.type = cc.RigidBodyType.Static
        var collider = wall.addComponent(cc.PhysicsBoxCollider)
        collider.size = cc.size(wall.width, wall.height)
        collider.apply()

        this.node.addChild(wall)

        return wall
    }
}
