import type { Piece } from "@/models/models/piece";
import type { JSX } from "react";
import { Defender } from "./defender";
import { Deflector } from "./deflector";
import { King } from "./king";
import { Laser } from "./laser";
import { Switch } from "./switch";
import type { PieceProps } from "./types";

const pieceTypeComponentMap: Record<Piece["type"], JSX.ElementType> = {
  d: Defender,
  b: Deflector,
  k: King,
  l: Laser,
  s: Switch
} as const;

type FactoryProps = PieceProps;

export const Factory = (props: FactoryProps) => {
  const PieceComponent = pieceTypeComponentMap[props.piece.type];
  if (!PieceComponent) {
    return null;
  }

  return <PieceComponent {...props} />;
};
