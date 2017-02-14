import Bullet from './bullet.js'
import Tank from './tank.js'

export default class Player extends Tank {
  constructor (Matter, render, engine, color) {
    super(Matter, render, engine, color)

    this.reloadCounter = 0
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

  update (input, boundingRectangle) {
    this.Matter.Body.setPosition(this.turret, {x: this.body.position.x, y: this.body.position.y + 25})
    this.Matter.Body.setPosition(this.circle, {x: this.body.position.x, y: this.body.position.y})
    if (typeof input.key != 'undefined') {
      this._handleInput(input, boundingRectangle)
    }
  }

  _handleInput (input, boundingRectangle) {
    this.rotateAroundPoint(-Math.atan2(input.mouse.x - this.render.options.width / 2 - boundingRectangle.left, input.mouse.y - this.render.options.height / 2 - boundingRectangle.top), {x: this.body.position.x, y: this.body.position.y})

    let rotation = this.body.angle + (90 * Math.PI / 180)

    if (input.key.w) {
      this.Matter.Body.applyForce(this.body, this.body.position, {x: -this.settings.speed * Math.cos(rotation), y: -this.settings.speed * Math.sin(rotation)})
    }
    if (input.key.s) {
      this.Matter.Body.applyForce(this.body, this.body.position, {x: this.settings.speed * Math.cos(rotation), y: this.settings.speed * Math.sin(rotation)})
    }
    if (input.key.a) {
      this.body.torque = -this.settings.turnSpeed
    }
    if (input.key.d) {
      this.body.torque = this.settings.turnSpeed
    }

    if (input.key.space) {
      if (this.reloadCounter <= this.engine.timing.timestamp) {
        let bullet = new Bullet (this.Matter, this)

        this.Matter.World.add(this.engine.world, bullet.body)
        this.bullets.push(bullet.body)

        this.reloadCounter = this.engine.timing.timestamp + this.settings.shot.reload
      }
    }
  }
}