# Algebraic Notation (AN)

There exists no official notation for the board locations and the moves in Laser Chess, so we will introduce an unofficial notation that will be used in this game and is very much based on the [chess's officialy FIDE recognized **Algebraic Notation** system](https://www.fide.com/FIDE/handbook/LawsOfChess.pdf).

|       | Column _a_                                                | Column _b_                                                  | Column _c_                                  | Column _d_                                  | Column _e_                                  | Column _f_                                  | Column _g_                                  | Column _h_                                  | Column _i_                                                | Column _j_                                                  |
| ----- | --------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------- | ------------------------------------------- | ------------------------------------------- | ------------------------------------------- | ------------------------------------------- | ------------------------------------------- | --------------------------------------------------------- | ----------------------------------------------------------- |
| **8** | ![Red Laser Cell](images/pieces/red_laser_cell.png)       | ![Blue Reserved Cell](images/pieces/blue_reserved_cell.png) | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png) | ![Red Reserved Cell](images/pieces/red_reserved_cell.png) | ![Blue Reserved Cell](images/pieces/blue_reserved_cell.png) |
| **7** | ![Red Reserved Cell](images/pieces/red_reserved_cell.png) | ![Blank Cell](images/pieces/blank_cell.png)                 | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png)               | ![Blue Reserved Cell](images/pieces/blue_reserved_cell.png) |
| **6** | ![Red Reserved Cell](images/pieces/red_reserved_cell.png) | ![Blank Cell](images/pieces/blank_cell.png)                 | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png)               | ![Blue Reserved Cell](images/pieces/blue_reserved_cell.png) |
| **5** | ![Red Reserved Cell](images/pieces/red_reserved_cell.png) | ![Blank Cell](images/pieces/blank_cell.png)                 | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png)               | ![Blue Reserved Cell](images/pieces/blue_reserved_cell.png) |
| **4** | ![Red Reserved Cell](images/pieces/red_reserved_cell.png) | ![Blank Cell](images/pieces/blank_cell.png)                 | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png)               | ![Blue Reserved Cell](images/pieces/blue_reserved_cell.png) |
| **3** | ![Red Reserved Cell](images/pieces/red_reserved_cell.png) | ![Blank Cell](images/pieces/blank_cell.png)                 | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png)               | ![Blue Reserved Cell](images/pieces/blue_reserved_cell.png) |
| **2** | ![Red Reserved Cell](images/pieces/red_reserved_cell.png) | ![Blank Cell](images/pieces/blank_cell.png)                 | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png)               | ![Blue Reserved Cell](images/pieces/blue_reserved_cell.png) |
| **1** | ![Red Reserved Cell](images/pieces/red_reserved_cell.png) | ![Blue Reserved Cell](images/pieces/blue_reserved_cell.png) | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png) | ![Blank Cell](images/pieces/blank_cell.png) | ![Red Reserved Cell](images/pieces/red_reserved_cell.png) | ![Blue Laser Cell](images/pieces/blue_laser_cell.png)       |

## Locations

For the indication of a location in the board, a notation is used that is similar to chess.
The columns are denoted by a letter, `a` to `j` from left to right, and the rows by a number, `1` to `8` from bottom to top (Blue player's point of view).
In the notation, first the column letter is given and then the row number. This means that the bottom left corner of the board is denoted by `a1` and the upper right corner by `j8`.

## Pieces

Each piece, is identified by an uppercase letter.
The identification is the first letter of the piece name, except for the Deflector which is B (because D for Deflector would be confused with the one of the Defender.

| Name      | Identification |
| --------- | -------------- |
| King      | k              |
| Switch    | s              |
| Defender  | d              |
| Deflector | b              |
| Laser     | l              |

Read [`📄 Guide.md`](Guide.md#pieces) to learn more about the pieces.

> _The b of the deflector originates from the word Bend – bending the light_).

## Players

There are only two (2) players per game.

1. Blue player
2. Red player

## Movement

### Move

When moving a piece, the location of the piece to move and the target location are written down.
For instance, moving the deflector from `j4` to `j3` is denoted as `j4j3`.

-   Laser is not a movable piece (see Game Rules) hence no moves, by any pieces, are allowed on the squares _j1_ and _a8_.

### Special Move

For denoting a [special move](Guide.md#special-move), the letter `u` is added between the piece location and the target location.
For example, making a swap between a Switch at location `f4` with a Deflector at `g3` is denoted as `f4ug3`.

### Rotation

For denoting the rotation of a piece, the location of the piece to rotate is written, followed by either `+` indicating a clockwise-rotation, or `-`, indicating a counter-clockwise rotation.
So, rotating the deflector on `h2` clockwise is denoted as `h2+`.

### Captures

If a piece is captured, the move notation will be appended by an `x` and the location of the captured piece. For example, if the piece at `g3` is captured after the move `j4j3`, this is written down as `j4j3xg3`.

## Setup

Read [`📄 Setup Notation.md`](SetupNotation.md)

## Bibliography / Reference List

**[Nijssen, J.A.M., (2019). Using Intelligent Search Techniques to Play The Game KHET. Master thesis, Maastricht University.](https://dke.maastrichtuniversity.nl/pim.nijssen/pub/msc.pdf)**
