import Opponent from './opponent.js'

export default class OpponentCollection {
  constructor (Matter, render, engine, color) {
    this.opponent = Opponent
    this.collection = []
    this.Matter = Matter
    this.render = render
    this.engine = engine
    this.color = color
  }

  generate (opponents, id) {
    this.reset()
    for (var opponent in opponents) {
      if (opponents.hasOwnProperty(opponent) && Object.keys(opponents)[Object.keys(opponents).indexOf(opponent)] != id) {
        let newTank = this.collection.push(new Opponent(this.Matter, this.render, this.engine, this.color, Object.keys(opponents)[Object.keys(opponents).indexOf(opponent)]))
      }
    }
  }

  update (data, id) {
    var collectedOpponents = []
    for (var opponent in this.collection) {
      if (this.collection.hasOwnProperty(opponent)) {
        collectedOpponents.push(this.collection[opponent].id)
      }
    }

    var leaves = collectedOpponents.filter(function (current) {
      return Object.keys(data).indexOf(current) === -1
    })

    var joins = Object.keys(data).filter(function (current) {
      return collectedOpponents.indexOf(current) === -1
    })

    for (var leave = 0; leave < leaves.length; leave += 1) {
      for (var opponent in this.collection) {
        if (this.collection.hasOwnProperty(opponent) && this.collection[opponent].id == leaves[leave]) {
          this.collection[opponent].remove()
          this.collection.splice(opponent, 1)
        }
      }
    }

    for (var join = 0; join < joins.length; join += 1) {
      if (joins[join] != id) {
        this.collection.push(new Opponent(this.Matter, this.render, this.engine, this.color, joins[join]))
      }
    }

    for (var opponent in this.collection) {
      if (this.collection.hasOwnProperty(opponent)) {
        this.collection[opponent].update(data[this.collection[opponent].id])
      }
    }
  }

  reset () {
    this.Matter.World.clear(this.engine.world)
    this.collection = []
  }
}