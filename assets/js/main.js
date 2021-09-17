setInterval(() => {
  var birth = new Date('2006-04-28T05:10:00')
  var now = new Date()
  var printOut =
    (now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 365.25)

  var el = document.getElementById('ageNumber')

  if (el) {
    el.innerHTML = printOut.toFixed(12)
  }
}, 1)

function activeItems(el) {
  Array.from(document.getElementsByClassName('nav-link')).forEach(function (e) {
    e.classList.remove('active')
  })
  el.classList.add('active')
}

var board = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
]

let p1 = 1 // hrac
let p2 = 0 // script / druhy hrac
let cp // aktualni hrac
let mode // 0 human, 1 ai
let playing = false // pokud bezi hra
let winningSection = [] // 3 pole při výhře
let roundNum = 0 // číslo kola od 1
let difficulty = 1 // obtížnost, 0 easy, 1 medium, 2 hard

function loop() {
  roundNum += 1
  playing = true
  let roundEl = document.getElementById('game-player')
  if (roundEl) roundEl.innerHTML = cp == p1 ? 'X' : cp == p2 ? '0' : ' '
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      setField(x + 1, y + 1, board[x][y], null)
    }
  }
  let res = checkForWinner()
  if (res == 0 || res == 1) {
    endGame(res, winningSection)
  } else if (res == 'tie') {
    endGame()
  }
}

function checkForWinner() {
  let winner = null
  // vodorovne
  for (let i = 0; i < 3; i++) {
    if (board[i][0] == board[i][1] && board[i][1] == board[i][2]) {
      if (board[i][0] != null) {
        winner = board[i][0]
        winningSection = [
          [i + 1, 1],
          [i + 1, 2],
          [i + 1, 3],
        ]
      }
    }
  }
  // svisle
  for (let i = 0; i < 3; i++) {
    if (board[0][i] == board[1][i] && board[1][i] == board[2][i]) {
      if (board[0][i] != null) {
        winner = board[0][i]
        winningSection = [
          [1, i + 1],
          [2, i + 1],
          [3, i + 1],
        ]
      }
    }
  }
  // diagonalne
  if (board[0][0] == board[1][1] && board[1][1] == board[2][2]) {
    if (board[0][0] != null) {
      winner = board[0][0]
      winningSection = [
        [1, 1],
        [2, 2],
        [3, 3],
      ]
    }
  }
  if (board[0][2] == board[1][1] && board[1][1] == board[2][0]) {
    if (board[2][0] != null) {
      winner = board[2][0]
      winningSection = [
        [1, 3],
        [2, 2],
        [3, 1],
      ]
    }
  }

  let openSpots = 0
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] == null) {
        openSpots++
      }
    }
  }

  // pokud je vse zaplnenp
  if (winner == null && openSpots == 0) {
    return 'tie'
  } else {
    return winner
  }
}

function endGame(winner, section) {
  playing = false
  if (winner == 0 || winner == 1) {
    section.forEach((e) => {
      setField(e[0], e[1], winner == p2 ? 2 : 3, null)
    })
    invis(true, ['game-round'], ['game-btn-human', 'game-btn-ai'])
    let gameWon = document.getElementById('game-won-span')
    if (gameWon) {
      gameWon.innerHTML = winner == p1 ? 'X' : winner == p2 ? 'O' : ' '
    }
    invis(false, ['game-won'], [])
    setTimeout(() => {
      if (playing) return
      restart()
    }, 3000)
  } else {
    invis(true, ['game-round'], ['game-btn-human', 'game-btn-ai'])
    invis(false, ['game-tie'], [])
    setTimeout(() => {
      if (playing) return
      restart()
    }, 3000)
  }
  board = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]
  mode = undefined
}

function restart() {
  invis(true, ['game-won', 'game-tie', 'game-btn-restart'], [])
  invis(
    true,
    ['game-row-1', 'game-row-2', 'game-row-3'],
    ['game-btn-human', 'game-btn-ai'],
  )
  invis(false, ['game-col-dif'], [])
  board = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]
  mode = undefined
}

function startButton(el) {
  cp = getRandomInt(0, 1) < 1 ? p1 : p2
  if (el.id == 'game-btn-ai') {
    loop()
    mode = 1
    invis(
      false,
      [
        'game-row-1',
        'game-row-2',
        'game-row-3',
        'game-round',
        'game-btn-restart',
      ],
      ['game-btn-human', 'game-btn-ai'],
    )
    invis(true, ['game-won', 'game-tie', 'game-col-dif'], [])
    round()
  } else if (el.id == 'game-btn-human') {
    loop()
    mode = 0
    invis(
      false,
      [
        'game-row-1',
        'game-row-2',
        'game-row-3',
        'game-round',
        'game-btn-restart',
      ],
      ['game-btn-human', 'game-btn-ai'],
    )
    invis(true, ['game-won', 'game-tie', 'game-col-dif'], [])
  }
}

