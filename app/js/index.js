import Player from './player.js'
import Opponent from './opponent.js'
import Matter from 'matter-js'
import * as listeners from './listeners.js'

firebase.initializeApp({
  apiKey: "AIzaSyDVzyV0aIznPEuu83CfGBrvXzXOxG9I9xc",
  authDomain: "tanks-edbcc.firebaseapp.com",
  databaseURL: "https://tanks-edbcc.firebaseio.com",
  storageBucket: "tanks-edbcc.appspot.com",
  messagingSenderId: "809665464388"
})

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
  player.update(input, boundingRectangle)
  opponent.update()
}

function sendToFirebase () {
  if (player.firebaseCounter <= engine.timing.timestamp) {
    firebase.database().ref('/players/0').set({
      x: player.body.position.x,
      y: player.body.position.y,
      awake: new Date().valueOf()
    })

    player.firebaseCounter = engine.timing.timestamp + player.firebaseDelay
  }
}

function firebaseListen () {
  firebase.database().ref('/players/1').on('value', function (snapshot) {
    let data = snapshot.val()
  })
}

var canvas = document.querySelector('.game-canvas canvas')
var boundingRectangle = canvas.getBoundingClientRect()

var player = new Player (Matter, render, engine, '#4ECDC4')
var opponent = new Opponent (Matter, render, engine, '#C44D58')

firebaseListen()

Matter.Events.on(engine, 'beforeUpdate', function () {
  bulletCheck()
  updatePlayers()

  Matter.Bounds.shift(render.bounds, {x: player.body.position.x - render.options.width / 2, y: player.body.position.y - render.options.height / 2})

  sendToFirebase()
})

Matter.Engine.run(engine)
Matter.Render.run(render)