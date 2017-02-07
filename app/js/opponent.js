import Tank from './tank.js'

export default class Opponent extends Tank {
  constructor (Matter, render, engine, color) {
    super(Matter, render, engine, color)
  }

  update (data, id) {
    if (data != {}) {
      this.Matter.Body.setPosition(this.body, {x: data[Math.abs(id - 1)].x, y: data[Math.abs(id - 1)].y})
    }
    this.Matter.Body.setPosition(this.turret, {x: this.body.position.x, y: this.body.position.y + 25})
    this.Matter.Body.setPosition(this.circle, {x: this.body.position.x, y: this.body.position.y})
  }
}