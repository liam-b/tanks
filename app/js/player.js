export default class Player {
  constructor (Matter, render) {
    this.color = '#4ECDC4'
    this.masks = {
      body: 0x0001,
      turret: 0x0002,
      circle: 0x0004,
      bullet: 0x0008
    }

    this.bullets = []
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

    this.body = Matter.Bodies.rectangle(render.options.width / 2, render.options.height / 2, 45, 70, {
      collisionFilter: {
        mask: this.masks.body
      },
      render: {
        strokeStyle: Matter.Common.shadeColor(this.color, -20),
        fillStyle: this.color
      }
    })

    this.turret = Matter.Bodies.rectangle(render.options.width / 2, render.options.height / 2 , 12, 50, {
      collisionFilter: {
        mask: this.masks.turret
      },
      render: {
        strokeStyle: Matter.Common.shadeColor(this.color, -20),
        fillStyle: this.color
      }
    })

    this.circle = Matter.Bodies.circle(render.options.width / 2, render.options.height / 2, 12, {
      collisionFilter: {
        mask: this.masks.circle
      },
      render: {
        strokeStyle: Matter.Common.shadeColor(this.color, -20),
        fillStyle: this.color
      }
    })

    this.body.frictionAir = 0.05
    this.body.friction = 1
    this.body.restitution = 0
  }

  bullet (Matter) {
    let bullet = Matter.Bodies.circle(this.body.position.x, this.body.position.y, 5, {
      collisionFilter: {
        mask: this.masks.bullet
      },
      render: {
        strokeStyle: Matter.Common.shadeColor(this.color, -20),
        fillStyle: this.color
      }
    })

    bullet.frictionAir = 0

    return bullet
  }
}