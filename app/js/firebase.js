export default class Firebase {
  constructor (firebase) {
    firebase.initializeApp({
      apiKey: "AIzaSyDVzyV0aIznPEuu83CfGBrvXzXOxG9I9xc",
      authDomain: "tanks-edbcc.firebaseapp.com",
      databaseURL: "https://tanks-edbcc.firebaseio.com",
      storageBucket: "tanks-edbcc.appspot.com",
      messagingSenderId: "809665464388"
    })

    this.base = firebase.database()

    this.lobby = -1
    this.id = 0

    this.listener

    this.connected = false
    this.data = {}
  }

  connect (info) {
    this.lobby = info.lobby
    this.id = info.id

    this.listen()
  }

  disconnect () {
    this.lobby = -1
    this.id = 0
    this.connected = false

    this.base.ref.off(this.listener)
  }

  upload (player, engine) {
    if (player.firebaseCounter <= engine.timing.timestamp && this.connected) {
      this.base.ref(`lobbies/${this.lobby}/players/${this.id}`).set({
        position: {
          x: player.body.position.x,
          y: player.body.position.y
        },
        velocity: {
          x: player.body.velocity.x,
          y: player.body.velocity.y
        },
        rotation: player.body.angle,
        gunRotation: player.turret.angle,
        awake: new Date().valueOf()
      })
      player.firebaseCounter = engine.timing.timestamp + player.firebaseDelay
    }
  }

  listen () {
    var doSetup = true
    var that = this
    this.listener = this.base.ref(`lobbies/${this.lobby}/players`).on('value', function (snapshot) {
      if (doSetup) {
        that.data = snapshot.val()
        that.connected = true
        doSetup = false
      }
      else {
        that.data = snapshot.val()
      }
    })
  }
}