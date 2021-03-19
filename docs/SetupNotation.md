# Setup Notation (SN)

There exists no official notation for the board setup in Laser Chess, so we will introduce an unofficial notation that will be used in this game. We will call our notation **Setup Notation**, basing on the standard [Forsyth–Edwards Notation (FEN) for chess](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation).

The purpose of this notation is to provide all the necessary information to restart a game from a particular position.

### Record

A **record** defines a particular game position, all in one text line and using only the ASCII character set.

```bash
# Example of SN for starting position (Ace):
l++3d++kd++b++2/2b7/3B+6/b++1B1ss+1b+++1B+/b+++1B+1S+S1b++1B/6b+++3/7B++2/2B+DKD3L
```

#### Piece placement

The piece placement follows the Blue player's perspective. Each row is described, starting with row 8 and ending with row 1; within each row, the contents of each square are described from column "a" through "j".

Following the [Algebraic Notation (AN)](#pieces), each piece is identified by a single letter taken from the standard English names (king = "K", switch = "S", defender = "D", deflector = "B" and laser = "L").

Blue player pieces are designated using upper case letters ("KSDBL") while Red player pieces use lowercase ("ksdbl").

Empty squares are noted using digits 1 through 9 (the number of empty squares). For 10 empty squares (entire row) use "\*".

The initial piece rotation is indicated by "+" sign in front of the piece letter. One "+" sign represents one 90deg rotation.
For representing the piece "D" in 180deg, use double "+" sign (D++). See the table below:

| Sign | Rotation | Example |
| ---- | -------- | ------- |
| +    | 90deg    | `b+`    |
| ++   | 180deg   | `b++`   |
| +++  | 270deg   | `b+++`  |

Each row is separated by "/".
