import { Cell as CellBase } from "./cell";
import { Background } from "./background";
import { Collection } from "./collection";
import { Piece } from "./piece";
import { Selection } from "./selection";
import { BackgroundCollection } from "./background-collection";

export const Cell = Object.assign(CellBase, {
    Collection: Collection,
    Piece: Piece,
    Background: Background,
    BackgroundCollection: BackgroundCollection,
    Selection: Selection
});