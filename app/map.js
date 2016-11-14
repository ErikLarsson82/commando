define('app/map', [], function() {
  /*
    PLAYER: 1,
    TILE: 2,
    ENEMY:  ,
    ENEMYSPAWN: 4,
    BLOWABLE: 5,
    TILE2: 6,
    TILE : 7,
  */
  const A = 'A' // stones001
  const B = 'B' // stones002
  const C = 'C' // grass001
  return {
    getMap: function() {

        return [
            [2,2,2,2,2,2,2, , , ,2,2,2,2,2,2],
            [2,7,2,2,6,2,2, , , ,2,2,2,6,2,2],
            [2, , , , ,2,2, , ,C,2,2, , , ,2],
            [2, , , , , , , , , , , , , , ,2],
            [2, , , , , , , , , , , , , , ,2],
            [2, , , , , , , , , , , , , , ,2],
            [2, , , , , , , , , , , , , , ,2],
            [2, , , , ,B, , , , , , , , , ,2],
            [2, , , , , , , , , , , , , , ,2],
            [2, , , , , , , , , , , , , , ,2],
            [2, , , , , , , , , , , , , , ,2],
            [2,2,6,5, , , , , , , , , , , ,2],
            [2, , , , , , , , , , , , , , ,2],
            [2, , , , , , , , , , , , , , ,2],
            [2, , , , , , , , , , , , , , ,2],
            [2, , , , , , , ,A, , , , , , ,2],
            [2, , , , , , , , , , , , , , ,2],
            [2,2,2, , ,2, , , , , , , , , ,2],
            [2, , , , ,2,C, , , , , , , , ,2],
            [2, , , , , , , , , , ,B, , , ,2],
            [2, , , , , , , , , , , , , , ,2],
            [2, , , , , , , , , , , , , , ,2],
            [2, , , , , ,A, , , , , , , , ,2],
            [2, , , , , , , , , , , , , , ,2],
            [2, , , , ,B, , , , , , , , , ,2],
            [2, , , , , , , , , , , , , , ,2],
            [2, , , , , , , , , , , , , , ,2],
            [2, , , , , , , , , , , , , , ,2],
            [2, , , ,6,2,7,2, , , , , ,2,2,2],
            [2, , , , , , , , , , ,5,2,2,2,2],
            [2, , , , , , , , , , , ,2,7,2,2],
            [2, , , , , , , , , , , , , , ,2],
            [2, , , , , , , ,A, , , , , , ,2],
            [2, , , , , , , , , , , , , , ,2],
            [2,2,7, , ,2, , , , , , , , , ,2],
            [2,5, , , ,6,C, , , , , , , , ,2],
            [2, , , , , , , , , , ,B, , , ,2],
            [2, , , , , , , , , , , , , , ,2],
            [2, , , , , , , , , , , , , , ,2],
            [2, , , , , ,A, , , , , , , , ,2],
            [2, , , , , , , , , , , , , , ,2],
            [2, , , , , , , , , , , , , ,A,2],
            [2, , , , , , , , , , , , , , ,2],
            [2, , , , , , , , ,C, , , , , ,2],
            [2, , , , , , , , , , , , , , ,2],
            [2,2,6,2, , , , , , , ,2,2, , ,2],
            [2, , , , , , , , , , , , , , ,2],
            [2, , , , , , , , , , , , , , ,2],
            [2, , , , , , , , , , , , , , ,2],
            [2, , , , , , , , , , , , , , ,2],
            [2, , ,B, , , , , , , , , , , ,2],
            [2, , , , , , , , , , , , , , ,2],
            [2, , , , , , , , , , , , , , ,2],
            [2, , , , , , , , , , , , , , ,2],
            [2,2,2,2,5,5,5,2,6,7,2,2,2,2,2,2],
            [2, , , , , , , , , , , , , , ,2],
            [2, , , , , , , , , , , , , , ,2],
            [2, , , , , , , , , , , , , , ,2],
            [2, , , , , , , , , , , , , ,A,2],
            [2, , , , , , , , , , , , , , ,2],
            [2, ,C, , , , , , , , , ,A, , ,2],
            [2, , , , , , , , , , , , , , ,2],
            [2, , ,1, , , , , , , , , , , ,2],
            [2, , , , , , , , , , , , ,B, ,2],
            [2, , , , , , , , , , , , , , ,2],
            [2, , , , , , , , , , , , , , ,2],
        ]
    }
  }
})