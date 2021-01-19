# Game guide

Simple rules and only a few easy to learn moves make Laser Chess quick to play, yet so addictive and challanging at the same time.

### Objective

Be the first player to strike your opponent's King with a Laser.

### Players

Two players per game.

### Setup

1. Determine which player will use the Gray/Red pieces and which player will use the Blue/White pieces.

2. Select a board setup.

   

## Board

|       | a                                | b                                  | c                            | d                            | e                            | f                            | g                            | h                            | i                                | j                                  |
| ----- | -------------------------------- | ---------------------------------- | ---------------------------- | ---------------------------- | ---------------------------- | ---------------------------- | ---------------------------- | ---------------------------- | -------------------------------- | ---------------------------------- |
| **8** | ![](images/pieces/red_L_r1.png)  | ![](images/pieces/blue_helix.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/red_helix.png) | ![](images/pieces/blue_helix.png) |
| **7** | ![](images/pieces/red_helix.png) | ![](images/pieces/blank.png)       | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png)     | ![](images/pieces/blue_helix.png) |
| **6** | ![](images/pieces/red_helix.png) | ![](images/pieces/blank.png)       | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png)     | ![](images/pieces/blue_helix.png) |
| **5** | ![](images/pieces/red_helix.png) | ![](images/pieces/blank.png)       | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png)     | ![](images/pieces/blue_helix.png) |
| **4** | ![](images/pieces/red_helix.png) | ![](images/pieces/blank.png)       | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png)     | ![](images/pieces/blue_helix.png) |
| **3** | ![](images/pieces/red_helix.png) | ![](images/pieces/blank.png)       | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png)     | ![](images/pieces/blue_helix.png) |
| **2** | ![](images/pieces/red_helix.png) | ![](images/pieces/blank.png)       | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png)     | ![](images/pieces/blue_helix.png) |
| **1** | ![](images/pieces/red_helix.png) | ![](images/pieces/blue_helix.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/blank.png) | ![](images/pieces/red_helix.png) | ![](images/pieces/blue_L.png)      |



