class Solver {
    constructor() {
        this.initialBoard = []
        this.faceInitialPos
        for (i = 0; i < 16; i+=1) {
            if (myArray[i].innerHTML == ":)" || myArray[i].innerHTML == ":(") {
                this.initialBoard.push(16)
                this.faceInitialPos = i
            } else {
                this.initialBoard.push(parseInt(myArray[i].innerHTML))
            }
        }
    }

    findMinSteps() {    
        const myPQ = new PQ()

        const inPQ = {}
        const marked = {}

        var firstNode = new Node(this.initialBoard, null, [this.faceInitialPos, this.faceInitialPos], 0)
        myPQ.add(firstNode)
        
        inPQ[firstNode.board] = firstNode.numSteps

        while (!myPQ.isEmpty()) {
            var currNode = myPQ.remove()

            delete inPQ[currNode.board]
            marked[currNode.board] = currNode.numSteps

            if (currNode.isGoal()) {
                optimalPath = currNode
                return currNode.numSteps
            }

            var smileyPos = currNode.recentMove[1]

            if (smileyPos % 4 > 0) {
                move(currNode, smileyPos, myPQ, inPQ, marked, -1)
            }
            if (smileyPos % 4 < 3) {
                move(currNode, smileyPos, myPQ, inPQ, marked, 1)
            }
            if (Math.floor(smileyPos / 4) > 0) {
                move(currNode, smileyPos, myPQ, inPQ, marked, -4)
            }
            if (Math.floor(smileyPos / 4) < 3) {
                move(currNode, smileyPos, myPQ, inPQ, marked, 4)
            }
        }
    }
}

function move(currNode, smileyPos, myPQ, inPQ, marked, direction) {
    if (currNode.recentMove[0] != smileyPos + direction) {
        var newBoard = currNode.board.slice()
        swap(newBoard, smileyPos, smileyPos + direction)
        var newNode = new Node(newBoard, currNode, [smileyPos, smileyPos + direction], currNode.numSteps + 1)
        var hexString = hexHelper(newNode.board)
        if (marked.hasOwnProperty(hexString)) {
            if (inPQ.hasOwnProperty(hexString)) {
                if (newNode.numSteps < inPQ[hexString]) {
                    myPQ.add(newNode)
                    inPQ[hexString] = newNode.numSteps
                }
            } else if (newNode.numSteps < marked[hexString]) {
                myPQ.add(newNode)
                inPQ[hexString] = newNode.numSteps
            }
        } else if (inPQ.hasOwnProperty(hexString)) {
            if (newNode.numSteps < inPQ[hexString]) {
                myPQ.add(newNode)
                inPQ[hexString] = newNode.numSteps
            }
        } else {
            myPQ.add(newNode)
                inPQ[hexString] = newNode.numSteps
        }
    }
}


const hexDict = {1: "0", 2: "1", 3: "2", 4: "3", 5: "4", 6: "5", 7: "6", 8: "7", 9: "8", 10: "9",
11: "A", 12: "B", 13: "C", 14: "D", 15: "E", 16: "F"}

function hexHelper(board) {
    var myString = ""
    for (i = 0; i < 16; i ++) {
        myString = myString + hexDict[board[i]]
    }
    return myString
}

function AStarHelper(board) {
    var total = 0
    for (i = 1; i <= 16; i++) {
        if (board[i-1] != i) {
            total += Math.abs(Math.floor((board[i-1] - 1) / 4) - Math.floor((i-1) / 4))
            total += Math.abs((board[i-1] - 1) % 4 - (i-1) % 4)
        }
    }
    return total
}

class PQ {
    constructor() {
        this.queue = [null]
        this.pos = 1
        this.maxSize = 1
    }

    add(num) {
        if (this.pos >= this.maxSize) {
            this.queue.push(num)
            this.swim(this.pos)
            this.pos += 1
            this.maxSize += 1
        } else {
            this.queue[this.pos] = num
            this.swim(this.pos)
            this.pos += 1
        }
    }

    remove() {
        if (this.pos == 1) {
            return
        }
        this.pos -= 1
        var value = this.queue[1]
        swap(this.queue, 1, this.pos)
        this.sink(1)
        return value
    }

    swim(pos) {
        if (pos <= 1) {
            return
        }
        var prevPos = Math.floor(pos / 2)
        if (this.queue[prevPos].compareTo(this.queue[pos]) == 1) {
            swap(this.queue, pos, prevPos)
            this.swim(prevPos)
        }
    }

