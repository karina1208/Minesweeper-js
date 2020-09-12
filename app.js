document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let width = 10
    let height = 10
    let bombAmount = 20
    let flags = 0
    let squares = []
    let isGameOver = false



    // -- count time -- //
    let finish = false
    let sec = 0
    let inter

    function pad(val) {
        return val > 9 ? val : "0" + val
    }

    function startTimeFunction() {
        sec = 0
        document.getElementById("seconds").innerHTML = '00'
        document.getElementById("minutes").innerHTML = '00'
        inter = setInterval(function() {
            document.getElementById("seconds").innerHTML = pad(++sec % 60)
            document.getElementById("minutes").innerHTML = pad(parseInt(sec / 60, 10))
        }, 1000)
    }

    function myStopFunction() {
        clearInterval(inter)
    }
    // -- end of count time -- //

    // -- create Board -- //
    function createBoard() {
        //default
        document.getElementById('header').innerHTML = 'Minesweeper'
        document.getElementById('game').style.visibility = 'hidden'
        startTimeFunction()

        //print flagcount
        flagCount.innerHTML = '<span style="font-size: 20px;">🏳️</span>:' + bombAmount
        grid.innerHTML = ''
        squares = []

        //get shuffled game array with random bombs
        const bombsArray = Array(bombAmount).fill('bomb')
        const emptyArray = Array(width * height - bombAmount).fill('valid')
        const gameArray = emptyArray.concat(bombsArray)
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5)

        for (let i = 0; i < shuffledArray.length; i++) {
            const square = document.createElement('div')
            square.setAttribute('id', i)
            square.classList.add(shuffledArray[i])
            square.classList.add('ori')
            grid.appendChild(square)
            squares.push(square)

            square.addEventListener('mousedown', function(e) {
                switch (e.button) {
                    case 1:
                        console.log("mousedown")
                        middleClickChange(square, "down")
                        checkCell('flag', square)
                        break;
                }
            })

            //click
            square.addEventListener('mouseup', function(e) {
                console.log(e.button);
                switch (e.button) {
                    case 0: //normal click
                        click(square)
                        break;
                    case 1: //middle click
                        e.preventDefault()
                        middleClickChange(square, "up")
                        break;
                }
            })

            //right click
            square.oncontextmenu = function(e) {
                e.preventDefault()
                addFlag(square)
            }
        }

        //add numbers
        for (let i = 0; i < squares.length; i++) {
            let total = 0
            const isLeftEdge = i % width === 0
            const isRightEdge = i % width === width - 1

            if (squares[i].classList.contains('valid')) {
                checkCell('bomb', squares[i])
            }
        }
    }

    function checkCell(condition, square) {

        let i = parseInt(square.id)
        let total = 0
        const isLeftEdge = i % width === 0
        const isRightEdge = i % width === width - 1


        //check←
        if (!isLeftEdge && squares[i - 1].classList.contains(condition)) total++;
        //check↗
        if (i > width - 1 && !isRightEdge && squares[i + 1 - width].classList.contains(condition)) total++;
        //check↑
        if (i > width - 1 && squares[i - width].classList.contains(condition)) total++;
        //check↖
        if (i > width && !isLeftEdge && squares[i - 1 - width].classList.contains(condition)) total++;
        //check↙
        if (i < width * height - width && !isLeftEdge && squares[i - 1 + width].classList.contains(condition)) total++;
        //check↘
        if (i < width * height - width && !isRightEdge && squares[i + 1 + width].classList.contains(condition)) total++;
        //check↓
        if (i < width * height - width && squares[i + width].classList.contains(condition)) total++;
        //check→
        if (!isRightEdge && squares[i + 1].classList.contains(condition)) total++;

        if (condition == 'bomb') square.setAttribute('data', total)
        if (condition == 'flag' && square.classList.contains('checked')) {
            let flagNum = parseInt(square.getAttribute('data'))

            //only click other cell with the flag number match with data
            if (total === flagNum) {
                checkSquare(square, i)
            }
        }
    }

    function middleClickChange(square, action) {
        let currentId = parseInt(square.id)

        if (square.classList.contains('checked')) {
            const isLeftEdge = (currentId % width === 0)
            const isRightEdge = (currentId % width === width - 1)
            const neiCellId = []

            //check←
            if (!isLeftEdge) {
                const newId = squares[currentId - 1].id
                neiCellId.push(newId)
            }
            //check↗
            if (currentId > width - 1 && !isRightEdge) {
                const newId = squares[currentId + 1 - width].id
                neiCellId.push(newId)
            }
            //check↑
            if (currentId > width - 1) {
                const newId = squares[currentId - width].id
                neiCellId.push(newId)
            }
            //check→
            if (!isRightEdge) {
                const newId = squares[currentId + 1].id
                neiCellId.push(newId)
            }
            //check↓
            if (currentId < width * height - width && !isRightEdge) {
                const newId = squares[currentId + width].id
                neiCellId.push(newId)
            }
            //check↖
            if (currentId > width && !isLeftEdge) {
                const newId = squares[currentId - 1 - width].id
                neiCellId.push(newId)
            }
            //check↙
            if (currentId < width * height - width && !isLeftEdge) {
                const newId = squares[currentId - 1 + width].id
                neiCellId.push(newId)
            }
            //check↘
            if (currentId < width * height - width && !isRightEdge) {
                const newId = squares[currentId + 1 + width].id
                neiCellId.push(newId)
            }

            for (let i = 0; i < neiCellId.length; i++) {
                let dd = document.getElementById(parseInt(neiCellId[i]))
                if (action == 'down') dd.classList.add('oriMid')
                if (action == 'up') dd.classList.remove('oriMid')
            }
        }
    }

    // -- initial  -- //
    createBoard()

    function levelSetter(w, h, b) {
        myStopFunction()
        width = w
        height = h
        bombAmount = b
        flags = 0
        createBoard()
    }

    easy.addEventListener('click', function(e) {
        if (isGameOver) return

        grid.classList.remove('gridMedium')
        grid.classList.add('gridEasy')
        grid.classList.remove('gridHard')
        levelSetter(10, 10, 20)

    })

    medium.addEventListener('click', function(e) {
        if (isGameOver) return


        grid.classList.remove('gridEasy')
        grid.classList.remove('gridHard')
        grid.classList.add('gridMedium')
        levelSetter(14, 14, 30)

    })

    hard.addEventListener('click', function(e) {
        if (isGameOver) return


        grid.classList.remove('gridEasy')
        grid.classList.remove('gridMedium')
        grid.classList.add('gridHard')
        levelSetter(28, 14, 70)

    })

    // -- flag -- //
    function addFlag(square) {
        if (isGameOver) return

        if (!square.classList.contains('checked') && flags < bombAmount) {
            if (!square.classList.contains('flag')) {
                square.classList.add('flag')
                square.innerHTML = '🏳️‍'
                flags++
                checkForWin()
            } else {
                square.classList.remove('flag')
                square.innerHTML = ''
                flags--
            }
            flagCount.innerHTML = '<span style="font-size: 20px;">🏳️</span>:' + (bombAmount - flags)
        }
    }

    //click on square actions
    function click(square) {
        let currentId = square.id
        if (isGameOver) return
        if (square.classList.contains('checked') || square.classList.contains('flag')) return
        if (square.classList.contains('bomb')) {
            gameOver(square)
        } else {
            let total = square.getAttribute('data')
            let colors = ['#22a0b6', '#70849e', '#5354aa', '#905fbe', '#793c6c', '#cb0c59', '#cc6153', '#e48233']
            if (total != 0) {
                square.classList.add('checked')
                square.style.color = colors[total - 1]
                square.innerHTML = total
                return
            }
            checkSquare(square, currentId)

        }
        square.classList.add('checked')
    }

    //check neighbour squares
    function checkSquare(square, currentId) {
        currentId = parseInt(currentId)
        const isLeftEdge = (currentId % width === 0)
        const isRightEdge = (currentId % width === width - 1)
        const newSquares = []


        setTimeout(() => {
            //check←
            if (!isLeftEdge) {
                const newId = squares[currentId - 1].id
                newSquares.push(document.getElementById(newId))
            }
            //check↗
            if (currentId > width - 1 && !isRightEdge) {
                const newId = squares[currentId + 1 - width].id
                newSquares.push(document.getElementById(newId))
            }
            //check↑
            if (currentId > width - 1) {
                const newId = squares[currentId - width].id
                newSquares.push(document.getElementById(newId))
            }
            //check→
            if (!isRightEdge) {
                const newId = squares[currentId + 1].id
                newSquares.push(document.getElementById(newId))
            }
            //check↓
            if (currentId < width * height - width && !isRightEdge) {
                const newId = squares[currentId + width].id
                newSquares.push(document.getElementById(newId))
            }
            //check↖
            if (currentId > width && !isLeftEdge) {
                const newId = squares[currentId - 1 - width].id
                newSquares.push(document.getElementById(newId))
            }
            //check↙
            if (currentId < width * height - width && !isLeftEdge) {
                const newId = squares[currentId - 1 + width].id
                newSquares.push(document.getElementById(newId))
            }
            //check↘
            if (currentId < width * height - width && !isRightEdge) {
                const newId = squares[currentId + 1 + width].id
                newSquares.push(document.getElementById(newId))
            }
            newSquares.forEach(item => click(item))
        }, 10)
    }

    function gameOver(square) {
        isGameOver = true

        //show all
        squares.forEach(square => {
            if (square.classList.contains('bomb')) {
                square.innerHTML = '💣'
                square.classList.add('bombAfter')
            }
        })
        myStopFunction()
        header.innerHTML = 'Game Over:('
        game.style.visibility = 'visible'
    }

    //start new game
    game.addEventListener('click', function(e) {
        //function newGame() {
        isGameOver = false
        if (grid.classList.contains('gridEasy')) {
            easy.click()
        } else if (grid.classList.contains('gridMedium')) {
            console.log("game medium")
            medium.click()
        } else if (grid.classList.contains('gridHard')) {
            hard.click()
        }
    })

    //check for win
    function checkForWin() {
        let matches = 0
        squares.forEach(square => {
            if (square.classList.contains('flag') && square.classList.contains('flag')) {
                matches++
            }
            if (matches === bombAmount) {
                isGameOver = true
                myStopFunction()
                header.innerHTML = 'You win:)'
                game.style.visibility = 'visible'
            }
        })
    }
})