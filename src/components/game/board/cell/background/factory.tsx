import type { Cell } from "@/models/cell";
import { ReservedPlayerOne } from "./reserved-player-one";
import type { CellBackgroundProps } from "./types";
import type { JSX } from "react";
import { ReservedPlayerTwo } from "./reserved-player-two";

const cellTypeBackgroundComponentMap: Record<Cell["type"], JSX.ElementType> = {
    'reserved-player-one': ReservedPlayerOne,
    'reserved-player-two': ReservedPlayerTwo,
    'normal': null,
    'laser-blue': null,
    'laser-red': null,
} as const;

type FactoryProps = CellBackgroundProps;

export const Factory = (props: FactoryProps) => {
    const BackgroundComponent = cellTypeBackgroundComponentMap[props.cellType];
    if (!BackgroundComponent) {
        return null;
    }

    return <BackgroundComponent {...props} />;
}