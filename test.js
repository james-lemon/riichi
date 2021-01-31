import { TileSet, Tile, Player, Hand, Wall, DeadWall, Table, Game, Discards } from './riichiLib.js'
import test from 'ava'

test('tileSetTests', t => {
  const tileSet = new TileSet()
  const tiles = tileSet.getTiles()
  // When constructed they should be in order
  for (let i = 0; i < 33 * 4; i++) {
    if (tiles[i].getCode() !== Math.floor(i / 4)) {
      t.fail('Problem with initlization of tiles')
    }
    if (tiles[i].isRed()) {
      t.fail('We should have no red fives')
    }
  }

  // When shuffled the tiles should be random
  tileSet.shuffle()

  let isShuffled = false
  const shuffledTileSet = tileSet.getTiles()
  for (let i = 0; i < 33 * 4; i++) {
    if (shuffledTileSet[i].getCode() !== Math.floor(i / 4)) {
      // This one is out of place
      isShuffled = true
    }
  }

  t.is(true, isShuffled, 'Tiles should be shuffled')

  const redFiveTileSet = new TileSet(true)
  const redFiveTiles = redFiveTileSet.getTiles()
  t.is(redFiveTiles[16].isRed(), true, 'should have set this tile as red')
  t.is(redFiveTiles[17].isRed(), false, 'only one five should be set as red')
})

test('tileTests', t => {
  const oneCrack = new Tile(0)
  const onePin = new Tile(9)
  const oneBam = new Tile(18)
  const eastWind = new Tile(27)
  const whiteDragon = new Tile(31)
  const redDragon = new Tile(33)

  t.is(true, oneCrack.isCrack(), 'One of crack is a crack')
  t.is(false, oneCrack.isPin(), 'One of crack is not a pin')
  t.is(false, oneCrack.isBam(), 'One of crack is not a bam')
  t.is(false, oneCrack.isDragon(), 'One of crack is not a dragon')
  t.is(false, oneCrack.isWind(), 'One of crack is not a wind')

  t.is(false, onePin.isCrack(), 'One of pin is not a crack')
  t.is(true, onePin.isPin(), 'One of pin is a pin')
  t.is(false, onePin.isBam(), 'One of pin is not a bam')
  t.is(false, onePin.isDragon(), 'One of pin is not a dragon')
  t.is(false, onePin.isWind(), 'One of pin is not a wind')

  t.is(false, oneBam.isCrack(), 'One of bam is not a crack')
  t.is(false, oneBam.isPin(), 'One of bam is not a pin')
  t.is(true, oneBam.isBam(), 'One of bam is a bam')
  t.is(false, oneBam.isDragon(), 'One of bam is not a dragon')
  t.is(false, oneBam.isWind(), 'One of bam is not a wind')

  t.is(false, eastWind.isCrack(), 'East wind is not a crack')
  t.is(false, eastWind.isPin(), 'East wind is not a pin')
  t.is(false, eastWind.isBam(), 'East wind is not a bam')
  t.is(false, eastWind.isDragon(), 'East wind is not a dragon')
  t.is(true, eastWind.isWind(), 'East wind is a wind')

  t.is(false, whiteDragon.isCrack(), 'White dragon is not a crack')
  t.is(false, whiteDragon.isPin(), 'White dragon is not a pin')
  t.is(false, whiteDragon.isBam(), 'White dragon is not a bam')
  t.is(true, whiteDragon.isDragon(), 'White dragon is a dragon')
  t.is(false, whiteDragon.isWind(), 'White dragon is not a wind')

  t.is(false, redDragon.isCrack(), 'Red dragon is not a crack')
  t.is(false, redDragon.isPin(), 'Red dragon is not a pin')
  t.is(false, redDragon.isBam(), 'Red dragon is not a bam')
  t.is(true, redDragon.isDragon(), 'Red dragon is a dragon')
  t.is(false, redDragon.isWind(), 'Red dragon is not a wind')

  const defaultTile = new Tile()
  t.is(defaultTile.getCode(), -1, 'Default tile code is unknown')
  t.is(defaultTile.getIsShown(), 'no', 'Default tile isShown is no')

  t.is(defaultTile.setCode(5), 5, 'Should be able to update tile code')
  t.is(defaultTile.setShownValue('playerOnly'), 'playerOnly', 'Should be able to set a tile shown value to playerOnly')
  t.is(defaultTile.setShownValue('yes'), 'yes', 'Should be able to set a tile shown value to yes')
  t.is(defaultTile.isRed(), false, 'Default tile is not red')

  const redTile = new Tile(4)
  redTile.setAsRed()
  t.is(redTile.isRed(), true, 'Tile is set as red')
})

test('handTests', t => {
  const wallTiles = []
  for (let i = 0; i < 69; i++) {
    wallTiles.push(new Tile(Math.floor(i / 4)))
  }
  const wall = new Wall(wallTiles)
  const handTiles = []
  for (let i = 0; i < 13; i++) {
    handTiles.push(new Tile(i))
  }
  const hand = new Hand(handTiles)
  t.is(13, hand.getTiles().length, 'The tile count is not current')

  // Simulate drawing and discarding
  const drawnTile = hand.draw(wall)
  t.is(hand.getTiles().length, 14, 'Player currently has 14 tiles')
  t.is(drawnTile.getIsShown(), 'playerOnly', 'A drawn tile is only visable to the player')

  const discardedTile = hand.discard(hand.getTiles()[13])
  t.is(hand.getTiles().length, 13, 'Player currently has 13 tiles')
  t.is(discardedTile.getIsShown(), 'yes', 'discard tiles are visable to the public')
})

