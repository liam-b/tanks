var Matter = require('matter-js')
var Player = require('./player.js')
var listeners = require('./listeners.js')

document.onkeydown = listeners.onkeydown
document.onkeyup = listeners.onkeyup
document.onmousemove = listeners.onmousemove
var key = listeners.key
var mouse = listeners.mouse

var engine = Matter.Engine.create()
engine.world.gravity.y = 0

var render = Matter.Render.create({
    element: document.querySelector('.game-canvas'),
    options: {
      width: 1250,
      height: 550,
      background: '#d9d9d9',
      wireframeBackground: '#222',
      hasBounds: true,
      enabled: true,
      wireframes: false,
      showSleeping: true,
      showDebug: false,
      showBroadphase: false,
      showBounds: false,
      showVelocity: false,
      showCollisions: false,
      showAxes: false,
      showPositions: false,
      showAngleIndicator: false,
      showIds: false,
      showShadows: false
    },
    engine: engine
})

var canvas = document.querySelector('.game-canvas canvas')
var boundingRectangle = canvas.getBoundingClientRect()

console.log(Player)
var player = new Player.default (Matter, render)

Math.randomRange = function (min, max) {
  return Math.random() * (max - min) + min
}

function rotateAroundPoint (body, rotation, point) {
  var cos = Math.cos(rotation)
  var sin = Math.sin(rotation)

  var dx = body.position.x - point.x
  var dy = body.position.y - point.y

  Matter.Body.setPosition(body, {
      x: point.x + (dx * cos - dy * sin),
      y: point.y + (dx * sin + dy * cos)
  })

  Matter.Body.setAngle(body, rotation)
}

function keyInputs () {
  let rotation = player.body.angle + (90 * Math.PI / 180)

  if (key.w) {
    Matter.Body.applyForce(player.body, Matter.Vector.create(player.body.position.x, player.body.position.y), {x: -player.settings.speed * Math.cos(rotation), y: -player.settings.speed * Math.sin(rotation)})
  }
  if (key.s) {
    Matter.Body.applyForce(player.body, Matter.Vector.create(player.body.position.x, player.body.position.y), {x: player.settings.speed * Math.cos(rotation), y: player.settings.speed * Math.sin(rotation)})
  }
  if (key.a) {
    player.body.torque = -player.settings.turnSpeed
  }
  if (key.d) {
    player.body.torque = player.settings.turnSpeed
  }

  if (key.space) {
    if (player.reloadCounter <= engine.timing.timestamp) {
      spawnBullet()
      player.reloadCounter = engine.timing.timestamp + player.settings.shot.reload
    }
  }
}

function spawnBullet () {
  let bullet = player.bullet(Matter)

  Matter.Body.applyForce(bullet, Matter.Vector.create(player.body.position.x, player.body.position.y), {
    x: player.settings.shot.speed * Math.cos(player.turret.angle + (90 * Math.PI / 180) + Math.randomRange(player.settings.shot.spray, -player.settings.shot.spray) * Math.PI / 180),
    y: player.settings.shot.speed * Math.sin(player.turret.angle + (90 * Math.PI / 180) + Math.randomRange(player.settings.shot.spray, -player.settings.shot.spray) * Math.PI / 180)
  })
  Matter.World.add(engine.world, bullet)
  player.bullets.push(bullet)
}

function bulletCheck () {
  for (var i = 0; i < player.bullets.length; i += 1) {
    let pos = player.bullets[i].position
    let output = {
      x: 0,
      y: 0
    }

    output.x = Math.pow(pos.x - player.body.position.x, 2)
    output.y = Math.pow(pos.y - player.body.position.y, 2)

    if (Math.sqrt(output.x + output.y) >= player.settings.shot.distance) {
      Matter.World.remove(engine.world, player.bullets[i])
    }
  }
}

function updatePositions () {
  Matter.Body.setPosition(player.turret, {x: player.body.position.x, y: player.body.position.y + 25})
  Matter.Body.setPosition(player.circle, {x: player.body.position.x, y: player.body.position.y})
  Matter.Bounds.shift(render.bounds, {x: player.body.position.x - render.options.width / 2, y: player.body.position.y - render.options.height / 2})
  rotateAroundPoint(player.turret, -Math.atan2(mouse.x - render.options.width / 2 - boundingRectangle.left, mouse.y - render.options.height / 2 - boundingRectangle.top), {x: player.body.position.x, y: player.body.position.y})
}

Matter.Events.on(engine, 'beforeUpdate', function () {
  keyInputs()
  bulletCheck()
  updatePositions()
  // console.log(player.body.position)
})

Matter.World.add(engine.world, [player.body, player.turret, player.circle])

Matter.Engine.run(engine)
Matter.Render.run(render)