    sink(pos) {
        var left = pos * 2
        var right = pos * 2 + 1
        if (this.pos <= left) {
            return
        }
        if (this.pos == right) {
            if (this.queue[pos].compareTo(this.queue[left]) == 1) {
                swap(this.queue, pos, left)
            }
            return
        }
        

        var min
        if (this.queue[left].compareTo(this.queue[right]) == 1) {
            min = right
        } else {
            min = left
        }

        if (this.queue[pos].compareTo(this.queue[min]) == 1) {
            swap(this.queue, pos, min)
            this.sink(min)
        }
    }

    isEmpty() {
        if (this.pos == 1) {
            return true
        }
        return false
    }
}

class Node {
    constructor(board, prevNode, recentMove, numSteps) {
        this.board = board
        this.prevNode = prevNode
        this.recentMove = recentMove
        this.numSteps = numSteps
        this.priority = numSteps + AStarHelper(board)
    }

    isGoal() {
        for (i = 0; i < 16; i++) {
            if (this.board[i] != i+1) {
                return false
            }
        }
        return true
    }

    compareTo(Node) {
        if (this.priority > Node.priority) {
            return 1
        } else if (this.priority < Node.priority) {
            return -1
        }
        return 0
    }
}


const numSteps = document.querySelector('[num-steps]');
var steps = 0;
const optimalNumSteps = document.querySelector('[optimal-num-steps]');
const randomize = document.querySelector('[randomize]');
const solutionSteps = document.querySelector('[solution]');
var optimalPath = null
var notFreePlay = false
const myArray = [document.querySelector('[a11]'), document.querySelector('[a12]'), 
document.querySelector('[a13]'), document.querySelector('[a14]'), 
document.querySelector('[a21]'), document.querySelector('[a22]'),
document.querySelector('[a23]'), document.querySelector('[a24]'),
document.querySelector('[a31]'), document.querySelector('[a32]'),
document.querySelector('[a33]'), document.querySelector('[a34]'),
document.querySelector('[a41]'), document.querySelector('[a42]'),
document.querySelector('[a43]'), document.querySelector('[a44]')]
const funcs = []
for (i = 0; i < 16; i+=1) {
    funcs.push(tryMove(i))
    myArray[i].addEventListener("click", funcs[i])
}

function tryMove(i) {
    //fix counter
    function whenCalled() {
        if (i % 4 > 0) {
            if (domove(i, -1)) {
                return
            }
        }
        if (i % 4 < 3) {
            if (domove(i, 1)) {
                return
            }
        }
        if (Math.floor(i / 4) > 0) {
            if (domove(i, -4)) {
                return
            }
        }
        if (Math.floor(i / 4) < 3) {
            if (domove(i, 4)) {
                return
            }
        }
    }
    return whenCalled
}

function domove(i, displacement) {
    if (myArray[i+displacement].innerHTML == ":(" || myArray[i+displacement].innerHTML == ":)"
            || myArray[i+displacement].innerHTML == ":D") {
        swapContents(i, i+displacement)
        if (notFreePlay) {
            updateStepCount()
            trySwapFace(i)
        }
        if (notFreePlay && goalReached()) {
            notFreePlay = false
            myArray[15].innerHTML = ":D"
            solutionSteps.innerHTML = "You Won! Our Solution Here"
        }
        return true
    }
    return false
}

function goalReached() {
    for (i = 0; i < 15; i += 1) {
        if (myArray[i].innerHTML != (i+1).toString()) {
            return false
        }
    }
    return true
}

function swapContents(i, j) {
    var temp = myArray[i].innerHTML
    myArray[i].innerHTML = myArray[j].innerHTML 
    myArray[j].innerHTML = temp
    if (myArray[j].classList.length == 1) {
        if (myArray[i].classList.length == 0) {
            myArray[i].classList.add("red-bg")
            myArray[j].classList.remove("red-bg")
        }
    } else {
        if (myArray[i].classList.length == 1) {
            myArray[i].classList.remove("red-bg")
            myArray[j].classList.add("red-bg")
        }
    }
}

function updateStepCount() {
    steps += 1
    numSteps.innerHTML = "#Steps Taken: " + steps.toString()
}

function trySwapFace(i) {
    if (i == 15) {
        myArray[i].innerHTML = ":)"
    } else {
        myArray[i].innerHTML = ":("
    }
}