function round() {
  // ai's best move
  if (cp == p2) {
    let move = minimaxCFEFS()
    board[move.x][move.y] = p2
    cp = p1
    loop()
  }
}

let scores = {
  0: 10,
  1: -10,
  tie: 0,
}
let cr = 0
let difs = {
  0: 60,
  1: 30,
  2: 15,
}

function minimaxCFEFS() {
  // call minimax for every free spot
  let bestScore = -Infinity
  let move
  let secBoard = board
  let chan = chance.bool({ likelihood: difs[difficulty] })
  if (chan == false) {
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        if (secBoard[x][y] != 0 && secBoard[x][y] != 1) {
          secBoard[x][y] = p2
          let score = minimax(secBoard, 0, false)
          secBoard[x][y] = null
          if (score > bestScore) {
            bestScore = score
            move = { x, y }
          }
        }
      }
    }
  } else {
    function getRandomFreeSpot(thrBoard) {
      var xs = getRandomInt(0, 2)
      var ys = getRandomInt(0, 2)
      if (thrBoard[xs][ys] == null) {
        return { x: xs, y: ys }
      } else {
        return getRandomFreeSpot(thrBoard)
      }
    }
    move = getRandomFreeSpot(secBoard)
  }
  return move
}

function minimax(NMboard, depth, isMaximizing) {
  cr += 1
  let result = checkForWinner()
  if (result != null) {
    return scores[result]
  }
  let bestScore = isMaximizing ? -Infinity : Infinity
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      if (NMboard[x][y] != 0 && NMboard[x][y] != 1) {
        NMboard[x][y] = isMaximizing ? p2 : p1
        let score = minimax(NMboard, depth + 1, isMaximizing ? false : true)
        NMboard[x][y] = null
        bestScore = isMaximizing
          ? Math.max(score, bestScore)
          : Math.min(score, bestScore)
      }
    }
  }
  return bestScore
}

function gameClick(el) {
  if (!playing) return
  if (mode == 1 && cp == p2) {
    return
  }
  if (!/^game-[0-9]{2}$/.test(el.id)) return
  var xy = el.id.match(/[0-9]{2}/)[0]
  var x = Number(xy.charAt(0))
  var y = Number(xy.charAt(1))
  if (board[x - 1][y - 1] != null) return
  board[x - 1][y - 1] = cp
  cp = cp == p1 ? p2 : p1
  loop()
  if (mode == 1) {
    round()
  }
}

function invis(boo, ar1, ar2) {
  ar1.forEach((id) => {
    let el = document.getElementById(id)
    if (el) {
      if (boo) {
        el.classList.add('invis')
      } else {
        el.classList.remove('invis')
      }
    }
  })

  ar2.forEach((id) => {
    let el = document.getElementById(id)
    if (el) {
      if (!boo) {
        el.classList.add('disabled')
      } else {
        el.classList.remove('disabled')
      }
    }
  })
}

// horní axis
function setField(x, y, type, elem) {
  let el
  if (!elem) {
    el = document.getElementById('game-' + x + y)
  }
  if (type == 0) {
    el.src = document.location.origin + '/assets/img/O.png'
    return
  } else if (type == 1) {
    el.src = document.location.origin + '/assets/img/X.png'
    return
  } else if (type == null) {
    el.src = document.location.origin + '/assets/img/blank.png'
    return
  } else if (type == 2) {
    el.src = document.location.origin + '/assets/img/O-colored.png'
    return
  } else if (type == 3) {
    el.src = document.location.origin + '/assets/img/X-colored.png'
    return
  }
}

function difficultySet(el) {
  if (
    el.id == 'game-btn-dif-easy' ||
    el.id == 'game-btn-dif-medium' ||
    el.id == 'game-btn-dif-hard'
  ) {
    invis(
      true,
      [],
      ['game-btn-dif-easy', 'game-btn-dif-medium', 'game-btn-dif-hard'],
    )
    if (el.id == 'game-btn-dif-easy') {
      invis(false, [], ['game-btn-dif-easy'])
      difficulty = 0
    } else if (el.id == 'game-btn-dif-medium') {
      invis(false, [], ['game-btn-dif-medium'])
      difficulty = 1
    } else if (el.id == 'game-btn-dif-hard') {
      invis(false, [], ['game-btn-dif-hard'])
      difficulty = 2
    }
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
