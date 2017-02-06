var Matter = require('matter-js');

window.onload = function () {
  var engine = Matter.Engine.create()
  engine.world.gravity.y = 0

  var render = Matter.Render.create({
      element: document.querySelector('.game-canvas'),
      options: {
        width: 1250,
        height: 550,
        background: '#d9d9d9',
        wireframeBackground: '#222',
        hasBounds: false,
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
  });

  var key = {
    w: false,
    a: false,
    s: false,
    d: false,
    space: false
  }

  var mouse = {
    x: 0,
    y: 0
  }

  var canvas = document.querySelector('.game-canvas canvas')

  // var turret = Matter.Composite.create()
  // Matter.Composite.add(turret, Matter.Bodies.rectangle(render.options.width / 2, render.options.height / 2 - 22, 12, 50, {
  //   collisionFilter: {
  //     mask: 0x0002
  //   },
  //   render: {
  //     strokeStyle: Matter.Common.shadeColor('#4ECDC4', -20),
  //     fillStyle: '#4ECDC4'
  //   }
  // }))

  var turret = Matter.Bodies.rectangle(render.options.width / 2, render.options.height / 2 , 12, 100, {
    collisionFilter: {
      mask: 0x0002
    },
    render: {
      strokeStyle: Matter.Common.shadeColor('#4ECDC4', -20),
      fillStyle: '#4ECDC4'
    }
  })

  var player = {
    body: Matter.Bodies.rectangle(render.options.width / 2, render.options.height / 2, 45, 70, {
      collisionFilter: {
        mask: 0x0001
      },
      render: {
        strokeStyle: Matter.Common.shadeColor('#4ECDC4', -20),
        fillStyle: '#4ECDC4'
      }
    }),
    turret: turret,
    circle: Matter.Bodies.circle(render.options.width / 2, render.options.height / 2, 12, {
      collisionFilter: {
        mask: 0x0004
      },
      render: {
        strokeStyle: Matter.Common.shadeColor('#4ECDC4', -20),
        fillStyle: '#4ECDC4'
      }
    }),
    speed: 0.001,
    turnSpeed: 0.04,
    gameSettings: {
      speed: 0.001,
      aimSpeed: 1,
      health: 100,
      shot: {
        speed: 0.004,
        reload: 100,
        distance: 1000,
        spray: 30,
        damage: 10
      }
    }
  }

  console.log(player.body.render)

  player.body.frictionAir = 0.05

  document.onkeydown = function (event) {
    if (event.keyCode == 87) key.w = true
    if (event.keyCode == 83) key.s = true
    if (event.keyCode == 65) key.a = true
    if (event.keyCode == 68) key.d = true
    if (event.keyCode == 32) key.space = true
  }

  document.onkeyup = function (event) {
    if (event.keyCode == 87) key.w = false
    if (event.keyCode == 83) key.s = false
    if (event.keyCode == 65) key.a = false
    if (event.keyCode == 68) key.d = false
    if (event.keyCode == 32) key.space = false
  }

  var rect = canvas.getBoundingClientRect()
  document.onmousemove = function (event) {

    // (evt.clientX-rect.left)/(rect.right-rect.left)*canvas.width,
    // (evt.clientY-rect.top)/(rect.bottom-rect.top)*canvas.height

    mouse.x = event.clientX
    mouse.y = event.clientY
  }

  function randomRange (min, max) {
    return Math.random() * (max - min) + min
  }

  // console.log(player.turret)
  // console.log(Matter.Composite.allBodies(player.turret)[0])
  var reloadCounter = 0
  var bulletArray = []

  Matter.Events.on(engine, 'beforeUpdate', function () {
    var rotation = player.body.angle + (90 * Math.PI / 180)

    if (key.w) {
      Matter.Body.applyForce(player.body, Matter.Vector.create(player.body.position.x, player.body.position.y), {x: -player.speed * Math.cos(rotation), y: -player.speed * Math.sin(rotation)})
    }
    if (key.s) {
      Matter.Body.applyForce(player.body, Matter.Vector.create(player.body.position.x, player.body.position.y), {x: player.speed * Math.cos(rotation), y: player.speed * Math.sin(rotation)})
    }
    if (key.a) {
      player.body.torque = -player.turnSpeed
    }
    if (key.d) {
      player.body.torque = player.turnSpeed
    }

    if (key.space) {
      if (reloadCounter <= engine.timing.timestamp) {
        let bullet = Matter.Bodies.circle(player.body.position.x, player.body.position.y, 6, {
          collisionFilter: {
            mask: 0x0008
          },
          render: {
            strokeStyle: Matter.Common.shadeColor('#4ECDC4', -20),
            fillStyle: '#4ECDC4'
          }
        })

        bullet.frictionAir = 0
        Matter.Body.applyForce(bullet, Matter.Vector.create(player.body.position.x, player.body.position.y), {
          x: player.gameSettings.shot.speed * Math.cos(player.turret.angle + (90 * Math.PI / 180) + randomRange(player.gameSettings.shot.spray, -player.gameSettings.shot.spray) * Math.PI / 180),
          y: player.gameSettings.shot.speed * Math.sin(player.turret.angle + (90 * Math.PI / 180) + randomRange(player.gameSettings.shot.spray, -player.gameSettings.shot.spray) * Math.PI / 180)
        })
        Matter.World.add(engine.world, bullet)
        bulletArray.push(bullet)
        reloadCounter = engine.timing.timestamp + player.gameSettings.shot.reload
      }
    }

    // Matter.Composite.rotate(player.turret, -Math.atan2(mouse.x - player.body.position.x - rect.left, mouse.y - player.body.position.y - rect.top), {x: player.body.position.x, y: player.body.position.y})

    Matter.Body.setPosition(player.turret, {x: player.body.position.x, y: player.body.position.y})
    Matter.Body.setPosition(player.circle, {x: player.body.position.x, y: player.body.position.y})

    // Matter.Composite.allBodies(player.turret)[0].position = {x: player.body.position.x, y: player.body.position.y}

    Matter.Body.setAngle(player.turret, -Math.atan2(mouse.x - player.body.position.x - rect.left, mouse.y - player.body.position.y - rect.top))

    // console.log(Math.atan2(render.options.width - mouse.x - player.body.position.x, render.options.height - mouse.y - player.body.position.y) * 180 / Math.PI)\
    for (var i = 0; i < bulletArray.length; i++) {
      var pos = bulletArray[i].position
      var output = {x: 0, y: 0}

      output.x = Math.pow(pos.x - player.body.position.x, 2)
      output.y = Math.pow(pos.y - player.body.position.y, 2)

      if (Math.sqrt(output.x + output.y) >= player.gameSettings.shot.distance) {
        Matter.World.remove(engine.world, bulletArray[i])
      }

    }
  })

  Matter.World.add(engine.world, [player.body, player.turret, player.circle])

  Matter.Engine.run(engine)

  Matter.Render.run(render)
}