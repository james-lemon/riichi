/*
    -1 = unknown tile (hidden tile)
    1crack = 0
    9crack = 8
    1pin = 9
    9pin = 17
    1bam = 18
    9bam = 26
    eastwind = 27
    southwind = 28
    westwind = 29
    northwind = 30
    whitedragon = 31
    greendragon = 32
    reddragon = 33
*/

export class Tile {
  constructor (code = -1, isShown = 'no') {
    this.code = code
    if (isShown !== 'no' && isShown !== 'yes' && isShown !== 'playerOnly') {
      throw new Error('invalid isShown value')
    }
    if ((isShown === 'yes' || isShown === 'playerOnly') && code === -1) {
      throw new Error('shown tile cannot have an unknown value')
    }
    this.isShown = isShown
  }

  getIsShown () {
    return this.isShown
  }

  setShownValue (isShown) {
    if (isShown !== 'no' && isShown !== 'yes' && isShown !== 'playerOnly') {
      throw new Error('invalid isShown value')
    }
    if ((isShown === 'yes' || isShown === 'playerOnly') && this.code === -1) {
      throw new Error('shown tile cannot have an unknown value')
    }
    this.isShown = isShown
    return this.isShown
  }

  getCode () {
    return this.code
  }

  setCode (code) {
    this.code = code
    return code
  }

  isCrack () {
    return this.code > -1 && this.code < 9
  }

  isPin () {
    return this.code > 8 && this.code < 18
  }

  isBam () {
    return this.code > 17 && this.code < 27
  }

  isHonor () {
    return this.code > 26
  }

  isWind () {
    return this.code > 26 && this.code < 31
  }

  isDragon () {
    return this.code > 30
  }
}

export class TileSet {
  constructor () {
    this.tiles = []
    for (let i = 0; i < 34; i++) {
      // There are 4 of each tile in a Mahjong set.
      this.tiles.push(new Tile(i))
      this.tiles.push(new Tile(i))
      this.tiles.push(new Tile(i))
      this.tiles.push(new Tile(i))
    }
  }

  shuffle () {
    this.tiles.sort(() => Math.random() - 0.5)
  }

  getTiles () {
    return this.tiles
  }
}

export class Hand {
  // Tiles is an array of 13 tiles
  constructor (tiles) {
    if (tiles.length !== 13) {
      throw new Error('Hands need 13 tiles')
    }
    this.tiles = tiles
  }

  getTiles () {
    return this.tiles
  }
}

export class Discards {
  constructor (tiles = []) {
    this.tiles = tiles
  }

  getTiles () {
    return this.tiles
  }
}

export class Player {
  constructor (hand, discards, score = 25000) {
    this.hand = hand
    this.discards = discards
    this.score = score
  }

  getHand () {
    return this.hand
  }

  getDiscards () {
    return this.discards
  }

  getScore () {
    return this.score
  }

  // Set to negative if user lost points.  Positve if user gained points
  changeScore (value) {
    this.score = this.score + value
    return this.score
  }
}

// Rules for deadwall http://arcturus.su/wiki/Wanpai
// 0-3 are kan tiles
// 4-7 are dora indiators
// 8-11 are uradora indiators
export class DeadWall {
  constructor (tiles, activeDoraIndicators = 0) {
    if (tiles.length !== 14) {
      throw new Error('A deadwall needs 14 tiles')
    }
    this.tiles = tiles
    this.activeDoraIndicators = activeDoraIndicators
    this.flipDoraIndicator()
  }

  flipDoraIndicator () {
    if (this.activeDoraIndicators === 5) {
      throw new Error('Cannot flip dora indicator')
    }
    this.activeDoraIndicators++
    const newDoraTile = this.tiles[3 + this.activeDoraIndicators]
    newDoraTile.setShownValue('yes')
    return newDoraTile
  }

  // Call kan, then Flip Dora Indicator
  kan (liveWall) {
    if (this.activeDoraIndicators === 5) {
      return false
    }
    const tileToReturn = this.tiles[this.activeDoraIndicators - 1]
    tileToReturn.setShownValue('playerOnly')

    // Moves haiteihai to replace kan draw
    this.tiles[this.activeDoraIndicators - 1] = liveWall.getTiles().pop()

    return tileToReturn
  }

  getActiveDoraIndicators () {
    return this.activeDoraIndicators
  }

  getTiles () {
    return this.tiles
  }
}

// Rules for wall http://arcturus.su/wiki/Haiyama
export class Wall {
  constructor (tiles) {
    if (tiles.length !== 69) {
      throw new Error('A wall needs 69 tiles')
    }
    this.tiles = tiles
  }

  draw () {
    const drawnTile = this.tiles.shift()
    drawnTile.setShownValue('playerOnly')
    return drawnTile
  }

  kanReplacement () {
    const kanTile = this.tiles.pop()
    return kanTile
  }

  getTiles () {
    return this.tiles
  }
}

export class Game {
  constructor (players, wall, deadWall) {
    if (players.length > 4 || players.length < 2) {
      throw new Error('A game needs 2-4 players')
    }
    this.players = players
    this.deadWall = deadWall
    this.wall = wall
  }

  getPlayers () {
    return this.players
  }
}

export class Table {
  constructor (games = []) {
    this.games = games
  }

  Deal (playerCount) {
    const tileSet = new TileSet()
    tileSet.shuffle()
    const tiles = tileSet.getTiles()

    // nice
    const wall = new Wall(tiles.splice(0, 69))
    const deadWall = new DeadWall(tiles.splice(0, 14))

    const players = []
    for (let i = 0; i < playerCount; i++) {
      const playerTiles = []
      for (let j = 0; j < 13; j++) {
        const playerTile = tiles.shift()
        playerTile.setShownValue('playerOnly')
        playerTiles.push(playerTile)
      }
      players[i] = new Player(playerTiles)
    }

    const game = new Game(players, wall, deadWall)
    this.games.push(game)
    return game
  }

  getGames () {
    return this.games
  }
}
