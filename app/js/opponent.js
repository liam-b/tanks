import Tank from './tank.js'

export default class Opponent extends Tank {
  constructor (Matter, render, engine, color) {
    super(Matter, render, engine, color)
  }

  update () {
    this.Matter.Body.setPosition(this.turret, {x: this.body.position.x, y: this.body.position.y + 25})
    this.Matter.Body.setPosition(this.circle, {x: this.body.position.x, y: this.body.position.y})
  }
}