test('discardTests', t => {
  const discards = new Discards([new Tile(0), new Tile(14), new Tile(5)])
  t.is(discards.getTiles().length, 3, 'Discard length is incorrect')
})

test('playerTests', t => {
  const handTiles = []
  for (let i = 0; i < 13; i++) {
    handTiles.push(new Tile(i))
  }
  const hand = new Hand(handTiles)

  const discards = new Discards()
  const player = new Player(hand, discards)
  t.is(player.getDiscards().getTiles().length, discards.getTiles().length, 'Discard length is incorrect')
  t.is(player.getHand().getTiles().length, hand.getTiles().length, 'Hand length is incorrect')
  t.is(player.getScore(), 25000, 'The inital player score is 25000')
  t.is(player.changeScore(-1000), 24000, 'Change score should reduce for negative values')
  t.is(player.changeScore(6000), 30000, 'Change score should add for positive values')
  t.is(player.getScore(), 30000, 'Changing score should presist values in players score')
})

test('deadWallTests', t => {
  const deadWallTiles = []
  for (let i = 0; i < 14; i++) {
    deadWallTiles.push(new Tile(i))
  }
  const deadWall = new DeadWall(deadWallTiles)

  const liveWallTiles = []
  for (let i = 0; i < 69; i++) {
    liveWallTiles.push(new Tile(Math.floor(i / 4)))
  }
  const wall = new Wall(liveWallTiles)

  t.is(deadWall.getActiveDoraIndicators(), 1, 'All dead walls should start with one active dora indicatior')
  t.is(deadWall.getTiles().length, 14, 'A deadw all always has 14 tiles')

  const kanTile = deadWall.kan(wall)

  t.is(kanTile.getCode(), 0, 'The kan tile should be the first tile on the wall')
  t.is(kanTile.getIsShown(), 'playerOnly', 'Kanned tiles should be shown only to the player that drew it')
  t.is(deadWall.getActiveDoraIndicators(), 1, 'Kanning should not increase the dora indicator, flipping a dora indicator is a seprate action.')
  t.is(deadWall.getTiles().length, 14, 'A dead wall always has 14 tiles')
  t.is(wall.getTiles().length, 68, 'Kanning should have removed a tile from the live wall')

  const doraTile = deadWall.flipDoraIndicator()

  t.is(doraTile.getCode(), 5, 'The 2nd dora indicator is the 6th tile on the dead wall')
  t.is(doraTile.getIsShown(), 'yes', 'Active dora indicators are shown to the entire table')
  t.is(deadWall.getActiveDoraIndicators(), 2, 'Now there are 2 active dora indicators')
  t.is(deadWall.getTiles().length, 14, 'A dead wall always has 14 tiles')
})

test('wallTests', t => {
  const tiles = []
  for (let i = 0; i < 69; i++) {
    tiles.push(new Tile(Math.floor(i / 4)))
  }
  const wall = new Wall(tiles)
  const wallTiles = wall.getTiles()
  for (let i = 0; i < wallTiles.length; i++) {
    t.is(wallTiles[i].getIsShown(), 'no', 'Tiles on the wall should be hidden')
  }
  t.is(wall.getTiles().length, 69, 'A wall should start with 69 tiles')
  const drawnTile = wall.draw()
  t.is(drawnTile.getCode(), 0, 'The first tile on the wall is a 0 code tile')
  t.is(drawnTile.getIsShown(), 'playerOnly', 'Drawn tiles should be visiable to the player only')
  t.is(wall.getTiles().length, 68, 'Drawing a tile should remove a tile from the wall')
  const kanTile = wall.kanReplacement()
  t.is(kanTile.getCode(), 17, 'The kan replacement tile should be code 17')
  t.is(kanTile.getIsShown(), 'no', 'Kan replacement tile should be hidden')
  t.is(wall.getTiles().length, 67, 'Getting the kan repleacement tile should remove a tile from the wall')
})

test('gameTests', t => {
  const p1Tiles = []
  for (let i = 0; i < 13; i++) {
    p1Tiles.push(new Tile(i))
  }
  const p1Hand = new Hand(p1Tiles)
  const p1Discards = new Discards()
  const player1 = new Player(p1Hand, p1Discards)

  const p2Tiles = []
  for (let i = 0; i < 13; i++) {
    p2Tiles.push(new Tile(i))
  }
  const p2Hand = new Hand(p2Tiles)
  const p2Discards = new Discards()
  const player2 = new Player(p2Hand, p2Discards)

  const wallTiles = []
  for (let i = 0; i < 69; i++) {
    wallTiles.push(new Tile(Math.floor(i / 4)))
  }
  const wall = new Wall(wallTiles)

  const deadWallTiles = []
  for (let i = 0; i < 14; i++) {
    deadWallTiles.push(new Tile(i))
  }
  const deadWall = new DeadWall(deadWallTiles)

  const players = [player1, player2]

  const game = new Game(players, wall, deadWall)
  t.is(game.getPlayers().length, 2, 'There are two players in this game')
})

test('tableTests', t => {
  const table = new Table()
  t.is(table.getGames().length, 0, 'We have not started a game yet')
  t.is(table.Deal(4).getPlayers().length, 4, 'We started a game with 4 players')
  t.is(table.getGames().length, 1, 'We have a game started')

  const game = table.getGames()[0]

  for (let i = 0; i < game.getPlayers().length; i++) {
    for (let j = 0; j < game.getPlayers()[i].getHand().length; j++) {
      t.is(game.getPlayers()[i].getHand()[j].getIsShown(), 'playerOnly', 'tiles delt into a players hand should be viewed only to the player')
    }
  }
})
