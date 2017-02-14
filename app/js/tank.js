export default class Tank {
  constructor (Matter, render, engine, color) {
    this.Matter = Matter
    this.render = render
    this.engine = engine

    this.color = color
    this.masks = {
      body: 0x0001,
      turret: 0x0004,
      circle: 0x0008,
      bullet: 0x0002
    }

    this.firebaseDelay = 300
    this.firebaseCounter = 0

    this.bullets = []

    this.body = this.Matter.Bodies.rectangle(this.render.options.width / 2, this.render.options.height / 2, 45, 70, {
      collisionFilter: {
        mask: this.masks.body
      },
      render: {
        strokeStyle: Matter.Common.shadeColor(this.color, -20),
        fillStyle: this.color
      }
    })

    this.turret = this.Matter.Bodies.rectangle(this.render.options.width / 2, this.render.options.height / 2 , 10, 50, {
      collisionFilter: {
        mask: this.masks.turret
      },
      render: {
        strokeStyle: Matter.Common.shadeColor(this.color, -20),
        fillStyle: this.color
      }
    })

    this.circle = this.Matter.Bodies.circle(this.render.options.width / 2, this.render.options.height / 2, 12, {
      collisionFilter: {
        mask: this.masks.circle
      },
      render: {
        strokeStyle: Matter.Common.shadeColor(this.color, -20),
        fillStyle: this.color
      }
    })

    this.body.frictionAir = 0.045
    this.body.friction = 1
    this.body.restitution = 0

    this.Matter.World.add(this.engine.world, [this.body, this.turret, this.circle])
  }

  rotateAroundPoint (rotation, point) {
    var cos = Math.cos(rotation)
    var sin = Math.sin(rotation)

    var dx = this.turret.position.x - point.x
    var dy = this.turret.position.y - point.y

    this.Matter.Body.setPosition(this.turret, {
        x: point.x + (dx * cos - dy * sin),
        y: point.y + (dx * sin + dy * cos)
    })

    this.Matter.Body.setAngle(this.turret, rotation)
  }
}