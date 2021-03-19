# Laser Hit Action Notation (LHAN)

**Laser Hit Action Notation** (**LHAN** in short) provides a general naming scheme for the [actions](#actions) taken by the laser beam on hitting a side of the piece at a given orientation.

This notation is provided in both `.json` or `.yaml|yml` format.

-   Read **[`📄 laser-v-piece.yml`](../src/assets/laser-v-piece.yml)**
-   Read **[`📄 laser-v-piece.json`](../src/assets/laser-v-piece.json)**

#### Structure

The structure of the notation is as follows:

```yml
[direction]:
    [pieceType]:
        [pieceOrientation]: [actionType]
        …
    …
…

# Key/Value legend:
# -------
# [direction] - the direction from where the laser is hitting the piece (top bottom left right)
# [pieceType] - the identification letter in lowercase indicating the piece (k l d b s)
# [pieceOrientation] - the orientation of the piece (0 90 180 270)
# [actionType] - the action to take (see possible actions bellow)
```

#### Example

A snippet of the `.yml` file, indicating what action to take when the laser hits a `defender` piece from the `top` while the piece is rotated in any of the four orientations:

```yml
# …
top:
    d:
        0: kill
        90: kill
        180: nothing
        270: kill
    # …
# …
```

## Actions

The action to take when the laser coming from one of the four directions (`left` `right` `bottom` `top`) hits the piece (`k` `l` `s` `d` `b`) that can be rotated in (`0` `90` `180` `270`) are:

| Type          | Description                                                                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`kill`**    | Stop the laser beam and capture the piece.                                                                                                        |
| **`nothing`** | Stop the laser beam and do nothing<br>(happens when the laser beam hits any other (or self) laser piece or the shield side of the Defender piece) |
| **`top`**     | Deflect the laser beam to the top.                                                                                                                |
| **`left`**    | Deflect the laser beam to the left.                                                                                                               |
| **`right`**   | Deflect the laser beam to the right.                                                                                                              |
| **`bottom`**  | Deflect the laser beam to the bottom.                                                                                                             |

## Piece orientations

<style>
    .center {
        text-align:center
    }
</style>

<table>
   <thead>
      <tr>
         <th>Piece</th>
         <th>0 degrees</th>
         <th>90 degrees</th>
         <th>180 degrees</th>
         <th>270 degrees</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td><b><code>Laser</code></b></td>
         <td><img src="images/pieces/blue_l.png" alt="Blue Laser Piece"><br><img src="images/pieces/red_l.png" alt="Red Laser Piece"></td>
         <td><img src="images/pieces/blue_l_90.png" alt="Blue Laser Piece Rotated 90deg"><br><img src="images/pieces/red_l_90.png" alt="Red Laser Piece Rotated 90deg"></td>
         <td><img src="images/pieces/blue_l_180.png" alt="Blue Laser Piece Rotated 180deg"><br><img src="images/pieces/red_l_180.png" alt="Red Laser Piece Rotated 180deg"></td>
         <td><img src="images/pieces/blue_l_270.png" alt="Blue Laser Piece Rotated 270deg"><br><img src="images/pieces/red_l_270.png" alt="Red Laser Piece Rotated 270deg"></td>
      </tr>
      <tr>
         <td><b><code>Deflector</code></b></td>
         <td><img src="images/pieces/blue_b.png"      alt="Blue Deflector Piece               "><br><img src="images/pieces/red_b.png" alt="Red Deflector Piece"></td>
         <td><img src="images/pieces/blue_b_90.png"   alt="Blue Deflector Piece Rotated 90deg "><br><img src="images/pieces/red_b_90.png" alt="Red Deflector Piece Rotated 90deg"></td>
         <td><img src="images/pieces/blue_b_180.png"  alt="Blue Deflector Piece Rotated 180deg"><br><img src="images/pieces/red_b_180.png" alt="Red Deflector Piece Rotated 180deg"></td>
         <td><img src="images/pieces/blue_b_270.png"  alt="Blue Deflector Piece Rotated 270deg"><br><img src="images/pieces/red_b_270.png" alt="Red Deflector Piece Rotated 270deg"></td>
      </tr>
      <tr>
         <td><b><code>Defender</code></b></td>
         <td><img src="images/pieces/blue_d.png" alt="Blue Defender Piece"><br><img src="images/pieces/red_d.png" alt="Red Defender Piece"></td>
         <td><img src="images/pieces/blue_d_90.png" alt="Blue Defender Piece Rotated 90deg "><br><img src="images/pieces/red_d_90.png" alt="Red Defender Piece Rotated 90deg"></td>
         <td><img src="images/pieces/blue_d_180.png" alt="Blue Defender Piece Rotated 180deg"><br><img src="images/pieces/red_d_180.png" alt="Red Defender Piece Rotated 180deg"></td>
         <td><img src="images/pieces/blue_d_270.png" alt="Blue Defender Piece Rotated 270deg"><br><img src="images/pieces/red_d_270.png" alt="Red Defender Piece Rotated 270deg"></td>
      </tr>
      <tr>
         <td><b><code>Switch</code></b></td>
         <td><img src="images/pieces/blue_s.png" alt="Blue Switch Piece"><br><img src="images/pieces/red_s.png" alt="Red Switch Piece"></td>
         <td><img src="images/pieces/blue_s_90.png" alt="Blue Switch Piece Rotated 90deg "><br><img src="images/pieces/red_s_90.png" alt="Red Switch Piece Rotated 90deg"></td>
         <td><img src="images/pieces/blue_s_180.png" alt="Blue Switch Piece Rotated 180deg"><br><img src="images/pieces/red_s_180.png" alt="Red Switch Piece Rotated 180deg"></td>
         <td><img src="images/pieces/blue_s_270.png" alt="Blue Switch Piece Rotated 270deg"><br><img src="images/pieces/red_s_270.png" alt="Red Switch Piece Rotated 270deg"></td>
      </tr>
      <tr>
         <td><b><code>King</code></b></td>
         <td class="center" colspan="4"><img src="images/pieces/blue_k.png" alt="Blue King Piece"> <img src="images/pieces/red_k.png" alt="Red King Piece"></td>
      </tr>
   </tbody>
</table>

> The King piece has the same effect on the laser on any of it's sides. So the rotation is ignored here, although it is possible to rotate the piece on the game.\
> The King piece is killed when the laser hits any of it's sides.

## Laser hit diagram for Pieces

![Diagram legend](images/laser-v-pieces/legend.png)

| Piece                                 | Action                                                                                | Description                                                                                                                                                          |
| ------------------------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [**`Deflector`**](Guide.md#deflector) | ![Laser Hit diagram for Deflector Piece](images/laser-v-pieces/laser_v_deflector.png) | The mirrored side of the `deflector` deflects the laser 90 degrees. And eliminated from play when any of it's non-mirrored surfaces are hit by the laser.            |
| [**`Defender`**](Guide.md#defender)   | ![Laser Hit diagram for Defender Piece](images/laser-v-pieces/laser_v_defender.png)   | The front side of the `defender` blocks the laser, and nothing happens. However it can be eliminated from play if the laser strikes either of its sides or its back. |
| [**`Switch`**](Guide.md#switch)       | ![Laser Hit diagram for Switch Piece](images/laser-v-pieces/laser_v_switch.png)       | Both sides of the `switch` deflects the laser 90 degrees.                                                                                                            |
| [**`Laser`**](Guide.md#laser)         | ![Laser Hit diagram for Laser Piece](images/laser-v-pieces/laser_v_laser.png)         | Nothing happens when the laser strikes another (or self) `laser` piece.                                                                                              |
| [**`King`**](Guide.md#king)           | ![Laser Hit diagram for King Piece](images/laser-v-pieces/laser_v_king.png)           | The game ends when the laser strikes any of the side of the `king` piece.                                                                                            |
