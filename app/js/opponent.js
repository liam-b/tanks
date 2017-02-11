import Tank from './tank.js'

export default class Opponent extends Tank {
  constructor (Matter, render, engine, color, id) {
    super(Matter, render, engine, color)
    this.id = id
    this.oldStamp = 0
  }

  update (data) {
    this.Matter.Body.setPosition(this.turret, {x: this.body.position.x, y: this.body.position.y + 25})
    this.Matter.Body.setPosition(this.circle, this.body.position)
    this.rotateAroundPoint(data.gunRotation, this.body.position)

    if (typeof data.torque == 'number') {
      this.body.torque = data.torque
    }

    if (data.awake > this.oldStamp) {
      this.Matter.Body.setVelocity(this.body, data.velocity)
      this.Matter.Body.setPosition(this.body, data.position)
      this.Matter.Body.setAngle(this.body, data.rotation)

      this.oldStamp = data.awake
    }
  }
  remove () {
    this.Matter.World.remove(this.engine.world, [this.body, this.turret, this.circle])
  }
}