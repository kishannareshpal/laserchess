# Laser Algebraic Notation (for Laser Chess)
There exists no official notation for the board locations and the moves in Laser Chess, so we will introduce an unofficial notation that will be used in this game. We will call our notation **Laser Algebraic Notation**, basing on the officialy [FIDE recognized **Algebraic Notation** system for chess](https://www.fide.com/FIDE/handbook/LawsOfChess.pdf).

| | Column *a* | Column *b* | Column *c* | Column *d* | Column *e* | Column *f* | Column *g* | Column *h* | Column *i* | Column *j* |
| ----- | -------------------------------- | ---------------------------------- | ---------------------------- | ---------------------------- | ---------------------------- | ---------------------------- | ---------------------------- | ---------------------------- | -------------------------------- | ---------------------------------- |
| **8** | <img src="images/pieces/red_L_r1.png" width=""/>  | ![](images/pieces/blue_helix.png)  | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/red_helix.png) | ![](images/pieces/blue_helix.png) |
| **7** | ![](images/pieces/red_helix.png) | ![](images/pieces/blank.png)       | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png)     | ![](images/pieces/blue_helix.png) |
| **6** | ![](images/pieces/red_helix.png) | ![](images/pieces/blank.png)       | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png)     | ![](images/pieces/blue_helix.png) |
| **5** | ![](images/pieces/red_helix.png) | ![](images/pieces/blank.png)       | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png)     | ![](images/pieces/blue_helix.png) |
| **4** | ![](images/pieces/red_helix.png) | ![](images/pieces/blank.png)       | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png)     | ![](images/pieces/blue_helix.png) |
| **3** | ![](images/pieces/red_helix.png) | ![](images/pieces/blank.png)       | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png)     | ![](images/pieces/blue_helix.png) |
| **2** | ![](images/pieces/red_helix.png) | ![](images/pieces/blank.png)       | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png)     | ![](images/pieces/blue_helix.png) |
| **1** | ![](images/pieces/red_helix.png) | ![](images/pieces/blue_helix.png)  | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/red_helix.png) | ![](images/pieces/blue_L.png)      |

## Locations
For the indication of a location in the board, a notation is used that is similar to chess. 
The columns are denoted by a letter, `a` to `j` from left to right, and the rows by a number, `1` to `8` from bottom to top (Blue player's point of view).
In the notation, first the column letter is given and then the row number. This means that the bottom left corner of the board is denoted by `a1` and the upper right corner by `j8`.

## Pieces
Each piece, is identified by an uppercase letter.
The identification is the first letter of the piece name, except for the Deflector which is B (because D for Deflector would be confused with the one of the Defender.

| Name      | Identification |
| --------- | -------------- |
| King      | K              |
| Switch    | S              |
| Defender  | D              |
| Deflector | B              |
| Laser     | L              |

> *The letter B came to be from the word Bend – bending the light*).


## Players
There are only two (2) players per game.
1. Blue player
2. Red player


## Moves
When moving a piece, the location of the piece to move and the target location are written down.
For instance, moving the deflector from `j4` to `j3` is denoted as `j4j3`.
- Laser is not a movable piece (see Game Rules) hence no moves, by any pieces, are allowed on the squares *j1* and *a8*.
### Rotation
For denoting the rotation of a piece, the location of the piece to rotate is written, followed by either `r+` indicating a clockwise-rotation, or `r-`, indicating a counter-clockwise rotation.
So, rotating the deflector on `h2` clockwise is denoted as `h2r+`.

### Captures
If a piece is captured, the move notation will be appended by an `x` and the location of the captured piece. For example, if the piece at `g3` is captured after the move `j4j3`, this is written down as `j4j3xg3`.


## Setup
Read [`📄 Setup Notation.md`](SetupNotation.md)

## Bibliography / Reference List
**[Nijssen, J.A.M., (2019). Using Intelligent Search Techniques to Play The Game KHET. Master thesis, Maastricht University.](https://dke.maastrichtuniversity.nl/pim.nijssen/pub/msc.pdf)**