randomize.addEventListener("click", randomFunc)

function randomFunc() {
    // for fully random board(some unsolvable)
    /*var numArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    for (i = 0; i < 16; i+=1) {
        randomNum = getRandomInt(i, 16)
        myArray[i].innerHTML = numArray[randomNum]
        swap(numArray, i, randomNum)
        if (myArray[i].innerHTML == 16) {
            if (i == 15) {
                myArray[i].innerHTML = ":)"
            } else {
                myArray[i].innerHTML = ":("
            }
        }
    }*/

    
    notFreePlay = true
    for (i = 0; i < 16; i+=1) { 
        myArray[i].addEventListener("click", funcs[i])
    }

    solutionSteps.innerHTML = "Show Solution"
    solutionSteps.addEventListener("click", showSol)

    const isRedMap = {1: false, 2: true, 3: false, 4: true, 5: true, 6: false, 7: true, 8: false, 
        9: false, 10: true, 11: false, 12: true, 13: true, 14: false, 15: true, 16: false}

    for (i = 0; i < 16; i+=1) {
        myArray[i].innerHTML = i+1
        if (!isRedMap[i+1]) {
            if (myArray[i].classList.length == 1) {
                myArray[i].classList.remove("red-bg")
            }
        } else {
            if (myArray[i].classList.length == 0) {
                myArray[i].classList.add("red-bg")
            }
        }
    }

    var newPos = 15
    for (i = 0; i < 80; i += 1) { //This puzzle takes 80 move at most to solve
        newPos = doRandomMove(newPos)
    }

    if (newPos == 15) {
        myArray[newPos].innerHTML = ":)"
    } else {
        myArray[newPos].innerHTML = ":("
    }

    steps = 0
    numSteps.innerHTML = "#Steps Taken: " + steps.toString()
    solver = new Solver()
    optimalNumSteps.innerHTML = "Optimal #Steps: " + solver.findMinSteps()
}

function doRandomMove(smileyPos) {
    while (true) {
        randInt = getRandomInt(0, 4)
        if (randInt == 0) {
            if (smileyPos % 4 > 0) {
                swapContents(smileyPos, smileyPos - 1)
                return smileyPos-1
            }
        }
        if (randInt == 1) {
            if (smileyPos % 4 < 3) {
                swapContents(smileyPos, smileyPos + 1)
                return smileyPos+1
            }
        }
        if (randInt == 2) {
            if (Math.floor(smileyPos / 4) > 0) {
                swapContents(smileyPos, smileyPos - 4)
                return smileyPos-4
            }
        }
        if (randInt == 3) {
            if (Math.floor(smileyPos / 4) < 3) {
                swapContents(smileyPos, smileyPos + 4)
                return smileyPos+4
            }
        }
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}  

function swap(myArray, i, j) {
    var temp = myArray[i]
    myArray[i] = myArray[j]
    myArray[j] = temp
}

function showSol() {
    if (optimalPath == null) {
        return
    }

    solutionSteps.removeEventListener("click", showSol)
    solutionSteps.addEventListener("click", step)
    for (i = 0; i < 16; i+=1) {
        myArray[i].removeEventListener("click", funcs[i])
    }

    stack = []
    myOptimalPath = optimalPath
    while (myOptimalPath.prevNode != null) {
        stack.push(myOptimalPath.recentMove)
        myOptimalPath = myOptimalPath.prevNode
    }
    const isRedMap = {1: false, 2: true, 3: false, 4: true, 5: true, 6: false, 7: true, 8: false, 
        9: false, 10: true, 11: false, 12: true, 13: true, 14: false, 15: true, 16: false}
    for (i = 0; i < 16; i+=1) {
        if (myOptimalPath.board[i] == 16) {
            trySwapFace(i)
        } else {
            myArray[i].innerHTML = myOptimalPath.board[i]
        }
        if (isRedMap[(myOptimalPath.board[i])]) {
            if (myArray[i].classList.length == 0) {
                myArray[i].classList.add("red-bg")
            }
        } else {
            if (myArray[i].classList.length == 1) {
                myArray[i].classList.remove("red-bg")
            }
        }
    }

    i = stack.length-1
    function step() {
        swapContents(stack[i][0], stack[i][1])
        trySwapFace(stack[i][1])
        i -= 1
        if (i == -1) {
            solutionSteps.removeEventListener("click", step)
            solutionSteps.innerHTML = "Solved!"
        }
    }
}
