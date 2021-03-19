import { CellTypesEnum, PlayerTypesEnum } from "./Enums";
import { isLowerCase } from "../utils/Utils";

class Cell {
    /**
        * A Cell on the board grid!
        * 
        * @param {string} cellType the cell type. @see CellTypesEnum
        * @param {Location} location the location of the cell
        */
    constructor(type, location) {
        if (type === CellTypesEnum.NORMAL) {
            // "normal" cell types are colorless
            this.color = null;
        } else {
            this.color = isLowerCase(type) ? PlayerTypesEnum.RED : PlayerTypesEnum.BLUE; // color (red, blue)
        }
        this.type = type.toLowerCase();
        this.location = location;
        this.imageName = `${this.color}-${CellUtils.getCellName(type)}`;
    }
}

class CellUtils {

    /**
     * Get the cell name in format (color)-(name)
     * 
     * @returns {string} the cell name (reserved laser normal)
     */
    static getCellName(cellType) {
        switch (cellType) {
            case CellTypesEnum.NORMAL:
                return "normal"; // an empty cell

            case CellTypesEnum.RESERVED:
                return "reserved"; // cell reserved for the pieces of specific player pieces only

            case CellTypesEnum.LASER:
                return "laser"; // cell for lasers
        }
    }

}

export default Cell;