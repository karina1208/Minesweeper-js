document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let width = 10
    let height = 10
    let bombAmount = 20
    let flags = 0
    let squares = []
    let isGameOver = false

    flagCount.innerHTML = '<span style="font-size: 20px;">🏳️</span>:' + bombAmount

    //count time
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
    //end of count time

    //create Board
    function createBoard() {
        startTimeFunction()
            //print flagcount
        flagCount.innerHTML = '<span style="font-size: 20px;">🏳️</span>:' + bombAmount
        grid.innerHTML = ''
        squares = []

        console.log(width, height, bombAmount)
            //get shuffled game array with random bombs
        const bombsArray = Array(bombAmount).fill('bomb')
        const emptyArray = Array(width * height - bombAmount).fill('valid')
        const gameArray = emptyArray.concat(bombsArray)
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5)

        for (let i = 0; i < width * height; i++) {
            const square = document.createElement('div')
            square.setAttribute('id', i)
            square.classList.add(shuffledArray[i])
            square.classList.add('ori')
            grid.appendChild(square)
            squares.push(square)

            // normal click
            square.addEventListener('click', function(e) {
                click(square)
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
            const isRightEdge = i % width === width - 1 // ends with 9

            if (squares[i].classList.contains('valid')) {
                //check←
                if (!isLeftEdge && squares[i - 1].classList.contains('bomb')) total++;
                //check↗
                if (i > width - 1 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++;
                //check↑
                if (i > width - 1 && squares[i - width].classList.contains('bomb')) total++;
                //check↖
                if (i > width && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) total++;
                //check↙
                if (i < width * height - width && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++;
                //check↘
                if (i < width * height - width && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++;
                //check↓
                if (i < width * height - width && squares[i + width].classList.contains('bomb')) total++;
                //check→
                if (!isRightEdge && squares[i + 1].classList.contains('bomb')) total++;

                squares[i].setAttribute('data', total)

                //console.log(squares[i].id)
            }

        }
        //console.log(squares.length)


    }

    //initial 
    createBoard()

    easy.addEventListener('click', function(e) {
        if (isGameOver) return

        width = 10
        height = 10
        bombAmount = 20
        grid.classList.remove('gridMedium')
        grid.classList.add('gridEasy')
        grid.classList.remove('gridHard')
        myStopFunction()
        createBoard()
    })

    medium.addEventListener('click', function(e) {
        if (isGameOver) return

        width = 14
        height = 14
        bombAmount = 25
        grid.classList.remove('gridEasy')
        grid.classList.remove('gridHard')
        grid.classList.add('gridMedium')
        myStopFunction()
        createBoard()
    })

    hard.addEventListener('click', function(e) {
        if (isGameOver) return

        width = 28
        height = 14
        bombAmount = 50
        grid.classList.remove('gridEasy')
        grid.classList.remove('gridMedium')
        grid.classList.add('gridHard')
        myStopFunction()
        createBoard()
    })

    //flag
    function addFlag(square) {
        if (isGameOver) return

        if (!square.classList.contains('checked') && flags < bombAmount) {
            if (!square.classList.contains('flag')) {
                square.classList.add('flag')
                square.innerHTML = '🏳️‍'
                flags++
                flagCount.innerHTML = '<span style="font-size: 20px;">🏳️</span>:' + (bombAmount - flags)
                checkForWin()
            } else {
                square.classList.remove('flag')
                square.innerHTML = ''
                flags--
                flagCount.innerHTML = '<span style="font-size: 20px;">🏳️</span>:' + (bombAmount - flags)
            }

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
        const isLeftEdge = (currentId % width === 0)
        const isRightEdge = (currentId % width === width - 1)

        setTimeout(() => {
            //check←
            if (!isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            //check↗
            if (currentId > width - 1 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 - width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            //check↑
            if (currentId > width - 1) {
                const newId = squares[parseInt(currentId) - width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            //check→
            if (!isRightEdge) {
                const newId = squares[parseInt(currentId) + 1].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            //check↓
            if (currentId < width * height - width && !isRightEdge) {
                const newId = squares[parseInt(currentId) + width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            //check↖
            if (currentId > width && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 - width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            //check↙
            if (currentId < width * height - width && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 + width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            //check↘
            if (currentId < width * height - width && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 + width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }

        }, 10)
    }

    function gameOver(square) {
        console.log('bye')
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
        footer.innerHTML = '<button class="button" id="game" type="submit" onclick="location.reload();">New Game</button>'
    }

    //check for win
    function checkForWin() {
        let matches = 0
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains('flag') && squares[i].classList.contains('flag')) {
                matches++
            }
            if (matches === bombAmount) {
                isGameOver = true
                myStopFunction()
                header.innerHTML = 'You win:)'
                footer.innerHTML = '<button class="button" id="game" type="submit" onclick="location.reload();">New Game</button>'
            }
        }
    }

})