import type { CellGrid } from "@/models/cell";
import { Background } from "./background";
import { PositionHelper } from "@/models/helpers/position-helper";

type BackgroundCollectionProps = {
  cellGrid: CellGrid;
  cellLength: number;
};

export const BackgroundCollection = ({ cellGrid, cellLength }: BackgroundCollectionProps) => {
  return (
    <>
      {cellGrid.map((row) => {
        return row.map((cell) => {
          return (
            <Background.Factory
              key={`cb-${cell.id}`}
              cellType={cell.type}
              length={cellLength}
              position={PositionHelper.fromLocation(cell.location, cellLength)}
            />
          );
        });
      })}
    </>
  );
};
