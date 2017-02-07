export default class Firebase {
  constructor (firebase) {
    this.base = firebase
    this.base.initializeApp({
      apiKey: "AIzaSyDVzyV0aIznPEuu83CfGBrvXzXOxG9I9xc",
      authDomain: "tanks-edbcc.firebaseapp.com",
      databaseURL: "https://tanks-edbcc.firebaseio.com",
      storageBucket: "tanks-edbcc.appspot.com",
      messagingSenderId: "809665464388"
    })

    this.lobby = -1
    this.id = 0
  }

  moveTo (data) {
    this.lobby = data.lobby
    this.id = data.id
  }

  upload (player, engine) {
    if (player.firebaseCounter <= engine.timing.timestamp && this.lobby != -1) {
      this.base.database().ref(`lobby/${this.lobby}/players/${this.id}`).set({
        x: player.body.position.x,
        y: player.body.position.y,
        awake: new Date().valueOf()
      })
      player.firebaseCounter = engine.timing.timestamp + player.firebaseDelay
    }
  }

  listen () {
    this.base.database().ref(`lobby/${this.lobby}/players`).on('value', function (snapshot) {
      Window.data = snapshot.val()
    })
  }
}