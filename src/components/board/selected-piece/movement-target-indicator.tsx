import { Image } from "react-konva";
import useImage from "use-image";
import specialMoveHighlightSvg from "@/assets/special-move-highlight.svg";
import normalMoveHighlightSvg from "@/assets/normal-move-highlight.svg";
import type { Movement } from "@/models/models/movement";
import { PositionHelper } from "@/models/helpers/position-helper";
import { MovementHelper } from "@/models/helpers/movement-helper";

type MovementTargetIndicatorProps = {
    movement: Movement,
    cellLength: number,
    onPress: (movement: Movement) => void,
}

export const MovementTargetIndicator = (
    { 
        cellLength, 
        movement, 
        onPress
    }: MovementTargetIndicatorProps
) => {
    const [normalMoveHighlightImage] = useImage(normalMoveHighlightSvg);
    const [specialMoveHighlightImage] = useImage(specialMoveHighlightSvg);

    const handleOnPress = () => {
        onPress(movement)
    }

    const image = movement.type === 'normal' ? normalMoveHighlightImage : specialMoveHighlightImage;
    const position = PositionHelper.fromLocation(movement.targetCellLocation, cellLength)

    return (
        <Image 
            id={`mt-${MovementHelper.toAN(movement)}`}
            image={image}
            x={position.x}
            y={position.y}
            width={cellLength}
            height={cellLength} 
            fill="#16db6576"
            onClick={handleOnPress}
            onTap={handleOnPress}
            onMouseOver={(e) => {
                e.target.getStage().container().style.cursor = "pointer";
            }}
            onMouseOut={(e) => {
                e.target.getStage().container().style.cursor = "default";
            }}
        />
    );
};