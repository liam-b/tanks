import * as listeners from './listeners.js'
import Player from './player.js'
import OpponentCollection from './opponents.js'
import Firebase from './firebase.js'

import Matter from 'matter-js'

document.onkeydown = listeners.onkeydown
document.onkeyup = listeners.onkeyup
document.onmousemove = listeners.onmousemove

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

var input = {
  mouse: listeners.mouse,
  key: listeners.key
}

Math.randomRange = function (min, max) {
  return Math.random() * (max - min) + min
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

function updatePlayers () {
  // player.update(input, boundingRectangle)
  // opponent.update(Window.data, database.id)
}

var canvas = document.querySelector('.game-canvas canvas')
var boundingRectangle = canvas.getBoundingClientRect()

var doConnected = true

var player
var opponents = new OpponentCollection (Matter, render, engine, '#C44D58')
var database = new Firebase (firebase)

Matter.Events.on(engine, 'beforeUpdate', function () {
  if (database.connected) {
    update()
  }
})

function disconnected () {
  opponents.reset()
}

function connected () {
  opponents.generate(database.data, database.id)
  player = new Player (Matter, render, engine, '#4ECDC4')
}

function update () {
  bulletCheck()

  opponents.update(database.data, database.id)

  player.update({key: database.data[database.id].key, mouse: input.mouse}, boundingRectangle)
  Matter.Bounds.shift(render.bounds, {x: player.body.position.x - render.options.width / 2, y: player.body.position.y - render.options.height / 2})

  database.upload(player, engine, input)
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('#connect').onclick = function () {
    new Promise (function (resolve, reject) {
      database.connect({
        lobby: document.querySelector('#lobby').value,
        id: document.querySelector('#player').value
      }, resolve)
    }).then(connected)
  }
  document.querySelector('#disconnect').onclick = function () {
    database.disconnect()
    disconnected()
  }
})

window.addEventListener('beforeunload', function (event) {
  database.disconnect()
  disconnected()
}, false)

Matter.Engine.run(engine)
Matter.Render.run(render)