export default class Bullet {
  constructor (Matter, player) {
    this.Matter = Matter
    this.player = player
    this.body = this.Matter.Bodies.circle(player.body.position.x, player.body.position.y, 5, {
      collisionFilter: {
        mask: player.masks.bullet
      },
      render: {
        strokeStyle: Matter.Common.shadeColor(player.color, -20),
        fillStyle: player.color
      }
    })

    this.body.frictionAir = 0
    Matter.Body.applyForce(this.body, this.Matter.Vector.create(this.player.body.position.x, this.player.body.position.y), {
      x: this.player.settings.shot.speed * Math.cos(this.player.turret.angle + (90 * Math.PI / 180) + Math.randomRange(this.player.settings.shot.spray, -this.player.settings.shot.spray) * Math.PI / 180),
      y: this.player.settings.shot.speed * Math.sin(this.player.turret.angle + (90 * Math.PI / 180) + Math.randomRange(this.player.settings.shot.spray, -this.player.settings.shot.spray) * Math.PI / 180)
    })
  }
}