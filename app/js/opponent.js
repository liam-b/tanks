import Tank from './tank.js'

export default class Opponent extends Tank {
  constructor (Matter, render, engine, color, id) {
    super(Matter, render, engine, color)
    this.id = id
    this.oldStamp = 0

    this.settings = {
      speed: 0.001,
      turnSpeed: 0.04,
      health: 100,
      shot: {
        speed: 0.004,
        reload: 200,
        distance: 1000,
        spray: 4,
        damage: 10
      }
    }
  }

  update (data) {
    this.Matter.Body.setPosition(this.turret, {x: this.body.position.x, y: this.body.position.y + 25})
    this.Matter.Body.setPosition(this.circle, this.body.position)
    this.rotateAroundPoint(data.gunRotation, this.body.position)

    let rotation = this.body.angle + (90 * Math.PI / 180)

    if (data.key.w) {
      this.Matter.Body.applyForce(this.body, this.body.position, {x: -this.settings.speed * Math.cos(rotation), y: -this.settings.speed * Math.sin(rotation)})
    }
    if (data.key.s) {
      this.Matter.Body.applyForce(this.body, this.body.position, {x: this.settings.speed * Math.cos(rotation), y: this.settings.speed * Math.sin(rotation)})
    }
    if (data.key.a) {
      this.body.torque = -this.settings.turnSpeed
    }
    if (data.key.d) {
      this.body.torque = this.settings.turnSpeed
    }

    if (data.awake > this.oldStamp) {
      this.Matter.Body.setPosition(this.body, data.position)
      this.Matter.Body.setAngle(this.body, data.rotation)

      this.oldStamp = data.awake
    }
  }
  remove () {
    this.Matter.World.remove(this.engine.world, [this.body, this.turret, this.circle])
  }
}