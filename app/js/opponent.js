import Tank from './tank.js'

export default class Opponent extends Tank {
  constructor (Matter, render, engine, color, id) {
    super(Matter, render, engine, color)
    this.id = id
  }

  update (data) {
    this.Matter.Body.setPosition(this.body, data.position)
    this.Matter.Body.setAngle(this.body, data.rotation)
    this.rotateAroundPoint(data.gunRotation, {x: this.body.position.x, y: this.body.position.y})
    this.Matter.Body.setPosition(this.turret, {x: this.body.position.x, y: this.body.position.y + 25})
    this.Matter.Body.setPosition(this.circle, {x: this.body.position.x, y: this.body.position.y})
  }
}