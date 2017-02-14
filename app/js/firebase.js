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

  upload (player, engine, input) {
    if (player.firebaseCounter <= engine.timing.timestamp && this.connected) {
      let newData = {
        position: {
          x: this.round(player.body.position.x),
          y: this.round(player.body.position.y)
        },
        key: input.key,
        rotation: this.round(player.body.angle),
        gunRotation: this.round(player.turret.angle),
        awake: new Date().valueOf()
      }

      this.base.ref(`lobbies/${this.lobby}/players/${this.id}`).set(newData)

      this.data[this.id] = newData
      player.firebaseCounter = engine.timing.timestamp + player.firebaseDelay
    }
  }

  round (num) {
    return parseFloat(num.toFixed(2))
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