The board is divided into 80 identical [squares](Notation.md#Naming-the-squares) (*8 rows* and *10 columns*), of which:

- Two squares (*a8* and *j1*) are reserved for the Laser piece only. (No other piece can move into these space).

- Nine squares contains blue helix patterns and Red/Gray players are not allowed to move into it (but the Blue/White pieces can). And other nine more squares contains red helix patterns where Blue/White players are not allowed to move into it (but the Red/Gray pieces can).
  Located in the left and right edges of the board.

- 60 other squares are available for any piece color to move following the [Movement Rules](#movement-rules)

  

## Pieces

Each player has a 13 pieces, for a total of 26 pieces per game.
Each player has *1 King*, *2 Switches*, *2 Defenders*, *7 Deflectors* and *1 Laser*.

| Name      | Blue Player                   | Red Player                   | [Identification Letter](./Notation.md#Naming-the-piece) | Piece(s) per player | Can be eliminated?                                           |
| --------- | ----------------------------- | ---------------------------- | ------------------------------------------------------- | ------------------- | ------------------------------------------------------------ |
| Laser     | ![](images/pieces/blue_L.png) | ![](images/pieces/red_L.png) | L                                                       | 1                   | **No**                                                       |
| Deflector | ![](images/pieces/blue_B.png) | ![](images/pieces/red_B.png) | B                                                       | 7                   | **Yes** (if hit from the side or back where the mirror is not present) |
| Defender  | ![](images/pieces/blue_D.png) | ![](images/pieces/red_D.png) | D                                                       | 2                   | **Yes** (only if hit either from the sides or back)          |
| Switch    | ![](images/pieces/blue_S.png) | ![](images/pieces/red_S.png) | S                                                       | 2                   | **No**                                                       |
| King      | ![](images/pieces/blue_K.png) | ![](images/pieces/red_K.png) | K                                                       | 1                   | **Yes** (if hit from any side)                               |

### Laser

Each player has one Laser that remains in the corner of the game board throughtout the game. The laser is not a playing piece and cannot be elliminated from play.

### Deflector

The mirrored side of the Deflector reflects the laser *90 degrees*. 
A Deflector is eliminated from play when any of it's non-mirrored surfaces are hit by the laser.

### Defender

The front side of a Defender blocks the laser and the Defender will remain in play if hit from the front. 
A Defender is eliminated from play only if the laser strikes either of its sides or its back.

### Switch

Both sides of the Switch reflect the laser *90 degrees*. The Switch can also swap places with an adjacent Deflector or Defender (see [Special Move]() section of Movement Rules).
A switch can never be eliminated from play.

#### King

The King is the most important piece for each side. If hit with a laser, it is destroyed and its owner loses the game. Similar to a [king](https://en.wikipedia.org/wiki/King_(chess)) in chess, the King pieces are comparatively weak, and so are often not moved unless under duress.
All sides of the King are strikeable.



## How to play (Steps)

1. The Blue/White player goes first.
   Players take turns with each player moving only their own pieces. All playing pieces, including Kings can be moved. (see [Movement Rules](#movement-rules)) Note: Laser's are not playing movable.

2. On a turn, a player must first take **one** of the following actions:

   **A)** Move any one piece one space in any direction (including diagonally) following the Movement Rules.

   **B)** Rotate a piece 90 degrees in either direction without the moving spaces.

   **C)** Rotate his or her own Laser to point in the direction of wither first column or first row. Rotation of the Laser must always be done before it is fired at the end of a turn.

3. To complete a turn, the player must activate his or her own laser.
   Pieces are removed from the board based on where the beam lands. Refer to [**Pieces**](#pieces) for a description of when and how a piece is eliminated from play.
   If the laser beam lands on a player's own piece, the piece is still eliminated from play.

   > **IMPORTANT**
   > The laser is fired only one time at the end of a player's turn and the turn is over whether or not the laser hits a piece. A laser cannot be fired as a "test" mid-turn while a player is still deciding on a move to make. Once a move is made the move cannot be taken back and the Laser must be fired

4. Red/Gray pieces can never move into spaces with blue helix patterns and Blue/White pieces can never move into squares containing red helix patterns. (Located allong the edges of the board)

#### Wining the Game

When either laser beam lands on a King piece, that King is removed and the game is over. If you are the player whose King remains–**YOU WIN!**
If you accidentally hit your own King–**YOU LOSE!**. Your opponent wins the game.



## Movement Rules

1. A piece may only be moved **OR** rotated in one turn, not both.
2. A piece may only be rotated 90 degrees at a time.

#### Special Move

The special move is made only by a *Switch* piece. The Switch may swap places with an adjacent Deflector or Defender of either color. Neither piece rotates during the swap. 
A Switch cannot swap places with a King or another Switch piece.



## Board Setups

### Ace

|       | a                                | b                                  | c                                | d                                | e                                | f                               | g                               | h                               | i                                | j                                  |
| ----- | -------------------------------- | ---------------------------------- | -------------------------------- | -------------------------------- | -------------------------------- | ------------------------------- | ------------------------------- | ------------------------------- | -------------------------------- | ---------------------------------- |
| **8** | ![](images/pieces/red_L_r1.png)  | ![](images/pieces/blue-helix.png) | ![](images/pieces/blank.png)     | ![](images/pieces/blank.png)     | ![](images/pieces/red_D_r1.png)  | ![](images/pieces/red_K.png)    | ![](images/pieces/red_D_r1.png) | ![](images/pieces/red_B_r3.png) | ![](images/pieces/red-helix.png) | ![](images/pieces/blue-helix.png) |
| **7** | ![](images/pieces/red-helix.png) | ![](images/pieces/blank.png)       | ![](images/pieces/red_B.png)     | ![](images/pieces/blank.png)     | ![](images/pieces/blank.png)     | ![](images/pieces/blank.png)    | ![](images/pieces/blank.png)    | ![](images/pieces/blank.png)    | ![](images/pieces/blank.png)     | ![](images/pieces/blue-helix.png) |
| **6** | ![](images/pieces/red-helix.png) | ![](images/pieces/blank.png)       | ![](images/pieces/blank.png)     | ![](images/pieces/blue_B_r1.png) | ![](images/pieces/blank.png)     | ![](images/pieces/blank.png)    | ![](images/pieces/blank.png)    | ![](images/pieces/blank.png)    | ![](images/pieces/blank.png)     | ![](images/pieces/blue-helix.png) |
| **5** | ![](images/pieces/red_B_r2.png)  | ![](images/pieces/blank.png)       | ![](images/pieces/blue_B.png)    | ![](images/pieces/blank.png)     | ![](images/pieces/red_S.png)     | ![](images/pieces/red_S_r1.png) | ![](images/pieces/blank.png)    | ![](images/pieces/red_B_r3.png) | ![](images/pieces/blank.png)     | ![](images/pieces/blue_B_r1.png)   |
| **4** | ![](images/pieces/red_B_r3.png)  | ![](images/pieces/blank.png)       | ![](images/pieces/blue_B_r1.png) | ![](images/pieces/blank.png)     | ![](images/pieces/blue_S_r1.png) | ![](images/pieces/blue_S.png)   | ![](images/pieces/blank.png)    | ![](images/pieces/red_B_r2.png) | ![](images/pieces/blank.png)     | ![](images/pieces/blue_B.png)      |
| **3** | ![](images/pieces/red-helix.png) | ![](images/pieces/blank.png)       | ![](images/pieces/blank.png)     | ![](images/pieces/blank.png)     | ![](images/pieces/blank.png)     | ![](images/pieces/blank.png)    | ![](images/pieces/red_B_r3.png) | ![](images/pieces/blank.png)    | ![](images/pieces/blank.png)     | ![](images/pieces/blue-helix.png) |
| **2** | ![](images/pieces/red-helix.png) | ![](images/pieces/blank.png)       | ![](images/pieces/blank.png)     | ![](images/pieces/blank.png)     | ![](images/pieces/blank.png)     | ![](images/pieces/blank.png)    | ![](images/pieces/blank.png)    | ![](images/pieces/red_B_r2.png) | ![](images/pieces/blank.png)     | ![](images/pieces/blue-helix.png) |
| **1** | ![](images/pieces/red-helix.png) | ![](images/pieces/blue-helix.png) | ![](images/pieces/blue_B_r1.png) | ![](images/pieces/blue_D.png)    | ![](images/pieces/blue_K.png)    | ![](images/pieces/blue_D.png)   | ![](images/pieces/blank.png)    | ![](images/pieces/blank.png)    | ![](images/pieces/red-helix.png) | ![](images/pieces/blue_L.png)      |

### Curiosity

|       | a                                | b                                  | c                                | d                                | e                                | f                               | g                               | h                               | i                                | j                                  |
| ----- | -------------------------------- | ---------------------------------- | -------------------------------- | -------------------------------- | -------------------------------- | ------------------------------- | ------------------------------- | ------------------------------- | -------------------------------- | ---------------------------------- |
| **8** | ![](images/pieces/red_L_r1.png)  | ![](images/pieces/blue-helix.png) | ![](images/pieces/blank.png)     | ![](images/pieces/blank.png)     | ![](images/pieces/red_D_r1.png)  | ![](images/pieces/red_K.png)    | ![](images/pieces/red_D_r1.png) | ![](images/pieces/red_S_r1.png) | ![](images/pieces/red-helix.png) | ![](images/pieces/blue-helix.png) |
| **7** | ![](images/pieces/red-helix.png) | ![](images/pieces/blank.png)       | ![](images/pieces/blank.png)     | ![](images/pieces/blank.png)     | ![](images/pieces/blank.png)     | ![](images/pieces/blank.png)    | ![](images/pieces/blank.png)    | ![](images/pieces/blank.png)    | ![](images/pieces/blank.png)     | ![](images/pieces/blue-helix.png) |
| **6** | ![](images/pieces/red-helix.png) | ![](images/pieces/blank.png)       | ![](images/pieces/blank.png)     | ![](images/pieces/blue_B_r1.png) | ![](images/pieces/blank.png)     | ![](images/pieces/blank.png)    | ![](images/pieces/red_B_r2.png) | ![](images/pieces/blank.png)    | ![](images/pieces/blank.png)     | ![](images/pieces/blue-helix.png) |
| **5** | ![](images/pieces/red_B_r2.png)  | ![](images/pieces/blue_B.png)      | ![](images/pieces/blank.png)     | ![](images/pieces/blank.png)     | ![](images/pieces/blue_B_r3.png) | ![](images/pieces/red_S_r1.png) | ![](images/pieces/blank.png)    | ![](images/pieces/blank.png)    | ![](images/pieces/red_B_r3.png)  | ![](images/pieces/blue_B_r1.png)   |
| **4** | ![](images/pieces/red_B_r3.png)  | ![](images/pieces/blue_B_r1.png)   |                                  | ![](images/pieces/blank.png)     | ![](images/pieces/blue_S_r1.png) | ![](images/pieces/red_B_r1.png) | ![](images/pieces/blank.png)    | ![](images/pieces/blank.png)    | ![](images/pieces/red_B_r2.png)  | ![](images/pieces/blue_B.png)      |
| **3** | ![](images/pieces/red-helix.png) | ![](images/pieces/blank.png)       | ![](images/pieces/blank.png)     | ![](images/pieces/blue_B.png)    | ![](images/pieces/blank.png)     | ![](images/pieces/blank.png)    | ![](images/pieces/red_B_r3.png) | ![](images/pieces/blank.png)    | ![](images/pieces/blank.png)     | ![](images/pieces/blue-helix.png) |
| **2** | ![](images/pieces/red-helix.png) | ![](images/pieces/blank.png)       | ![](images/pieces/blank.png)     | ![](images/pieces/blank.png)     | ![](images/pieces/blank.png)     | ![](images/pieces/blank.png)    | ![](images/pieces/blank.png)    | ![](images/pieces/red_B_r2.png) | ![](images/pieces/blank.png)     | ![](images/pieces/blue-helix.png) |
| **1** | ![](images/pieces/red-helix.png) | ![](images/pieces/blue-helix.png) | ![](images/pieces/blue_S_r1.png) | ![](images/pieces/blue_D.png)    | ![](images/pieces/blue_K.png)    | ![](images/pieces/blue_D.png)   | ![](images/pieces/blank.png)    | ![](images/pieces/blank.png)    | ![](images/pieces/red-helix.png) | ![](images/pieces/blue_L.png)      |
