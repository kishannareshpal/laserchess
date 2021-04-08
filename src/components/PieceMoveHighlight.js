import React from "react";
import { Image } from "react-konva";
import useImage from "use-image";
import SpecialMoveSVG from "../assets/special-move-highlight.svg";
import NormalMoveSVG from "../assets/normal-move-highlight.svg";
import { MovementTypesEnum } from "../models/Enums";

const PieceMoveHighlight = ({ cellSize, movement, onChoose }) => {

    const [specialMoveSVG] = useImage(SpecialMoveSVG);
    const [normalMoveSVG] = useImage(NormalMoveSVG);

    return (
        <Image image={movement.type === MovementTypesEnum.NORMAL ? normalMoveSVG : specialMoveSVG}
            x={movement.destLocation.colIndex * cellSize}
            y={movement.destLocation.rowIndex * cellSize}
            onClick={() => onChoose(movement)}
            onTap={() => onChoose(movement)}
            fill="#16db6576"
            width={cellSize}
            height={cellSize} />
    );



};

export default PieceMoveHighlight;