# 15-Puzzle

## Description:
The 15-puzzle consists of a 4x4 grid where the goal is to get numbers 1-15 in order and have the bottom right space open (in this version, the blank space is represented with an emoticon). To play this game, click a space adjacent to the tile with the emoticon to swap the two tiles. After hitting randomize, a solvable board will be created, and the number of steps taken to reach the goal will be recorded. The optimal path from the initial randomized board is calculated. At any time, the "Show Solution" button can be pressed. This will reset the board to the initial randomized board, and each subsequent time this button is clicked, an optimal move will be shown. After clicking this button, tiles cannot be moved without randomizing the board again.

## Demo:
![15 Puzzle Demo](https://user-images.githubusercontent.com/93054906/163493085-198c28eb-67d3-4ef8-b914-58c692e51b18.gif)

## How to run:
Clone this repository and navigate into the folder "15 Puzzle" through the command line. Run python -m http.server and open localhost:8000 on your browser.

## To do:
- Update A* heuristic.
- Test different data structures to optimize A* efficiency.
