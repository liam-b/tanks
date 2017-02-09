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

    this.lobby = ''
    this.id = ''

    this.listener

    this.connected = false
    this.data = {}
  }

  connect (info, resolve) {
    this.lobby = info.lobby
    this.id = info.id

    this.base.ref(`lobbies/${this.lobby}/players/${this.id}`).set({
      position: {
        x: 0,
        y: 0
      },
      velocity: {
        x: 0,
        y: 0
      },
      rotation: 0,
      gunRotation: 0,
      awake: new Date().valueOf()
    })

    this.listen(resolve)
  }

  disconnect () {
    this.base.ref(`lobbies/${this.lobby}/players/`).off('value', this.listener)
    this.base.ref(`lobbies/${this.lobby}/players/${this.id}`).remove()

    this.lobby = ''
    this.id = ''
    this.connected = false
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

  listen (resolve) {
    var doSetup = true
    var that = this
    this.listener = this.base.ref(`lobbies/${this.lobby}/players`).on('value', function (snapshot) {
      if (doSetup) {
        that.data = snapshot.val()
        that.connected = true
        doSetup = false
        resolve()
      }
      else {
        that.data = snapshot.val()
      }
    })
  }
}