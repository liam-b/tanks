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
    for (var opponent in opponents) {
      if (opponents.hasOwnProperty(opponent) && Object.keys(opponents)[Object.keys(opponents).indexOf(opponent)] != id) {
        this.collection.push(new Opponent(this.Matter, this.render, this.engine, this.color, Object.keys(opponents)[Object.keys(opponents).indexOf(opponent)]))
      }
    }
    console.log(this.collection)
  }

  update (data, id) {
    for (var opponent in this.collection) {
      if (this.collection.hasOwnProperty(opponent)) {
        // FIXME: while 0 is 'two' in collection, 0 is 'liam' in data
        // console.log(opponent, Object.keys(data), Object.keys(this.collection))
        this.collection[opponent].update(data[this.collection[opponent].id])
      }
    }
  }
}